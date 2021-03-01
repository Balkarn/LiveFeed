import flair
import mysql.connector as sql
from configparser import ConfigParser

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
                   (QuestionType = 'open' OR QuestionType = 'multiple')
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
        self.last_id = 0
        self.db_obj = database
		self.feedback = {}
	
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
		clean_text = re.sub(r'[^\w\s-.]', '', text)
		clean_text = clean_text.lower()
		#
		tokens = self.tokenize_data(clean_text)
		tokens = self.replace_contractions(tokens)
		tokens = lemmatize_data(tokens)
		tokens = stopword_removal(tokens, ())
		return tokens
	
	def chunk_data(pos_tokens, parse_grammar):
		parser = RegexpParser(parse_grammar)
		filtered_data = parser.parse(pos_tokens)
		#
		print(list(filtered_data))
		Tree.fromstring(str(filtered_data)).pretty_print()
		return filtered_data
	
	def chunk_noun_phrases(pos_tokens):
		grammar = """
		NP: {(<PDT>?<DT>|<PRP.>) <RB>? (<JJ.*>|<RB.*>)* (<CC>?(<JJ.*>|<RB.*>))* (<NN><POS>?)+ (<CC>?(<NN><POS>?))*}
		    {<.*> (<NN><POS>?)+ (<CC>?(<NN><POS>?))*}
			{<PDT>?<DT>}
			{<TO><PRP>} 
		NOTNP: {<.*>*}
		       }<NP>|<NP><CC><NP>{
		"""
		return chunk_data(pos_tokens, grammar)

	def analyse(self, meetingid):
        feedback_list = self.fetch_meeting_feedback(meetingid)
		processed_feedback = []
		for feedback in feedback_list:
			processed = clean_data[feedback]
			processed = pos_tag(processed)
			processed = chunk_noun_phrases(processed)
			processed_feedback.append(processed)
			print(processed)
			print("")
		"""
		1) Either could 
		- chunk based on pos 
		- ngram then pos
		2) 
		3) 
		"""	

	
	def fetch_meeting_feedback(self, meetingid):
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
                   WHERE MeetingID = %s AND 
                   (QuestionType = 'open' OR QuestionType = 'multiple')
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

class GenerateMeetingSummary():
    def __init__(self):
       pass
	
	
	def get_moodaverage(self, meetingid):
		conn = None
        try:
            conn = sql.connect(**self.db_obj.dbconfig)
            c = conn.cursor()
			query = """
				SELECT avgs.UserID, moods.Mood
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
            c.execute(query, (meetingid))
			result = c.fetchall()
			moodavgs = {}
			avgmood = 0
			if len(result) > 0:
				for row in result:
					moodavgs[row[0]] = row[1]
					avgmood += row[2]
				avgmood /= len(result)

				query2 = """
					SELECT Mood FROM moods
					WHERE MoodVal = %s
				"""
				c.execute(query, ( int(round(avgmood)) ))
				result2 = c.fetchall()
				if len(result2) == 1:
					moodavgs['totalavg'] = c.fetchall()[0][0]
				
            return moodavgs
        except sql.Error as err:
            print(f"-[MySQL Error] {err}")
            return False
        finally:
            if conn:
                conn.close()

	def get_moodsummary(self)
		pass
		"Get a summary of the moods"
	
	def get_repeatfeedback(self)

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
                WHERE template_feedback.TemplateID = %s 
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


if __name__ == "__main__":
    dbi = DatabaseInteraction()
    sa = SentimentAnalysis(dbi)
    popular = RepeatFeedbackAnalysis(dbi)
    poll = Polling(dbi)
    print(poll.checktemplatefeedback(1, sa.last_id, popular.last_id))
    sa.analyse()
