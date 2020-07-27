from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify
from .match import emailMatches 

import db

api = Namespace('Course', description = 'Course admin operations')

course_details = api.model('course', {
    'code' : fields.String(required = True, description = 'Course code'),
    'learningOutcomes' :  fields.String(description = 'Learning outcomes gained from the course'),  # assuming for now that we are allowing courses to be registed with no outcomes
    'university' : fields.String(required = True, description = 'University that the course belongs to'),
    'faculty' : fields.String(required = True, description = 'Faculty that the course belongs to'),
    'gradOutcomes' : fields.List(fields.String, description = 'Graduate outcomes gained from the course'),
    'description' : fields.String(description = 'Description of the course'),
    'name' : fields.String(required = True, description = 'Name of the course'),
    'link' : fields.String(description = 'link to course handbook'),
    'admin_email' : fields.String(required = True, description = 'email of the course admin who is submitting the course')
    })

edited_course_details = api.model('course', {
    'code' : fields.String(required = True, description = 'Course code'),
    'learningOutcomes' :  fields.String(description = 'Learning outcomes gained from the course'),  # assuming for now that we are allowing courses to be registed with no outcomes
    'university' : fields.String(required = True, description = 'University that the course belongs to'),
    'faculty' : fields.String(description = 'Faculty that the course belongs to'),
    'gradOutcomes' : fields.List(fields.String, description = 'Graduate outcomes gained from the course'),
    'description' : fields.String(description = 'Description of the course'),
    'name' : fields.String(description = 'Name of the course'),
    'link' : fields.String(description = 'link to course handbook'),
    'admin_email' : fields.String(required = True, description = 'email of the course admin who is submitting the course')
    })


delete_course_details = api.model('delete_course', {
    'code' : fields.String(required = True, description = 'Course code'),
    'university' : fields.String(required = True, description = 'University that the course belongs to'),
    })

# getting info based on inputted uni
@api.route('/<university>', methods=['GET'])
class getgradoutcomes(Resource):
    def get(self, university):
        if university == None:
            api.abort(400, 'Please enter a university', ok = False)
        conn = db.get_conn()
        c = conn.cursor()
        try:
            c.execute('SELECT g_outcome from GraduateOutcomes WHERE university = ?', (university,))
        except db.sqlite3.Error as e:
            print(e)
            api.abort(400, 'input error, {}, please enter a valid univeristy'.format(e), ok = False)
        gradoutcomes = []
        outcomes = c.fetchall()
        for o in outcomes:
            gradoutcomes.append(o[0])

        courselist = []
        # get all the courses as well
        try:
            for r in c.execute('SELECT code, name FROM Course WHERE university = ?', (university,)):
                new_course_entry = {
                        'code' : r[0],
                        'name' : r[1],
                }
                courselist.append(new_course_entry)
        except db.sqlite3.Error as e:
            api.abort(400, 'invalid university', ok=False)

        returnval = {
                'ok' : True,
                'gradoutcomes' : gradoutcomes,
                'courselist' : courselist
            }
        conn.commit()
        conn.close()
        return returnval

# getting course info 
@api.route('/<university>/<code>', methods=['GET']) # specify query parameters using by entering them after a ? in the url (e.g. /course?code=COMP3900&university=UNSW)
class getcourse(Resource):
    def get(self, code, university):
        if code == None or university == None:
            api.abort(400, 'Please enter code or univerisity parameters to search for specific course', ok = False)
       
        # when searching for a course theres 3 main pieces of info we need to display
        # 1. the general course info (name, description, code etc)
        # 2. learning outcomes
        # 3. grad outcomes

        course_query = 'select * from course c where c.code = ? and c.university = ?' 
        learnoutcome_query = 'select l.l_outcome from course_learnoutcomes cl, learningoutcomes l where cl.l_outcome = l.id and cl.code = ? and cl.university = ?'
        gradoutcome_query = 'select g.g_outcome from graduateoutcomes g, course_gradoutcomes cg where cg.g_outcome = g.id and cg.code = ? and cg.university = ?'
        
        code_uni = (code, university)
        learning_outcomes = []
        graduate_outcomes = []

        conn = db.get_conn()
        c = conn.cursor()

        try:
            c.execute(course_query, code_uni)
        except db.sqlite3.Error as e:
            api.abort(400, 'invalid query {}'.format(e), ok = False)
            print(e)
        course_info = c.fetchall()
        if course_info == None: # check if the course exists
            api.abort(400, 'Course with code {} at university {} does not exist'.format(code, university), ok = False)
         
        try:
            c.execute(learnoutcome_query, code_uni)
        except db.sqlite3.Error as e:
            api.abort(400, 'invalid query {}'.format(e), ok = False)
            print(e)
        res = c.fetchall()
        for l in res:
            learning_outcomes.append(l[0])
        try:
            c.execute(gradoutcome_query, code_uni)
        except db.sqlite3.Error as e:
            api.abort(400, 'invalid query {}'.format(e), ok = False)
            print(e)

        res = c.fetchall()
        for l in res:
            graduate_outcomes.append(l[0])
        else:
            returnVal = {
                    'ok' : True,
                    'general_course_info' : course_info,
                    'gradoutcomes' : graduate_outcomes,
                    'learnoutcomes' : learning_outcomes
            }
        conn.commit()
        conn.close()
        return returnVal


# adding courses
@api.route('/add')
class addcourse(Resource):
    @api.expect(course_details) 
    def post(self):
        req = request.get_json()
        conn = db.get_conn()
        c = conn.cursor()
        infolist = (req['code'], req['university'], req['faculty'], req['description'], req['name'], req['link'], req['admin_email'])

        # check if the course already exists
        check_sql = 'SELECT * FROM Course WHERE code = ? and university = ?'
        code_course = (req['code'], req['university'])
        c.execute(check_sql, code_course)
        res = c.fetchone()

        if res == None: # course doesn't already exist so we can insert this one into the db
            # inserting course details into course table
            try:
                c.execute('INSERT INTO Course(code, university, faculty, description, name, link, courseAdminEmail) VALUES(?, ?, ?, ?, ?, ?, ?)', infolist)
            except db.sqlite3.Error as e:
                api.abort(400, 'invalid query {}'.format(e), ok = False)
                print(e)

            course = {
                'code' : req['code'],
                'university' : req['university'],
                'faculty' : req['faculty'],
                'description' : req['description'],
                'name' : req['name'],
                'link' : req['link'],
                'courseAdminEmail' : req['admin_email']
            }
            
            # inserting outcomes into their respective tables and relationships
            for learning_outcome in req['learningOutcomes'].split(','):
                learning_outcome = learning_outcome.strip()
                try:
                    c.execute('INSERT INTO LearningOutcomes(l_outcome) VALUES(?)', (learning_outcome,))
                    c.execute('INSERT INTO Course_LearnOutcomes(l_outcome, code, university) VALUES ((SELECT last_insert_rowid()), ?, ?)', (req['code'], req['university']))
                except db.sqlite3.Error as e:
                    learnID = c.execute('SELECT id from LearningOutcomes WHERE l_outcome = ?', (learning_outcome,)).fetchone()[0]
                    try:
                        c.execute('INSERT INTO Course_LearnOutcomes(l_outcome, code, university) VALUES (?, ?, ?)', (learnID, req['code'], req['university']))
                    except db.sqlite3.Error as e:
                        continue

            for grad_outcome in req['gradOutcomes']:
                try: 
                    c.execute('INSERT INTO GraduateOutcomes(g_outcome, university) VALUES(?, ?)', (grad_outcome, req['university']))
                    c.execute('INSERT INTO Course_GradOutcomes(g_outcome, code, university) VALUES ((SELECT last_insert_rowid()), ?, ?)', (req['code'], req['university']))
                except db.sqlite3.Error as e: # error occurs when 140 fails because the outcome already exists in the db
                    gradID = c.execute('SELECT id from GraduateOutcomes WHERE g_outcome = ? and university = ?', (grad_outcome, req['university'])).fetchone()[0]
                    try:
                        c.execute('INSERT INTO Course_GradOutcomes(g_outcome, code, university) VALUES (?, ?, ?)', (gradID, req['code'], req['university']))
                    except db.sqlite3.Error as e:
                        continue

            conn.commit()
            conn.close()
            returnVal = {
                'ok' : True,
                'course' : course,
                'learningoutcomes' : req['learningOutcomes'],
                'graduateOutcomes' : req['gradOutcomes']
            }
            return returnVal
        else:
            conn.close()
            api.abort(400, 'Course {} at {} already exists.'.format(req['code'], req['university']), ok = False) 

# deleting courses
# expects course code and uni as input to identify the specific course to be deleted
@api.route('/delete')
class deletecourse(Resource):
    @api.expect(delete_course_details)
    def delete(self):
        req = request.json
        conn = db.get_conn()
        c = conn.cursor()
 
        # check if course exists
        check_query = 'SELECT * FROM Course WHERE code = ? and university = ?'
        code_course = (req['code'], req['university'])
        try:
            c.execute(check_query, code_course)
        except db.Sqlite3.Error as e:
            api.abort(400, 'invalid query {}'.format(e), ok = False)
            print(e)

        res = c.fetchone()
        if res == None:
            conn.close()
            api.abort(400, 'Course {} at {} does not exist.'.format(req['code'], req['university']), ok = False) 
        else:
             # THIS IS FOR IF WE DECIDE TO DELETE LEARNINGOUTCOMES ASSOCIATED WITH THE COURSE (need to account for when 2 courses share learningoutcomes though)
         #   c.execute('SELECT l_outcome FROM course_learnoutcomes WHERE code = ? AND university = ?', (req['code'], req['university']))
         #   outcome_ids = c.fetchall()
         #   for i in outcome_ids:
         #       c.execute('DELETE FROM learningOutcomes WHERE id = ?', i[0])
            delete_query = 'DELETE FROM Course WHERE code = ? and university = ?' # this delete query should cascade to delete all relevant relos
            try:
                c.execute(delete_query, code_course)
            except db.Sqlite3.Error as e:
                api.abort(400, 'invalid query {}'.format(e), ok = False)
                print(e)
            conn.commit()
            conn.close()
            returnVal = {
                    'ok' : True
                }
        return returnVal
    
# editing existing courses, assuming that the code and university can't be changed
# expects values for every field in the course table (if the value doesn't change, input the same value as before, not an empty string.)
@api.route('/edit')
class editcourse(Resource):
    @api.expect(course_details)
    def put(self):
        req = request.get_json()
        conn = db.get_conn()
        c = conn.cursor()

        # check that the course exists
        check_query = 'SELECT * FROM Course WHERE code = ? and university = ?'
        code_course = (req['code'], req['university'])
        try:
            c.execute(check_query, code_course)
        except db.Sqlite3.Error as e:
            api.abort(400, 'invalid query {} {}'.format(check_query, e), ok = False)
            print(e)

        res = c.fetchone()
        if res == None:
            conn.close()
            api.abort(400, 'Course {} at {} does not exist.'.format(req['code'], req['university']), ok = False) 

        # check that the admin is legit
        check_admin_query = 'SELECT * FROM CourseAdmin WHERE email = ?'
        try:
            c.execute(check_admin_query, (req['admin_email'],))
        except db.Sqlite3.Error as e:
            api.abort(400, 'invalid query {}'.format(e), ok = False)
            print(e)

        res = c.fetchone()
        if res == None:
            conn.close()
            api.abort(400, 'Course Admin email ? does not exist.'.format(req['admin_email']), ok = False) 
       
        # if the course admin has removed some outcomes, we must first delete those outcomes and their relos
        try:
            c.execute('SELECT l_outcome FROM Course_LearnOutcomes WHERE code = ? and university = ?', (req['code'], req['university']))
        except db.Sqlite3.Error as e:
            api.abort(400, 'invalid query {}'.format(e), ok = False)
            print(e)

        ids = c.fetchall() # get all the ids of the existing learning outcomes for the particular course
        for i in ids:
            try:
                c.execute('SELECT l_outcome, id FROM LearningOutcomes WHERE id = ?', i) 
            except db.Sqlite3.Error as e:
                api.abort(400, 'invalid query {}'.format(e), ok = False)
                print(e)

            l = c.fetchone()
            if l[0] not in req['learningOutcomes']: # if the learning outcome is not in the new (edited) list of outcomes, delete it
                try:
                    c.execute('DELETE FROM LearningOutcomes WHERE id = ?', (l[1],)) # this should cascade to delete course_learnoutcome relo
                except db.Sqlite3.Error as e:
                    api.abort(400, 'invalid query {}'.format(e), ok = False)
                    print(e)


        # since grad outcomes are tied to the uni, not the course, all we have to do is remove the course_gradoutcome relo. The outcome can stay. 
        c.execute('SELECT g_outcome FROM Course_GradOutcomes WHERE code = ? and university = ?', (req['code'], req['university']))
        ids = c.fetchall() # get all the ids of the existing graduate outcomes for the particular course
        for i in ids:
            try:
                c.execute('SELECT g_outcome, id FROM GraduateOutcomes WHERE id = ?', i) 
            except db.Sqlite3.Error as e:
                api.abort(400, 'invalid query {}'.format(e), ok = False)
                print(e)

            l = c.fetchone()
            if l[0] not in req['gradOutcomes']: # if the gradoutcome is not in the new (edited) list of outcomes, delete it
                try:
                    c.execute('DELETE FROM Course_GradOutcomes WHERE g_outcome = ?', (l[1],)) 
                except db.Sqlite3.Error as e:
                    api.abort(400, 'invalid query {}'.format(e), ok = False)
                    print(e)

        # now that we've removed edited out outcomes, we can add all the learning/grad outcomes to their respective tables. Should automatically filter out duplicates.
        for learning_outcome in req['learningOutcomes'].split(','):
            learning_outcome = learning_outcome.strip()
            try:
                c.execute('INSERT INTO LearningOutcomes(l_outcome) VALUES(?)', (learning_outcome,))
                c.execute('INSERT INTO Course_LearnOutcomes(l_outcome, code, university) VALUES ((SELECT last_insert_rowid()), ?, ?)', (req['code'], req['university']))
            except db.sqlite3.Error as e:
                learnID = c.execute('SELECT id from LearningOutcomes WHERE l_outcome = ?', (learning_outcome,)).fetchone()[0]
                try:
                    c.execute('INSERT INTO Course_LearnOutcomes(l_outcome, code, university) VALUES (?, ?, ?)', (learnID, req['code'], req['university']))
                except db.sqlite3.Error as e:
                    continue

        for grad_outcome in req['gradOutcomes']:
            try: 
                c.execute('INSERT INTO GraduateOutcomes(g_outcome, university) VALUES(?, ?)', (grad_outcome, req['university']))
                c.execute('INSERT INTO Course_GradOutcomes(g_outcome, code, university) VALUES ((SELECT last_insert_rowid()), ?, ?)', (req['code'], req['university']))
            except db.sqlite3.Error as e: # error occurs when 140 fails because the outcome already exists in the db
                gradID = c.execute('SELECT id from GraduateOutcomes WHERE g_outcome = ? and university = ?', (grad_outcome, req['university'])).fetchone()[0]
                try:
                    c.execute('INSERT INTO Course_GradOutcomes(g_outcome, code, university) VALUES (?, ?, ?)', (gradID, req['code'], req['university']))
                except db.sqlite3.Error as e:
                    continue
        
        # finally update the course details
        update_query = 'UPDATE Course SET faculty = ?, description = ?, name = ?, link = ?, courseAdminEmail = ? WHERE code = ? and university = ?'
        infolist = (req['faculty'], req['description'], req['name'], req['link'], req['admin_email'], req['code'], req['university']) 
        try:
            c.execute(update_query, infolist)
        except db.Sqlite3.Error as e:
            api.abort(400, 'invalid query {}'.format(e), ok = False)
            print(e)
        
        conn.commit()

        # check if existing candidates who were previously enrolled in the course now have matching skills with an employers skills criteria
        for candidate in c.execute('SELECT c.email FROM Candidate c, ePortfolio_Courses ec, Course co WHERE c.email = ec.EP_ID AND ec.code = co.code AND ec.university = co.university AND co.code = ? AND co.university = ?', code_course):
            emailMatches(candidate[0])
        
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
