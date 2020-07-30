from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db

api = Namespace('Search', description='Search algorithm for employers to find EPs based on employability skills and grad attributes')

search_variables = api.model('search variables', {
    'attributes' : fields.List(fields.String, description = 'gradoutcomes or employability skills that the employer is searching for in EPs',)
})

employer_name = api.model('employer name', {
    'employer_name' : fields.String(required = True, description = 'name of the company (e.g. macquarie group, google) that you are searching for')
})

# helper function to iterate through all attributes and find matches
def findmatches(candidate_email, attribute, c, res):
    # iterate through each gradoutcome associated with the specified candidate email
    lowercase_attribute = attribute.lower() # change the search variable to lowercase to make search case insensitive
    try:
        for grad_attr in c.execute('SELECT DISTINCT g.g_outcome FROM Candidate cand, ePortfolio_Courses ec, Course c, Course_Gradoutcomes cg, Graduateoutcomes g WHERE g.id = cg.g_outcome and cg.code = c.code and cg.university = c.university and c.code = ec.code and c.university = ec.university and ec.EP_ID = cand.email and cand.email = ?', (candidate_email,)):
            if grad_attr[0].lower() == lowercase_attribute:
                if candidate_email in res: # if the email already has some matches, just append to the existing entry
                    res[candidate_email].append(lowercase_attribute.capitalize())
                    return
                new_entry = [] # if the email is not yet in the dictionary (ie no matches yet), give it it's first entry
                new_entry.append(lowercase_attribute.capitalize())
                res[candidate_email] = new_entry
                return
    except db.sqlite3.Error as e:
            api.abort(400, 'invalid query {}'.format(e), ok = False)

        
    # if the attribute wasn't found in gradoutcomes, iterate through the job specific skills associated with the candidate
    try:
        for job_skill in c.execute('SELECT DISTINCT s.name FROM Skill s, ePortfolio_Skill es WHERE s.id = es.skillID and es.candidate = ?', (candidate_email,)):
            if job_skill[0].lower() == lowercase_attribute:
                if candidate_email in res:
                    res[candidate_email].append(lowercase_attribute.capitalize())
                    return
                new_entry = []
                new_entry.append(lowercase_attribute.capitalize())
                res[candidate_email] = new_entry
                return
    except db.Sqlite3.Error as e:
        api.abort(400, 'invalid query {}'.format(e), ok = False)
    return

# apis used by employers to search for candidates  
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
            try:
                for candidate_email in c.execute('SELECT email FROM Candidate'):
                    # iterates through all candidates and their attributes 
                    # appends matches to the dictionary (unsorted_candidates) with the email as the key a list of matches as the value
                    findmatches(candidate_email[0], a, c2, unsorted_candidates) 
            except db.sqlite3.Error as e:
                api.abort(400, 'invalid query {}'.format(e), ok = False)

        # sorting the result dictionary by number of matches 
        sorted_keys = sorted(unsorted_candidates, key=lambda i: len(unsorted_candidates[i]), reverse=True) 
        # iterating through the sorted keys/emails and getting their info (first entry has the most matches, last entry has the least)
        for candidate in sorted_keys: 
            email = candidate
            try:
                candidate_row = c.execute('SELECT name, degree FROM Candidate WHERE email = ?', (email,)).fetchone()
            except db.sqlite3.Error as e:
                api.abort(400, 'invalid query {}'.format(e), ok = False)
            new_entry = {
                    'email' : email,
                    'name' : candidate_row[0],
                    'degree' : candidate_row[1],
                    'matching skills' : unsorted_candidates[email]
            }
            res.append(new_entry) # append each candidate entry to the final result
        # if the results list is empty, no matches were found
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

# api which returns all graduateoutcomes and skills in one list
@api.route('/getoutcomes')
class search(Resource):
    @api.doc(description = 'getting all the existing gradoutcomes and skills')
    def get(self):
        conn = db.get_conn()
        c = conn.cursor()
        res = []
        
        try:
            # fetch all skills
            for j in c.execute('SELECT DISTINCT name FROM Skill').fetchall():
                res.append(j[0])
            # fetch all gradoutcomes
            grad_outcomes = c.execute('SELECT DISTINCT g_outcome FROM GraduateOutcomes').fetchall()
            for g in grad_outcomes:
                res.append(g[0])
        except db.sqlite3.Error as e:
            api.abort(400, 'invalid query {}'.format(e), ok = False)

        returnVal = {
            'ok' : True,
            'outcomes': res
        }
        conn.commit()
        conn.close()
        return returnVal

# apis used by candidates to search for employers
@api.route('/searchemployers')
class employers(Resource):
    # api which returns all employer names in one list
    @api.doc(description = 'returns list of all employers in the system')
    def get(self):
        conn = db.get_conn()
        c = conn.cursor()
        res = []
        try:
            # fetch all company names
            employers = c.execute('SELECT company FROM Employer').fetchall()
            for e in employers:
                res.append(e[0])
        except db.sqlite3.Error as e:
            api.abort(400, 'invalid query {}'.format(e), ok = False)

        returnVal = {
                'ok' : True,
                'employers' : res
        }
        conn.commit()
        conn.close()
        return returnVal

    @api.doc(description = 'takes in the name of an employer, returns the employer details')
    @api.expect(employer_name)
    def post(self):
        conn = db.get_conn()
        c = conn.cursor()
        req = request.get_json()
        res = {} 
        company_name = req['employer_name']

        try:
            # fetching employer details
            employer_details = c.execute('SELECT company, name, email FROM Employer WHERE company = ?', (company_name,)).fetchone()
            if employer_details:
                res = {
                        'company' : employer_details[0],
                        'name' : employer_details[1],
                        'email' : employer_details[2]
                }
            else:
                api.abort(400, 'company name {} does not exist'.format(company_name,), ok = False)
        except db.sqlite3.Error as e:
            api.abort(400, 'invalid query {}'.format(e), ok = False)

        conn.commit()
        conn.close()
        if not res:
            returnVal = {
                    'ok' : False,
                    'employer_details' : 'employer does not exist or problem with query'
            }
        returnVal = {
                'ok' : True,
                'employer_details' : res
        }
        return returnVal
