import flair
import mysql.connector as sql
from configparser import ConfigParser

def parse_config():
    config = ConfigParser()
    config.read('../config.ini')
    return config

class DatabaseInteraction():
    def __init__(self):
        self.config = parse_config()
        self.dbconfig = dict(self.config.items('DatabaseCredentials'))

    def fetch_feedback(self):
        conn = None
        try:
            conn = sql.connect(**self.dbconfig)
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
	
	def fetch_meeting_feedback(self, meetingid):
        conn = None
        try:
            conn = sql.connect(**self.dbconfig)
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


    def insert_mood(self, moods: list):
        if len(moods) == 0:
            return False
        query = "INSERT INTO mood_feedback VALUES (%s, %s)"
        conn = None
        try:
            conn = sql.connect(**self.dbconfig)
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

class SentimentAnalysis():
    def __init__(self, database):
        self.flair_sentiment = flair.models.TextClassifier.load('sentiment')
        self.new_feedback = False
        self.last_id = 0
        self.db_obj = database

    def analyse(self):
        feedback_list = self.db_obj.fetch_feedback()
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
        self.db_obj.insert_mood(mood_feedback)

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
        feedback_list = self.db_obj.fetch_meeting_feedback(meetingid)
		processed_feedback = []
		for feedback in feedback_list:
			processed = clean_data[feedback]
			processed = pos_tag(processed)
			processed = chunk_noun_phrases(processed)
			processed_feedback.append(processed)
		"""
		1) Either could 
		- chunk based on pos 
		- ngram then pos
		2) 
		3) 
		"""

class GenerateMeetingSummary():
    def __init__(self):
       pass

    def dosomething(self):
        # do something
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
