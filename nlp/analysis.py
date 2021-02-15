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
        self.counter = 0
        self.lastFeedbackId = 0
        self.dbconfig = parse_config()

    def increment_counter(self):
        self.counter += 1

    def fetch_feedback(self):
        conn = sql.connect(**dict(self.dbconfig.items('DatabaseCredentials')))
        c = conn.cursor()

        conn.close()

    def analyse(self):
        texts = self.fetch_feedback()
        for text in texts:
            s = flair.data.Sentence(text)
            self.flair_sentiment.predict(s)
            total_sentiment = s.labels[0]
            score = total_sentiment.score
            score *= -1 if total_sentiment.value == "NEGATIVE" else 1
            if score >= 0.6:
                sentiment = "positive"
                colour = 4
            elif score >= -0.5:
                sentiment = "neutral"
                colour = 3
            else:
                sentiment = "negative"
                colour = 1
            print(colour, sentiment + ", " + str(score) + ", " + text)

    def dosomething(self):
        # do something
        for i in range(100000, 9999999):
            hash(i)

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
    sa.fetch_feedback()
