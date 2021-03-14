from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from analysis import *


class FeedbackReceivedNotif(Resource):
	def get(self):
		if not sa.new_feedback:
			sa.new_feedback = True
			sa.analyse()
			rfa.analyse()
			sa.new_feedback = False

		response = jsonify(True)
		response.headers.add('Access-Control-Allow-Origin', '*')
		return response

class RequestFeedback(Resource):
	def post(self):
		templateid = request.form.get('templateid')
		return polling.checktemplatefeedback(templateid, sa.last_id, rfa.last_id)

class MeetingEnded(Resource):
	def post(self):
		meetingid = request.form.get('meetingid')

class QuestionTally(Resource):
	def post(self):
		meetingid = request.form.get('meetingid')
		questionid = request.form.get('questionid')
		response = jsonify(summary.response_tally(int(meetingid), int(questionid)))
		response.headers.add('Access-Control-Allow-Origin', '*')
		return response


class QuestionPopular(Resource):
	def post(self):
		meetingid = request.form.get('meetingid')
		questionid = request.form.get('questionid')
		response = jsonify(rfa.get_question_summary(int(meetingid), int(questionid)))
		response.headers.add('Access-Control-Allow-Origin', '*')
		return response

class QuestionMood(Resource):
	def post(self):
		meetingid = request.form.get('meetingid')
		questionid = request.form.get('questionid')
		response = jsonify(summary.question_mood_tally(int(meetingid), int(questionid)))
		response.headers.add('Access-Control-Allow-Origin', '*')
		return response

class MeetingPopular(Resource):
	def post(self):
		meetingid = request.form.get('meetingid')
		response = jsonify(rfa.get_meeting_summary(int(meetingid)))
		response.headers.add('Access-Control-Allow-Origin', '*')
		return response

class MeetingMood(Resource):
	def post(self):
		meetingid = request.form.get('meetingid')
		response = jsonify(summary.meeting_mood_tally(int(meetingid)))
		response.headers.add('Access-Control-Allow-Origin', '*')
		return response

class Test(Resource):
	def get(self):
		return "test"
	def post(self):
		return {"test":5}
# Flask Initialisation
app = Flask(__name__)
api = Api(app)


# Initialise NLP objects
dbi = DatabaseInteraction()
sa = SentimentAnalysis(dbi)
rfa = RepeatFeedbackAnalysis(dbi)
polling = Polling(dbi)
summary = GenerateMeetingSummary(dbi)
sa.analyse()
rfa.analyse()

# Flask endpoints
api.add_resource(QuestionTally, '/questiontally')
api.add_resource(QuestionPopular, '/questionpopular')
api.add_resource(QuestionMood, '/questionmood')
api.add_resource(MeetingMood, '/meetingmood')
api.add_resource(MeetingPopular, '/meetingpopular')
api.add_resource(FeedbackReceivedNotif, '/feedbackreceived')
api.add_resource(Test, '/test')


if __name__ == "__main__":
	app.run(port=81)
