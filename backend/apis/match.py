from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from cryptography.fernet import Fernet
from werkzeug.security import generate_password_hash

import os, db

api = Namespace('Match', description='Matching employees with candidates that meet all the criterias')

candidate_criteria = api.model('candidate criteria', {
    'criteria' : fields.List(fields.String, description = 'criterias employer is wants in a candidate', required=True),
    'employer_email' : fields.String(description='employer email address', required=True),
    'sender_email' : fields.String(description='skills backpack email address', required=True)
})

# helper function to iterate through all attributes and find matches
# searches if a candidate matches a specific skill
def findEPs(candidate_email, attribute, c, res):
    
    # iterate through each grad outcome associated with the specified candidate email
    # change the search variable to lowercase to make search case insensitive
    lowercase_attribute = attribute.lower() 
    for grad_attr in c.execute('SELECT DISTINCT g.g_outcome FROM Candidate cand, ePortfolio_Courses ec, Course c, Course_Gradoutcomes cg, Graduateoutcomes g WHERE g.id = cg.g_outcome and cg.code = c.code and cg.university = c.university and c.code = ec.code and c.university = ec.university and ec.EP_ID = cand.email and cand.email = ?', (candidate_email,)):
        if grad_attr[0].lower() == lowercase_attribute:
            
            # if the email already has some matches, just append to the existing entry
            if candidate_email in res: 
                res[candidate_email].append(lowercase_attribute.capitalize())
                return
            
            # if the email is not yet in the dictionary (ie no matches yet), give it it's first entry
            new_entry = [] 
            new_entry.append(lowercase_attribute.capitalize())
            res[candidate_email] = new_entry
            return
    
    # if the attribute wasn't found in grad outcomes, iterate through the job specific skills associated with the candidate
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


# now res is a list of candidates with the skills that match inside

@api.route('/match')
class Email(Resource):
    @api.expect(candidate_criteria)
    @api.doc(description = 'emails employees the details of candidates who match all criteria')
    def post(self):
        conn = db.get_conn()
        c = conn.cursor()
        c2 = conn.cursor()
        req = request.get_json()
        unsorted_candidates = {}
        res = []
        employer_email = req['employer_email']
        sender_email = 'skillsbackpack@gmail.com'

        for a in req['criteria']:
            for candidate_email in c.execute('SELECT email FROM Candidate'):
                # iterates through all candidates and their attributes. appends matches to the dictionary 
                # (unsorted_candidates) with the email as the key a list of matches as the value
                findEPs(candidate_email[0], a, c2, unsorted_candidates) 
        
        # sorting the dictionary by length of each value list
        sorted_keys = sorted(unsorted_candidates, key=lambda i: len(unsorted_candidates[i]), reverse=True) 
        
    
        # iterating through sorted list of candidates with matching criterias
        # (first entry has the most matches, last entry has the least)
        for candidate in sorted_keys: 

            # if the number of attributes a candidate has is the same and number of attributes
            # and employer wants, send the employer and email
            if (len(unsorted_candidates[candidate]) == len(req['criteria'])):
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
                
                # send email
                message = Mail(
                    from_email=sender_email,
                    to_emails=employer_email,
                    subject='A new candidate matched your job criteria!',
                    html_content='<h1>Congratulations! </h1><strong> {} has matched all your job search criteria. Please login to Skills Backpack!</strong><br><br><a href="http://localhost:3000/login">Click here</a>  to view their details'.format(email)
                )

                message.dynamic_template_data = {
                    'header': "{} has matched your job search critera!".format(email),
                    'text': "To view their details, please click the link below",
                    'c2a_link': "http://localhost:3000/login/",
                    'c2a_button': "View details"
                }
                message.template_id = 'd-165f1bd189884256a10ee0c090fe3a44'
                print(os.environ.get('SENDGRID_API_KEY'))
                API_key = "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"

                try:
                    sg = SendGridAPIClient(API_key)
                    response = sg.send(message)
                    print(response.status_code)
                    print(response.body)
                    print(response.headers)
                    returnVal = {
                        'status_code' : response.status_code,
                        'ok' : True,
                        'details' : res
                    }
                except Exception as e:
                    print(e)
                    returnVal = {
                        'status_code' : 'email not sent',
                        'ok' : False,
                        'details' : res
                    }
        return returnVal

    