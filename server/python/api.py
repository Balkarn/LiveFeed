from flask import Flask, request
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
        if not sentimentAnalysis.new_feedback:
            sentimentAnalysis.new_feedback = True
            sentimentAnalysis.analyse()
        return True

class RequestFeedback(Resource):
    def post(self):
        """
			- Repeat DB queries to check whether the all the sent feedback has been processed
				- Check whether last_id in sentimentanalysis and repeatfeedbackanalysis is >= the greatest feedbackid with a corresponding entry in the templatefeedback table.
			- Start with just polling and slowly layer on efficiency

		"""
		pass

class MeetingEnded(Resource):
    def post(self):
        pass


app = Flask(__name__)
api = Api(app)
sentimentAnalysis = SentimentAnalysis()
popularFeedback = RepeatFeedbackAnalysis()
api.add_resource(FeedbackReceivedNotif, '/feedbackreceived')
api.add_resource(RequestFeedback, '/feedbackprocessed')
api.add_resource(MeetingEnded, '/meetingended')

if __name__ == "__main__":
    pass
