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
    lowercase_attribute = attribute.lower() # change the search variable to lowercase to make search case insensitive
    for grad_attr in c.execute('SELECT DISTINCT g.g_outcome FROM Candidate cand, ePortfolio_Courses ec, Course c, Course_Gradoutcomes cg, Graduateoutcomes g WHERE g.id = cg.g_outcome and cg.code = c.code and cg.university = c.university and c.code = ec.code and c.university = ec.university and ec.EP_ID = cand.email and cand.email = ?', (candidate_email,)):
        if grad_attr[0].lower() == lowercase_attribute:
            if candidate_email in res: # if the email already has some matches, just append to the existing entry
                res[candidate_email].append(lowercase_attribute.capitalize())
                return
            new_entry = [] # if the email is not yet in the dictionary (ie no matches yet), give it it's first entry
            new_entry.append(lowercase_attribute.capitalize())
            res[candidate_email] = new_entry
            return
    
    # if the attribute wasn't found in gradoutcomes, iterate through the job specific skills associated with the candidate
    for job_skill in c.execute('SELECT DISTINCT s.name FROM Skill s, ePortfolio_Skill es WHERE s.id = es.skillID and es.candidate = ?', (candidate_email,)):
        if job_skill[0].lower() == lowercase_attribute:
            if candidate_email in res:
                res[candidate_email].append(lowercase_attribute.capitalize())
                return
            new_entry = []
            new_entry.append(lowercase_attribute.capitalize())
            res[candidate_email] = new_entry
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
        unsorted_candidates = {}
        res = []
        for a in req['attributes']:
            for candidate_email in c.execute('SELECT email FROM Candidate'):
                findmatches(candidate_email[0], a, c2, unsorted_candidates) # iterates through all candidates and their attributes. appends matches to the dictionary (unsorted_candidates) with the email as the key a list of matches as the value
        sorted_keys = sorted(unsorted_candidates, key=lambda i: len(unsorted_candidates[i]), reverse=True) # sorting the dictionary by length of each value list
        for candidate in sorted_keys: # iterating through the sorted keys/emails and getting their info (first entry has the most matches, last entry has the least)
            email = candidate
            candidate_row = c.execute('SELECT name, degree FROM Candidate WHERE email = ?', (email,)).fetchone()
            name, degree = candidate_row[0], candidate_row[1]
            new_entry = {
                    'email' : email,
                    'name' : name,
                    'degree' : degree,
                    'matching skills' : unsorted_candidates[email]
            }
            res.append(new_entry) # append each candidate entries to the final result
        if not res:
            returnVal = {
                    'ok' : False,
                    'candidates' : 'No Results Found'
            }
        else:
            returnVal = {
                    'ok' : True,
                    'candidates': res 
            }
        conn.commit()
        conn.close()
        return returnVal

# api which returns all graduate and learning outcomes in one list
@api.route('/getoutcomes')
class search(Resource):
    @api.doc(description = 'getting all the existing grad and learning outcomes')
    def get(self):
        conn = db.get_conn()
        c = conn.cursor()
        res = []

        for j in c.execute('SELECT DISTINCT name FROM Skill').fetchall():
            res.append(j[0])

        grad_outcomes = c.execute('SELECT DISTINCT g_outcome FROM GraduateOutcomes').fetchall()
        for g in grad_outcomes:
            res.append(g[0])

        returnVal = {
            'ok' : True,
            'outcomes': res
        }
        conn.commit()
        conn.close()
        return returnVal


