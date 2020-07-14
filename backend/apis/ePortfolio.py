from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db
from pprint import pprint

api = Namespace('ePortfolio', description='Endpoint to get ePortfolio information')

add_course_details = api.model('course details', {
    'code' : fields.String(description = 'Course code', required = True),
    'university' : fields.String(description = 'The university corresponding to the course being added', required = True)
})

@api.route('/<string:email>')
class ePortfolio(Resource):
    @api.doc(description="get ePortfolio details for specified user")
    def get(self, email):
        # check user exists
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT name, university, degree, gradYear FROM Candidate WHERE email = ?", (email,))
        user = c.fetchone()

        if (user == None):
            api.abort(400, "User '{}' doesn't exist".format(email), ok=False)

        user_entry = {
            'email': email,
            'name': user[0],
            'university': user[1],
            'gradYear': user[3],
            'degree': user[2]
        }

        c.execute("SELECT id, name FROM Skill WHERE id IN (SELECT skillID from ePortfolio_Skill WHERE candidate = ?)", (email,))
        skill_results = c.fetchall()
        job_skills = []
        if (skill_results != []):
            for r in skill_results:
                entry = {
                    'id': r[0],
                    'name': r[1]
                }
                job_skills.append(entry)

        employability_skills = []   # get function from gordon
        c.execute('''select distinct o.id, o.g_outcome from Course c JOIN Course_GradOutcomes g ON c.code = g.code 
                JOIN ePortfolio_Courses e ON e.code = c.code 
                JOIN GraduateOutcomes o ON g.g_outcome = o.id WHERE e.EP_ID = ?''', (email,))

        grad_skills = c.fetchall()
        for r in grad_skills:
            entry = {
                'id': r[0],
                'grad_outcome': r[1]
            }
            employability_skills.append(entry)

        courses = []
        c.execute('''SELECT c.code, c.university, c.faculty, c.description, c.name, c.link, c.courseAdminEmail 
                FROM Course c JOIN ePortfolio_Courses e ON c.code = e.code AND c.university = e.university WHERE e.EP_ID = ?''', (email,))

        course_results = c.fetchall()

        if (course_results != []):
            for r in course_results:
                entry = {
                    'code': r[0],
                    'name': r[4],
                    'faculty': r[2],
                    'university': r[1],
                    'description': r[3],
                    'link': r[5],
                    'course_email': r[6]
                }
                courses.append(entry)

        employment = []
        c.execute('''SELECT id, description, startDate, endDate, employer FROM Employment WHERE candidate_email = ?''', (email,))
        employment_results = c.fetchall()
        if (employment_results != []):
            for r in employment_results:
                print(r)
                entry = {
                    'id': r[0],
                    'description': r[1],
                    'start_date': r[2],
                    'end_date': r[3],
                    'employer': r[4]
                }
                employment.append(entry)

        return_val = {
            'ok': True,
            'profile': user_entry,
            'job_skills': job_skills,
            'employability_skills': employability_skills,
            'courses': courses,
            'employment': employment,
        }

        return return_val

    @api.doc(description = "Add course to ePortfolio")
    @api.expect(add_course_details)
    def post(self, email):
        # to add course, just add to the eportfolio_courses (AKA candidate_courses) relo
        req = request.get_json()
        conn = db.get_conn()
        c = conn.cursor()
        c.execute('INSERT INTO ePortfolio_Courses(EP_ID, code, university) VALUES(?, ?, ?)', (email, req['code'], req['university']))
        conn.commit()
        conn.close()
        return_val = {
                'ok' : True,
                'account' : email,
                'code' : req['code'],
                'university' : req['university']
        }
        return return_val
    
