from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from multiprocessing import Process
from analysis import *


class FeedbackReceivedNotif(Resource):
	def get(self):
		if not sa.new_feedback:
			sa.new_feedback = True
			sa.analyse()
			rfa.analyse()
		return True

class RequestFeedback(Resource):
	def post(self):
		templateid = request.form.get('templateid')
		return polling.checktemplatefeedback(templateid, sa.last_id, rfa.last_id)


class MeetingEnded(Resource):
	def post(self):
		meetingid = request.form.get('meetingid')

class QuestionEnded(Resource):
	def post(self):
		meetingid = request.form.get('meetingid')
		questionid = request.form.get('questionid')
		response = {}
		summary.response_tally(questionid)

# Flask Initialisation
app = Flask(__name__)
api = Api(app)

# Initialise NLP objects
dbi = DatabaseInteraction()
sa = SentimentAnalysis(dbi)
rfa = RepeatFeedbackAnalysis(dbi)
polling = Polling(dbi)
summary = GenerateMeetingSummary(dbi)

# Flask endpoints
api.add_resource(FeedbackReceivedNotif, '/feedbackreceived')
api.add_resource(RequestFeedback, '/feedbackprocessed')
api.add_resource(MeetingEnded, '/meetingended')

if __name__ == "__main__":
	app.run(port=5000)
