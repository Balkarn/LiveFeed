import flair
import mysql.connector as sql
from configparser import ConfigParser

def parse_config():
    config = ConfigParser()
    config.read('../config.ini')
    return config

class SentimentAnalysis():
    def __init__(self):
        self.flair_sentiment = flair.models.TextClassifier.load('sentiment')
        self.new_feedback = False
        self.last_id = 0
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
                WHERE FeedbackID > %s AND QuestionType = 'open')
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
    def __init__(self):
        self.last_id = 0



class GenerateMeetingSummary():
    def __init__(self):
       pass

    def dosomething(self):
        # do something
        pass

class Polling():
    def __init__(self):
        self.config = parse_config()
        self.dbconfig = dict(self.config.items('DatabaseCredentials'))

    def checktemplatefeedback(self, templateId, sentiment_lastid, popular_lastid):
        conn = None
        try:
            conn = sql.connect(**self.dbconfig)
            c = conn.cursor()
            query = """
                SELECT FeedbackID FROM feedback 
                INNER JOIN template_feedback USING (FeedbackID) 
                INNER JOIN template_questions USING (QuestionID) 
                WHERE template_feedback.TemplateID = %s AND QuestionType = 'open'
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
    sa = SentimentAnalysis()
    popular = RepeatFeedbackAnalysis()
    poll = Polling()
    print(poll.checktemplatefeedback(1, sa.last_id, popular.last_id))
    sa.analyse()
