from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db
from datetime import datetime
from itertools import groupby

api = Namespace('Links', description='Endpoint to get link tracking information')


@api.route('/<string:link>')
class Tracker(Resource):
    @api.doc(description="Post new tracking data for given link. Call on component mount on page view")
    def post(self, link):
        conn = db.get_conn()
        c = conn.cursor()
        time = datetime.now().strftime('%d-%m-%Y %H:%M:%S')
        try:
            c.execute("INSERT INTO TrackingInfo (link, time) VALUES (?, ?)", (link, time,))
        except db.sqlite3.Error as e:
            api.abort(400, 'invalid query {}'.format(e), ok = False)
            print(e)

        conn.commit()
        conn.close()
        return {
            'ok': True
        }

@api.route('/info/<string:user>')
class TrackingInfo(Resource):
    @api.doc(description="Get all tracking information for user - access times for every link")
    def get(self, user):
        conn = db.get_conn()
        c = conn.cursor()

        try:
            c.execute("SELECT link, time FROM TrackingInfo WHERE link IN (SELECT link FROM Candidate_Links WHERE email = ?)", (user,))
            results = c.fetchall()
        except db.sqlite3.Error as e:
            api.abort(400, 'invalid query {}'.format(e), ok = False)
            print(e)
        
        conn.close()

        grouped_results = sorted(results, key=lambda tup: tup[0])
        entries = []

        for key, group in groupby(grouped_results, lambda x: x[0]):
            times = []
            for item in group:
                times.append(item[1])
            entry = {
                'link': key,
                'time': times
            }
            entries.append(entry)


        return_val = {
            'ok': True,
            'user': user,
            'tracking_info': entries
        }
        return return_val
#endpoint to post new tracking info
#   need link

# endpoint to get tracking info
#   need email