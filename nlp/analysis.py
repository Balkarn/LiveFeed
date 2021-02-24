import flair
import mysql.connector as sql
from configparser import ConfigParser

def parse_config():
    config = ConfigParser()
    config.read('config.ini')
    return config

class SentimentAnalysis():
    def __init__(self):
        self.flair_sentiment = flair.models.TextClassifier.load('sentiment')
        self.new_feedback = False
        self.last_id = 0
        self.dbconfig = parse_config()

    def fetch_feedback(self):
        conn = None
        try:
            conn = sql.connect(**dict(self.dbconfig.items('DatabaseCredentials')))
            c = conn.cursor()
            query = """
                (SELECT FeedbackID, Feedback FROM feedback 
                INNER JOIN general_feedback USING (FeedbackID)
                WHERE FeedbackID > %s)
                UNION 
                (SELECT FeedbackID, Feedback FROM feedback 
                INNER JOIN template_feedback USING (FeedbackID)
                INNER JOIN template_questions USING (QuestionID)
                WHERE FeedbackID > %s
                AND QuestionType = 'open');
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

    def analyse(self):
        feedback_list = self.fetch_feedback()
        if len(feedback_list) == 0:
            return False
        for feedbackid, feedback in feedback_list:
            s = flair.data.Sentence(feedback)
            self.flair_sentiment.predict(s)
            total_sentiment = s.labels[0]
            score = total_sentiment.score
            score *= -1 if total_sentiment.value == "NEGATIVE" else 1
            if score >= 0.6:
                sentiment = "positive"
            elif score >= -0.5:
                sentiment = "neutral"
            else:
                sentiment = "negative"
            print(sentiment + ", " + str(score) + ", " + feedback)


class RepeatFeedbackAnalysis():
    def __init__(self):
        pass

    def dosomething(self):
        # do something
        pass

class GenerateMeetingSummary():
    def __init__(self):
        pass

    def dosomething(self):
        # do something
        pass


if __name__ == "__main__":
    sa = SentimentAnalysis()
    sa.analyse()
