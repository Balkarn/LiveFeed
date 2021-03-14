import flair
import mysql.connector as sql
from configparser import ConfigParser
from datetime import datetime, timedelta

from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk import Tree, RegexpParser, pos_tag
import re

import gensim.downloader as gensim_dl
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
		self.model = gensim_dl.load('glove-twitter-200')
		self.feedback_data = {}
		self.last_clean_op = datetime.now()
		self.last_id = 0

	def remove_meeting_data(self, meetingid):
		del self.feedback_data[meetingid]
		# delete personal data from database
	
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

	def chunk_adjective_phrases(self, pos_tokens):
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

	def analyse(self):
		feedback_list = self.fetch_feedback()
		for (feedbackid, meetingid, questionid, feedback) in feedback_list:
			processed = self.clean_data(feedback, ())
			processed = pos_tag(processed)
			if len(processed) <= 2:
				processed = self.chunk_data(processed, "AJJP: {<.*>*}")
			else:
				processed = self.chunk_adjective_phrases(processed)
			for chunk in processed:
				if isinstance(chunk, Tree) and chunk.label() == "AJJP":
					phrase = " ".join(word[0] for word in list(chunk))
					if len(phrase) > 2: # eliminate one and two letter words
						if questionid == None:
							questionid = "_"
						if meetingid not in self.feedback_data:
							self.feedback_data[meetingid] = {}
						if questionid not in self.feedback_data[meetingid]:
							self.feedback_data[meetingid][questionid] = [[],[]]
						self.feedback_data[meetingid][questionid][0].append(phrase)
						self.feedback_data[meetingid][questionid][1].append(self.str_to_vec(chunk))
		return True

	def findsimilar(self, vectors, phrases):
		similar_phrases = []
		working_idx = list(range(0, len(vectors)-1))
		while len(working_idx) > 0:
			current_vec = working_idx[0]
			similar_phrases.append([phrases[current_vec]])
			working_idx.remove(current_vec)
			for vec_i in working_idx:
				distance = cosine(vectors[current_vec], vectors[vec_i])
				if distance <= 0.20:
					working_idx.remove(vec_i)
					similar_phrases[-1].append(phrases[vec_i])

			if len(similar_phrases[-1]) == 1:
				similar_phrases.pop(-1)
		return similar_phrases

	def meeting_findsimilar(self, meetingid):
		if meetingid not in self.feedback_data:
			return []
		vectors = []
		for y in self.feedback_data[meetingid].values():
			vectors.extend(y[1])
		phrases = []
		for y in self.feedback_data[meetingid].values():
			phrases.extend(y[0])
		return self.findsimilar(vectors, phrases)


	def question_findsimilar(self, meetingid, questionid):
		if meetingid not in self.feedback_data or questionid not in self.feedback_data[meetingid]:
			return []
		vectors = self.feedback_data[meetingid][questionid][1]
		phrases = self.feedback_data[meetingid][questionid][0]
		return self.findsimilar(vectors, phrases)


	def fetch_feedback(self):
		conn = None
		try:
			conn = sql.connect(**self.db_obj.dbconfig)
			c = conn.cursor()
			query = """
				(SELECT FeedbackID, MeetingID, QuestionID, Feedback FROM feedback 
				INNER JOIN template_feedback USING (FeedbackID) 
				INNER JOIN template_questions USING (QuestionID) 
				WHERE FeedbackID > %s
				AND (QuestionType = 'open'))
				UNION
				(SELECT FeedbackID, MeetingID, NULL, Feedback FROM feedback 
				INNER JOIN general_feedback USING (FeedbackID) 
				WHERE FeedbackID > %s) 
				ORDER BY FeedbackID; 
			"""
			c.execute(query, (self.last_id, self.last_id))
			result = c.fetchall()
			if len(result) > 0:
				self.last_id = result[-1][0]

			# cleanup old meetings
			if datetime.now() - self.last_clean_op >= timedelta(1):
				self.remove_old_meetings()
			return result
		except sql.Error as err:
			print(f"-[MySQL Error] {err}")
			return []
		finally:
			if conn:
				conn.close()

	def remove_old_meetings(self):
		conn = None
		try:
			conn = sql.connect(**self.db_obj.dbconfig)
			c = conn.cursor()
			query = """
				SELECT MeetingID FROM meetings WHERE StartTime <= CURRENT_TIMESTAMP() - (INTERVAL 2 DAY)
			"""
			c.execute(query)
			result = c.fetchall()
			for row in result:
				if row[0] in self.feedback_data:
					del self.feedback_data[row[0]]
			self.last_clean_op = datetime.now()
			return result
		except sql.Error as err:
			print(f"-[MySQL Error] {err}")
		finally:
			if conn:
				conn.close()


	def insert_repeat_feedback(self, meetingid, feedback: list):
		if len(feedback) == 0:
			return False
		query1 = "INSERT INTO popular_feedback VALUES (NULL, 0, %s, %s)"
		query2 = "INSERT INTO popular_feedback VALUES (%s, %s, %s, %s)"
		conn = None
		try:
			conn = sql.connect(**self.db_obj.dbconfig)
			c = conn.cursor()
			for f1 in feedback:
				c.execute(query1, (meetingid, f1[0]))
				if len(f1) > 1:
					clusterid = c.lastrowid
					query_args = []
					index = 1
					for f2 in f1[1:]:
						query_args.append((clusterid, index, meetingid, f2))
						index += 1
					c.executemany(query2, query_args)
			conn.commit()
			return True
		except sql.Error as err:
			print(f"-[MySQL Error] {err}")
			return False
		finally:
			if conn:
				conn.close()

	def get_meeting_summary(self, meetingid):
		similar_phrases = self.meeting_findsimilar(meetingid)
		#del self.feedback_data[meetingid]
		self.insert_repeat_feedback(meetingid, similar_phrases)
		return sorted(similar_phrases, key=lambda p: len(p))

	def get_question_summary(self, meetingid, questionid):
		similar_phrases = self.question_findsimilar(meetingid, questionid)
		return sorted(similar_phrases, key=lambda p: len(p))

class GenerateMeetingSummary():
	def __init__(self, database):
		self.db_obj = database

	def get_moodaverage(self, meetingid):
		conn = None
		moodavgs = {}
		moodtally = {}
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
			avgmood = 0
			if len(result) == 0:
				return {}
			for row in result:
				if row[1] in moodtally:
					moodtally[row[1]] += 1
				else:
					moodtally[row[1]] = 1

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
			return {'Average': moodavgs, 'Tally': moodtally}
		except sql.Error as err:
			print(f"-[MySQL Error] {err}")
			return {'Average': moodavgs, 'Tally': moodtally}
		finally:
			if conn:
				conn.close()

	def question_getmoodaverage(self, meetingid, questionid):
		query = """
			SELECT avgs.UserID, moods.Mood, avgs.moodavg
			FROM moods
			INNER JOIN 
			(
				SELECT UserID, ROUND(AVG(MoodVal)) AS moodavg FROM mood_feedback
				INNER JOIN feedback USING (FeedbackID)
				INNER JOIN template_feedback USING (FeedbackID)
				INNER JOIN moods USING (Mood)
				WHERE QuestionID = %s
				AND MeetingID = %s
				GROUP BY UserID
			) avgs ON moods.MoodVal = avgs.moodavg
			ORDER BY avgs.UserID;
		"""
		conn=None
		try:
			conn = sql.connect(**self.db_obj.dbconfig)
			c = conn.cursor()
			c.execute(query, (questionid, meetingid))
			result = c.fetchall()
			moodavgs = {}
			moodtally = {}
			avgmood = 0
			if len(result) == 0:
				return {}
			for row in result:
				if row[1] in moodtally:
					moodtally[row[1]] += 1
				else:
					moodtally[row[1]] = 1
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
			return {'Average':moodavgs, 'Tally':moodtally}
		except sql.Error as err:
			print(f"-[MySQL Error] {err}")
			return False
		finally:
			if conn:
				conn.close()

	def meeting_mood_tally(self, meetingid):
		moodsummary = self.get_moodaverage(meetingid)
		if not moodsummary:
			return {}
		else:
			return moodsummary['Tally']

	def question_mood_tally(self, meetingid, questionid):
		moodsummary = self.question_getmoodaverage(meetingid, questionid)
		if moodsummary:
			return moodsummary['Tally']
		return {}


	def response_tally(self, meetingid, questionid):
		conn = None
		query = "SELECT Feedback FROM template_feedback " \
				"INNER JOIN feedback USING (FeedbackID) " \
				"WHERE QuestionID=%s and MeetingID=%s"
		try:
			conn = sql.connect(**self.db_obj.dbconfig)
			c = conn.cursor()
			c.execute(query, (questionid, meetingid))
			tally = {}
			for feedback in c.fetchall():
				if feedback[0] in tally:
					tally[feedback[0]] += 1
				else:
					tally[feedback[0]] = 1
			return tally
		except sql.Error as err:
			print(f"-[MySQL Error] {err}")
			return False
		finally:
			if conn:
				conn.close()


	def end_meeting(self, meetingid):
		query = "UPDATE meetings SET EndTime=now() WHERE MeetingID=?"
		conn = None
		try:
			conn = sql.connect(**self.db_obj.dbconfig)
			c = conn.cursor()
			c.execute(query, (meetingid, ))
			conn.commit()
		except sql.Error as err:
			print(f"-[MySQL Error] {err}")
			return False
		finally:
			if conn:
				conn.close()


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
		self.popular.last_id = 0
		self.popular.analyse()
		print(self.popular.meeting_findsimilar(meetingid))
		self.popular.last_id = 0
		print(self.popular.fetch_feedback())

	def test_summary(self):
		print(self.summary.response_tally(4))
		print(self.summary.response_tally(5))

if __name__ == "__main__":
	test = Testing()
	#test.test_sa()
	#test.test_sa_summary(1)
	test.test_popular(1)
	test.test_summary()

