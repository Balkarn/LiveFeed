from flask import Flask
from flask_restful import Resource, Api, reqparse
from multiprocessing import Process
from analysis import *

"""
API Functionality: 
- Receive notification from PHP when feedback has been received into the DB
- Get queried by ReactJS, asking when the feedback has finished processing
- Get notification from ReactJS when the meeting has ended, so Python can render a summary


Asynchronous:
- Using Celery vs multiprocessing/threading modules

"""

class FeedbackReceivedNotif(Resource):
    def get(self):
        """
        The increment counter keeps track of how many new feedback has been stored
        :return:
        """
        sentimentAnalysis.increment_counter()
        if sentimentAnalysis.counter == 1:
            sentimentAnalysis.analyse()

class FeedbackProcessedNotif(Resource):
    def post(self):
        pass

class MeetingEnded(Resource):
    def post(self):
        pass


app = Flask(__name__)
api = Api(app)
sentimentAnalysis = SentimentAnalysis()
api.add_resource(FeedbackReceivedNotif, '/feedbackreceived')
api.add_resource(FeedbackReceivedNotif, '/feedbackprocessed')
api.add_resource(MeetingEnded, '/meetingended')

if __name__ == "__main__":
    pass
