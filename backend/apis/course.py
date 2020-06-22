from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db

api = Namespace('course', description = 'APIs related to adding and editing courses as a course admin')

course_details = api.model('course', {
    'code' : fields.String(required = True, description = 'Course code'),
    'learningOutcomes' :  fields.String(description = 'Learning outcomes gained from the course'),  # assuming for now that we are allowing courses to be registed with no outcomes
    'university' : fields.String(required = True, description = 'University that the course belongs to'),
    'faculty' : fields.String(required = True, description = 'Faculty that the course belongs to'),
    'gradOutcomes' : fields.String(description = 'Graduate outcomes gained from the course'),
    'description' : fields.String(description = 'Description of the course'),
    'name' : fields.String(required = True, description = 'Name of the course')
    })

@api.route('/course/add')
class addcourse(Resource):
    @api.expect(course_details) 
    def post(self):
        req = request.get_json()
        conn = db.get_conn()
        c = conn.cursor()
        infolist = (req['code'], req['learningOutcomes'], req['university'], req['faculty'], req['gradOutcomes'], req['description'], req['name'])
        c.execute('INSERT INTO Course(code, learningOutcomes, university, faculty, gradOutcomes, description, name) VALUES(?, ?, ?, ?, ?, ?, ?)', infolist)
        conn.commit()
        conn.close()
        course = {
            'code' : req['code'],
            'learningOutcomes' : req['learningOutcomes'],
            'university' : req['university'],
            'faculty' : req['faculty'],
            'gradOutcomes' : req['gradOutcomes'],
            'description' : req['description'],
            'name' : req['name']
        }
        returnVal = {
            'ok' : True,
            'course' : course
        }
        return returnVal
