from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db

api = Namespace('Course', description = 'APIs related to adding and editing courses as a course admin')

course_details = api.model('course', {
    'code' : fields.String(required = True, description = 'Course code'),
    'learningOutcomes' :  fields.String(description = 'Learning outcomes gained from the course'),  # assuming for now that we are allowing courses to be registed with no outcomes
    'university' : fields.String(required = True, description = 'University that the course belongs to'),
    'faculty' : fields.String(required = True, description = 'Faculty that the course belongs to'),
    'gradOutcomes' : fields.String(description = 'Graduate outcomes gained from the course'),
    'description' : fields.String(description = 'Description of the course'),
    'name' : fields.String(required = True, description = 'Name of the course'),
    'link' : fields.String(description = 'link to course handbook')
    })

edited_course_details = api.model('edit', {
    'code' : fields.String(description = 'Course code'),
    'learningOutcomes' :  fields.String(description = 'Learning outcomes gained from the course'),  # assuming for now that we are allowing courses to be registed with no outcomes
    'university' : fields.String(description = 'University that the course belongs to'),
    'faculty' : fields.String(description = 'Faculty that the course belongs to'),
    'gradOutcomes' : fields.String(description = 'Graduate outcomes gained from the course'),
    'description' : fields.String(description = 'Description of the course'),
    'name' : fields.String(description = 'Name of the course'),
    'link' : fields.String(description = 'link to course handbook')
    })

delete_course_details = api.model('delete', {
    'code' : fields.String(required = True, description = 'Course code'),
    'university' : fields.String(required = True, description = 'University that the course belongs to'),
    })

# adding courses
@api.route('/course/add')
class addcourse(Resource):
    @api.expect(course_details) 
    def post(self):
        req = request.get_json()
        conn = db.get_conn()
        c = conn.cursor()
        infolist = (req['code'], req['learningOutcomes'], req['university'], req['faculty'], req['gradOutcomes'], req['description'], req['name'], req['link'])

        # check if the course already exists
        check_sql = 'SELECT * FROM Course WHERE code = ? and university = ?'
        code_course = (req['code'], req['university'])
        c.execute(check_sql, code_course)
        res = c.fetchone()
        if res == None: # course doesn't already exist so we can insert this one into the db
            c.execute('INSERT INTO Course(code, learningOutcomes, university, faculty, gradOutcomes, description, name, link) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', infolist)
            conn.commit()
            conn.close()
            course = {
                'code' : req['code'],
                'learningOutcomes' : req['learningOutcomes'],
                'university' : req['university'],
                'faculty' : req['faculty'],
                'gradOutcomes' : req['gradOutcomes'],
                'description' : req['description'],
                'name' : req['name'],
                'link' : req['name']
            }
            returnVal = {
                'ok' : True,
                'course' : course
            }
            return returnVal
        else:
            api.abort(400, 'Course {} at {} already exists.'.format(req['code'], req['university']), ok = False) 

# deleting courses
@api.route('/course/delete')
class deletecourse(Resource):
    @api.expect(delete_course_details)
    def delete(self):
        req = request.json
        conn = db.get_conn()
        c = conn.cursor()
 
        # check if course exists
        check_query = 'SELECT * FROM Course WHERE code = ? and university = ?'
        code_course = (req['code'], req['university'])
        c.execute(check_query, code_course)
        res = c.fetchone()
        if res == None:
             api.abort(400, 'Course {} at {} does not exist.'.format(req['code'], req['university']), ok = False) 
             print('not great')
        else:
            delete_query = 'DELETE FROM Course WHERE code = ? and university = ?'
            c.execute(delete_query, code_course)
            conn.commit()
            conn.close()
            print('great')
            returnVal = {
                    'ok' : True
                }
        return returnVal
    
# editing existing courses
@api.route('/course/edit')
class editcourse(Resource):
    @api.expect(edited_course_details)
    def put(self):
        req = request.get_json()
        conn = db.get_conn()
        c = conn.cursor()

        # check if the course exists
        check_sql = 'SELECT * FROM Course WHERE code = ? and university = ?'
        code_course = (req['code'], req['university'])
        c.execute(check_sql, code_course)
        res = c.fetchone()
        if res == None: # if user doesn't exist, abort
            api.abort(400, 'Course {} at {} does not exist.'.format(req['code'], req['university']), ok = False) 
        
        infolist = (req['code'], req['learningOutcomes'], req['university'], req['faculty'], req['gradOutcomes'], req['description'], req['name'], req['link'])
        for i in infolist:
            print(i, type(i))
            if i == None:
                print('{} is none'.format(i))

        
        conn.commit()
        conn.close()
        course = {
            'code' : req['code'],
            'learningOutcomes' : req['learningOutcomes'],
            'university' : req['university'],
            'faculty' : req['faculty'],
            'gradOutcomes' : req['gradOutcomes'],
            'description' : req['description'],
            'name' : req['name'],
            'link' : req['name']
        }
        returnVal = {
            'ok' : True,
            'course' : course
        }
        return returnVal



