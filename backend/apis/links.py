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
            c.execute("SELECT c.link, t.time, c.tag FROM Candidate_Links c LEFT OUTER JOIN TrackingInfo t ON t.link = c.link WHERE c.email = ?", (user,))
            results = c.fetchall()
            print("RESUTLSSS")
            print(results)
        except db.sqlite3.Error as e:
            api.abort(400, 'invalid query {}'.format(e), ok = False)
            print(e)
        
        conn.close()
        print(results)
        print("ASDHFASDFASDFADFASDFASDF")
        grouped_results = sorted(results, key=lambda tup: tup[0])
        entries = []

        for key, group in groupby(grouped_results, lambda x: x[0]):
            times = []
            tag = ""
            for item in group:
                print(item)
                print(type(item))
                print(type(item[1]))
                time = {
                    'time': item[1]
                }
                times.append(time)
                tag = item[2]
            entry = {
                'link': key,
                'tag': tag,
                'times': times                
            }
            entries.append(entry)

        #for r in results:
        #    entry = {
        #        'link': r[0],
        #        'tag': r[2],
        #        'access-time': r[1]
        #    }
        #    entries.append(entry)

        return_val = {
            'ok': True,
            'user': user,
            'tracking_info': entries
        }
        return return_val