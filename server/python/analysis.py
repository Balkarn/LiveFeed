import flair
import mysql.connector as sql
from configparser import ConfigParser

from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk import Tree, RegexpParser, pos_tag
from nltk.corpus import webtext, twitter_samples, knbc
import re

import gensim.downloader as gensim_dl
from gensim.models import Word2Vec
from scipy.spatial.distance import cosine

class DatabaseInteraction():
	def __init__(self):
		self.config = self.parse_config()
		self.dbconfig = dict(self.config.items('DatabaseCredentials'))
	
	def parse_config(self):
		config = ConfigParser()
		config.read('../config.ini')
		return config

class SentimentAnalysis():
	def __init__(self, database):
		self.flair_sentiment = flair.models.TextClassifier.load('sentiment')
		self.new_feedback = False
		self.last_id = 0
		self.db_obj = database
	
	def fetch_feedback(self):
		conn = None
		try:
			conn = sql.connect(**self.db_obj.dbconfig)
			c = conn.cursor()
			query = """
				   (SELECT FeedbackID, Feedback FROM feedback 
				   INNER JOIN general_feedback USING (FeedbackID) 
				   WHERE FeedbackID > %s) 
				   UNION 
				   (SELECT FeedbackID, Feedback FROM feedback 
				   INNER JOIN template_feedback USING (FeedbackID) 
				   INNER JOIN template_questions USING (QuestionID) 
				   WHERE FeedbackID > %s AND 
				   (QuestionType = 'open' OR QuestionType = 'multiple'))
				   ORDER BY FeedbackID; 
			   """
			c.execute(query, (self.last_id, self.last_id))
			result = c.fetchall()
			if len(result) > 0:
				self.last_id = result[-1][0]
			return result
		except sql.Error as err:
			print(f"-[MySQL Error] {err}")
			return []
		finally:
			if conn:
				conn.close()

	
	def insert_mood(self, moods: list):
		if len(moods) == 0:
			return False
		query = "INSERT INTO mood_feedback VALUES (%s, %s)"
		conn = None
		try:
			conn = sql.connect(**self.db_obj.dbconfig)
			c = conn.cursor()
			c.executemany(query, moods)
			conn.commit()
			return True
		except sql.Error as err:
			print(f"-[MySQL Error] {err}")
			return False
		finally:
			if conn:
				conn.close()
	

	def analyse(self):
		feedback_list = self.fetch_feedback()
		mood_feedback = []
		if len(feedback_list) == 0:
			return False
		for feedbackid, feedback in feedback_list:
			s = flair.data.Sentence(feedback)
			self.flair_sentiment.predict(s)
			total_sentiment = s.labels[0]
			score = total_sentiment.score
			score *= -1 if total_sentiment.value == "NEGATIVE" else 1
			if score >= 0.6:
				mood_feedback.append((feedbackid, 'happy'))
			elif score >= -0.5:
				mood_feedback.append((feedbackid, 'neutral'))
			else:
				mood_feedback.append((feedbackid, 'sad'))
		self.insert_mood(mood_feedback)

class RepeatFeedbackAnalysis():
	def __init__(self, database):
		self.last_id = {}
		self.db_obj = database
		self.feedback = {}
		#self.model = gensim_dl.load('word2vec-google-news-300')
		self.corpus = knbc.sents()
		self.model = Word2Vec(self.corpus)
		self.feedback_data = {}
	
	def replace_contractions(self, tokens):
		abbrev_subs = {"n't": ["not"], "'cause": ["because"], "'ve": ["have"], "e'er": ["ever"], "g'day": ["good", "day"], "'d": ["would"], "'ll": ["will"], "'re": ["are"], "'m": ["am"], "ma'am": ["madam"], "ne'er": ["never"], "o'clock": ["of", "the", "clock"], "o'er": ["over"], "'t": ["it"], "y'all": ["you", "all"],"'n'": ["not"]}
		# "'s": ["is"]
		new_tokens = []
		while len(tokens) > 0:
			word = tokens.pop(0)
			if '\'' not in word:
				new_tokens.append(word)
			else:
				if word in abbrev_subs:
					tokens = abbrev_subs[word] + tokens #prepending to tokens allows recursion
				else:
					tokens = word_tokenize(word) + tokens
		return new_tokens

	def tokenize_data(self, text):
		return word_tokenize(text)

	def lemmatize_data(self, tokens):
		lemmatizer = WordNetLemmatizer()
		return [lemmatizer.lemmatize(w) for w in tokens]
	
	def stopword_removal(self, tokens, stopwords):
		filtered_text = list(filter(lambda word: word not in stopwords, tokens))
		return filtered_text

	def clean_data(self, text, stopwords):
		clean_text = re.sub(r"[^.\-\w\s]", "", text)
		clean_text = clean_text.lower()
		#
		tokens = self.tokenize_data(clean_text)
		tokens = self.replace_contractions(tokens)
		tokens = self.lemmatize_data(tokens)
		tokens = self.stopword_removal(tokens, ())
		return tokens
	
	def chunk_data(self, pos_tokens, parse_grammar):
		parser = RegexpParser(parse_grammar)
		filtered_data = parser.parse(pos_tokens)
		#
		print(list(filtered_data))
		Tree.fromstring(str(filtered_data)).pretty_print()
		return filtered_data
	
	def chunk_noun_phrases(self, pos_tokens):
		grammar = """
				AJJP:  {<RB>*(<JJ.*>|<RB.>|<CD>)*}
                       {<PDT>} 
                CCP:   {<CC>}
                NO:    {<NN.*>+} 
                       {<DT>$|<PRP>}
		"""
		return self.chunk_data(pos_tokens, grammar)
	
	def str_to_vec(self, tokens):
		vector = 0
		for (word, word_type) in tokens:
			vector += self.model.wv.get_vector(word)
		return vector
		
	def analyse(self, meetingid):
		feedback_list = self.fetch_meeting_feedback(meetingid)

		processed_feedback = []
		phrases = []
		vectors = []
		
		for (feedbackid, feedback) in feedback_list:
			processed = self.clean_data(feedback, ())
			processed = pos_tag(processed)
			processed = self.chunk_noun_phrases(processed)
			for chunk in processed:
				if isinstance(chunk, Tree) and chunk.label() == "AJJP":
					if len(chunk) == 1:
						chunk = list(chunk)
					processed_feedback.append(chunk)
					phrases.append(" ".join(word[0] for word in chunk))
					vectors.append(self.str_to_vec(chunk))
		phrases.append('very hard')
		vectors.append(self.str_to_vec(pos_tag(['very', 'hard'])))
		if meetingid in self.feedback_data:
			self.feedback[meetingid][0] += phrases
			self.feedback[meetingid][1] += processed_feedback
			self.feedback[meetingid][2] += vectors
		else:
			self.feedback_data[meetingid] = [phrases, processed_feedback, vectors]
	
	def find_similar_phrases(self, meetingid):
		vectors = self.feedback_data[meetingid][2]
		phrases = self.feedback_data[meetingid][0]
		similar_phrases = []
		for i in range(0, len(vectors)):
			similar_phrases.append([phrases[i]])
			for j in range(i+1, len(vectors)):
				distance = cosine(vectors[i], vectors[j])
				if distance <= 0.5:
					similar_phrases[-1].append((phrases[j], distance))

			if len(similar_phrases[-1]) == 1:
				similar_phrases.pop(-1)
		self.feedback_data[meetingid].append(similar_phrases)
		return similar_phrases
	
	def fetch_meeting_feedback(self, meetingid):
		if meetingid not in self.last_id:
			self.last_id[meetingid] = 0
		conn = None
		try:
			conn = sql.connect(**self.db_obj.dbconfig)
			c = conn.cursor()
			query = """
				(SELECT FeedbackID, Feedback FROM feedback 
				INNER JOIN general_feedback USING (FeedbackID) 
				WHERE MeetingID = %s
				AND FeedbackID > %s) 
				UNION 
				(SELECT FeedbackID, Feedback FROM feedback 
				INNER JOIN template_feedback USING (FeedbackID) 
				INNER JOIN template_questions USING (QuestionID) 
				WHERE MeetingID = %s
				AND FeedbackID > %s
				AND (QuestionType = 'open' OR QuestionType = 'multiple'))
				ORDER BY FeedbackID; 
			"""
			c.execute(query, (meetingid, self.last_id[meetingid], meetingid, self.last_id[meetingid]))
			result = c.fetchall()
			if len(result) > 0:
				self.last_id[meetingid] = result[-1][0]
			return result
		except sql.Error as err:
			print(f"-[MySQL Error] {err}")
			return []
		finally:
			if conn:
				conn.close()

class GenerateMeetingSummary():
	def __init__(self, database):
		self.db_obj = database

	def get_moodaverage(self, meetingid):
		conn = None
		try:
			conn = sql.connect(**self.db_obj.dbconfig)
			c = conn.cursor()
			query = """
				SELECT avgs.UserID, moods.Mood, avgs.moodavg
				FROM moods
				INNER JOIN 
				(
					SELECT UserID, ROUND(AVG(MoodVal)) AS moodavg FROM mood_feedback
					INNER JOIN feedback USING (FeedbackID)
					INNER JOIN moods USING (Mood)
					WHERE MeetingID = %s
					GROUP BY UserID
				) avgs ON moods.MoodVal = avgs.moodavg
				ORDER BY avgs.UserID;
			"""
			c.execute(query, (meetingid, ))
			result = c.fetchall()
			moodavgs = {}
			avgmood = 0
			if len(result) == 0:
				return {}
			for row in result:
				moodavgs[row[0]] = row[1]
				avgmood += row[2]
			avgmood /= len(result)

			query2 = """
				SELECT Mood FROM moods
				WHERE MoodVal = %s
				LIMIT 1
			"""
			c.execute(query2, ( int(round(avgmood)), ))
			result2 = c.fetchall()
			if len(result2) == 0:
				return {}
			moodavgs['totalavg'] = result2[0][0]
			query3 = """
				INSERT INTO mood_average VALUES (%s, %s)
			"""
			c.execute(query3, (meetingid, moodavgs['totalavg']))
			conn.commit()
			return moodavgs
		except sql.Error as err:
			print(f"-[MySQL Error] {err}")
			return False
		finally:
			if conn:
				conn.close()

	def get_repeatfeedback(self):
		pass

class Polling():
	def __init__(self, database):
		self.db_obj = database

	def checktemplatefeedback(self, templateId, sentiment_lastid, popular_lastid):
		conn = None
		try:
			conn = sql.connect(**self.db_obj.dbconfig)
			c = conn.cursor()
			query = """
				SELECT FeedbackID FROM feedback 
				INNER JOIN template_feedback USING (FeedbackID) 
				INNER JOIN template_questions USING (QuestionID) 
				WHERE template_questions.TemplateID = %s 
				AND (QuestionType = 'open'
				OR QuestionType = 'multiple')
				ORDER BY FeedbackID DESC
				LIMIT 1;            
			"""
			c.execute(query, (templateId, ))
			result = c.fetchall()
			if result and (sentiment_lastid >= result[0][0] or popular_lastid >= result[0][0]):
				return True
			return False
		except sql.Error as err:
			print(f"-[MySQL Error] {err}")
			return False
		finally:
			if conn:
				conn.close()

class Testing():
	def __init__(self):
		print("Initialising...")
		self.dbi = DatabaseInteraction()
		print("DB Initialised")
		self.sa = SentimentAnalysis(self.dbi)
		print("Sentiment Analysis Initialised")
		self.popular = RepeatFeedbackAnalysis(self.dbi)
		print("Repeat Feedback Initialised")
		self.summary = GenerateMeetingSummary(self.dbi)
		print("Meeting Summary Initialised")
		self.poll = Polling(self.dbi)
		print("Polling Initialised")
		print("Initalisation Complete")

	def test_sa(self):
		self.sa.analyse()

	def test_sa_summary(self, meetingid):
		self.summary.get_moodaverage(meetingid)

	def test_popular(self, meetingid):
		self.popular.analyse(meetingid)
		print(self.popular.find_similar_phrases(meetingid))

	def test_popular_summary(self):
		pass

if __name__ == "__main__":
	test = Testing()
	test.test_sa()
	test.test_sa_summary(1)
	test.test_popular(1)


