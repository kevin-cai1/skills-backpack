from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db

api = Namespace('Search', description='Search algorithm for employers to find EPs based on employability skills and grad attributes')

search_variables = api.model('search variables', {
    'attributes' : fields.List(fields.String, description = 'gradoutcomes or employability skills that the employer is searching for in EPs',)
})

# helper function to iterate through all attributes and find matches
def findmatches(candidate_email, attribute, c, res):
    # iterate through each gradoutcome associated with the specified candidate email
    for grad_attr in c.execute('SELECT DISTINCT g.g_outcome FROM Candidate cand, ePortfolio_Courses ec, Course c, Course_Gradoutcomes cg, Graduateoutcomes g WHERE g.id = cg.g_outcome and cg.code = c.code and cg.university = c.university and c.code = ec.code and c.university = ec.university and ec.EP_ID = cand.email and cand.email = ?', (candidate_email,)):
        if grad_attr[0] == attribute:
            if candidate_email in res:
                print(grad_attr[0], candidate_email, type(candidate_email))
                res[candidate_email] += 1
                return
            print(grad_attr[0], candidate_email, 'first')
            res[candidate_email] = 1
            return

    for learn_attr in c.execute('SELECT DISTINCT l.l_outcome FROM Candidate cand, ePortfolio_Courses ec, Course c, Course_LearnOutcomes cl, LearningOutcomes l WHERE l.id = cl.l_outcome and cl.code = c.code and cl.university = c.university and c.code = ec.code and c.university = ec.university and ec.EP_ID = cand.email and cand.email = ?', (candidate_email,)):
        if learn_attr[0] == attribute:
            if candidate_email in res:
                print(learn_attr[0], candidate_email, type(candidate_email))
                res[candidate_email] += 1
                return
            res[candidate_email] = 1
            print(learn_attr[0], candidate_email, 'first')
            return
    return

@api.route('/search')
class search(Resource):
    @api.expect(search_variables)
    @api.doc(description = 'search algorithm, returns list of EPs ordered by number of matches')
    def post(self):
        conn = db.get_conn()
        c = conn.cursor()
        c2 = conn.cursor()
        req = request.get_json()
        res = {}
        for a in req['attributes']:
            for candidate_email in c.execute('SELECT email FROM Candidate'):
                findmatches(candidate_email[0], a, c2, res)
        res.sort
        returnVal = {
                'candidates': res
        }
        return returnVal

@api.route('/getoutcomes')
class search(Resource):
    @api.doc(description = 'getting all the existing grad and learning outcomes')
    def get(self):
        conn = db.get_conn()
        c = conn.cursor()
        res = []

        learning_outcomes = c.execute('SELECT l_outcome FROM LearningOutcomes').fetchall()
        for l in learning_outcomes:
            res.append(l[0])

        grad_outcomes = c.execute('SELECT DISTINCT g_outcome FROM GraduateOutcomes').fetchall()
        for g in grad_outcomes:
            res.append(g[0])

        returnVal = {
            'ok' : True,
            'outcomes': res
        }
        return returnVal


