from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db

api = Namespace('Course', description = 'Course admin operations')

course_details = api.model('course', {
    'code' : fields.String(required = True, description = 'Course code'),
    'learningOutcomes' :  fields.List(fields.String, description = 'Learning outcomes gained from the course'),  # assuming for now that we are allowing courses to be registed with no outcomes
    'university' : fields.String(required = True, description = 'University that the course belongs to'),
    'faculty' : fields.String(required = True, description = 'Faculty that the course belongs to'),
    'gradOutcomes' : fields.List(fields.String, description = 'Graduate outcomes gained from the course'),
    'description' : fields.String(description = 'Description of the course'),
    'name' : fields.String(required = True, description = 'Name of the course'),
    'link' : fields.String(description = 'link to course handbook'),
    'admin_email' : fields.String(required = True, description = 'email of the course admin who is submitting the course')
    })

delete_course_details = api.model('delete_course', {
    'code' : fields.String(required = True, description = 'Course code'),
    'university' : fields.String(required = True, description = 'University that the course belongs to'),
    })

# getting course info 
@api.route('/course/<university>/<code>', methods=['GET']) # specify query parameters using by entering them after a ? in the url (e.g. /course?code=COMP3900&university=UNSW)
class getcourse(Resource):
    def get(self, code, university):
        if code == None or university == None:
            api.abort(400, 'Please enter code or univerisity parameters to search for specific course', ok = False)
        
        course_query = 'select * from course c where c.code = ? and c.university = ?' 
        learnoutcome_query = 'select cl.l_outcome from course_learnoutcomes cl where cl.code = ? and cl.university = ?'
        gradoutcome_query = 'select gl.g_outcome from course_gradoutcomes gl where gl.code = ? and gl.university = ?'
        
        code_uni = (code, university)
        learning_outcomes = []
        graduate_outcomes = []
        
        conn = db.get_conn()
        c = conn.cursor()
        c.execute(learnoutcome_query, code_uni)
        res = c.fetchall()
        for l in res:
            learning_outcomes.append(l[0])
        c.execute(gradoutcome_query, code_uni)
        res = c.fetchall()
        for l in res:
            graduate_outcomes.append(l[0])
        c.execute(course_query, code_uni)
        course_info = c.fetchall()
        if course_info == None:
            api.abort(400, 'Course with code {} at university {} does not exist'.format(code, university), ok = False)
        else:
            returnVal = {
                    'ok' : True,
                    'val' : course_info ,
                    'gradoutcomes' : graduate_outcomes,
                    'learnoutcomes' : learning_outcomes
            }
        return returnVal

@api.route('/course/add')
class addcourse(Resource):
    @api.expect(course_details) 
    def post(self):
        req = request.get_json()
        conn = db.get_conn()
        c = conn.cursor()
        c.execute('PRAGMA foreign_keys = on')
        infolist = (req['code'], req['university'], req['faculty'], req['description'], req['name'], req['link'])

        # check if the course already exists
        check_sql = 'SELECT * FROM Course WHERE code = ? and university = ?'
        code_course = (req['code'], req['university'])
        c.execute(check_sql, code_course)
        res = c.fetchone()

        if res == None: # course doesn't already exist so we can insert this one into the db
            # inserting course details into course table
            c.execute('INSERT INTO Course(code, university, faculty, description, name, link) VALUES(?, ?, ?, ?, ?, ?)', infolist)
            course = {
                'code' : req['code'],
                'university' : req['university'],
                'faculty' : req['faculty'],
                'description' : req['description'],
                'name' : req['name'],
                'link' : req['name']
            }
            
            # inserting outcomes into their respective tables and relationships
            for learning_outcome in req['learningOutcomes']:
                c.execute('INSERT OR IGNORE INTO LearningOutcomes(l_outcome) VALUES(?)', (learning_outcome,))
                c.execute('INSERT INTO Course_LearnOutcomes(l_outcome, code, university) VALUES (?, ?, ?)', (learning_outcome, req['code'], req['university']))

            for grad_outcome in req['gradOutcomes']:
               c.execute('INSERT OR IGNORE INTO GraduateOutcomes(g_outcome) VALUES(?)', (grad_outcome,))
               c.execute('INSERT INTO Course_GradOutcomes(g_outcome, code, university) VALUES (?, ?, ?)', (grad_outcome, req['code'], req['university']))

            # inserting course_courseadmin details so we can map the course to the admin who added it (to check editing permissions later)
            c.execute('INSERT INTO Course_CourseAdmin(email, code, university) VALUES(?, ?, ?)', (req['admin_email'], req['code'], req['university']))
            conn.commit()
            conn.close()
            returnVal = {
                'ok' : True,
                'course' : course
            }
            return returnVal
        else:
            api.abort(400, 'Course {} at {} already exists.'.format(req['code'], req['university']), ok = False) 

# deleting courses
# expects course code and uni as input to identify the specific course to be deleted
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
            delete_query = 'DELETE FROM Course WHERE code = ? and university = ?' # this delete query should cascade to delete all relevant relos
            c.execute(delete_query, code_course)
            conn.commit()
            conn.close()
            returnVal = {
                    'ok' : True
                }
        return returnVal
    
# editing existing courses, assuming that the code and university can't be changed
# expects values for every field in the course table (if the value doesn't change, input the same value as before, not an empty string.)
@api.route('/course/edit')
class editcourse(Resource):
    @api.expect(course_details)
    def put(self):
        req = request.get_json()
        conn = db.get_conn()
        c = conn.cursor()
        c.execute('PRAGMA foreign_keys = on') 
        # 1. delete the existing course (which should cascade to delete the outcome/admin relationships)
        # 2. create a new course with the edited details
        # 3. add relationships of the edited details

        # check that the course exists
        check_query = 'SELECT * FROM Course WHERE code = ? and university = ?'
        code_course = (req['code'], req['university'])
        c.execute(check_query, code_course)
        res = c.fetchone()
        if res == None:
             api.abort(400, 'Course {} at {} does not exist.'.format(req['code'], req['university']), ok = False) 
             print('not great')
        else:
            delete_query = 'DELETE FROM Course WHERE code = ? and university = ?' # this should cascade to delete all related learn/grad outcome RELATIONSHIPS and course_courseadmin relos
            c.execute(delete_query, code_course)
 
        infolist = (req['code'], req['university'], req['faculty'], req['description'], req['name'], req['link'])

        # inserting course details into back course table
        c.execute('INSERT INTO Course(code, university, faculty, description, name, link) VALUES(?, ?, ?, ?, ?, ?)', infolist)
        course = {
            'code' : req['code'],
            'university' : req['university'],
            'faculty' : req['faculty'],
            'description' : req['description'],
            'name' : req['name'],
            'link' : req['name']
        }
        
        # inserting outcomes into their respective tables and relationships
        for learning_outcome in req['learningOutcomes']:
            c.execute('INSERT OR IGNORE INTO LearningOutcomes(l_outcome) VALUES(?)', (learning_outcome,))
            c.execute('INSERT INTO Course_LearnOutcomes(l_outcome, code, university) VALUES (?, ?, ?)', (learning_outcome, req['code'], req['university']))

        for grad_outcome in req['gradOutcomes']:
           c.execute('INSERT OR IGNORE INTO GraduateOutcomes(g_outcome) VALUES(?)', (grad_outcome,))
           c.execute('INSERT INTO Course_GradOutcomes(g_outcome, code, university) VALUES (?, ?, ?)', (grad_outcome, req['code'], req['university']))

        # inserting outcomes into EP skills sections

        # inserting course_courseadmin details so we can map the course to the admin who added it (to check editing permissions later)
        c.execute('INSERT INTO Course_CourseAdmin(email, code, university) VALUES(?, ?, ?)', (req['admin_email'], req['code'], req['university']))
     
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
