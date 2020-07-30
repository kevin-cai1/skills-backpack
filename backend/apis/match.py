from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from cryptography.fernet import Fernet
from werkzeug.security import generate_password_hash

import os, db, ssl

api = Namespace('Match', description='Matching employees with candidates that meet all the criterias')

candidate_criteria = api.model('candidate criteria', {
    'criteria' : fields.List(fields.String, description = 'criterias employer is wants in a candidate', required=True),
    'employer_email' : fields.String(description='employer email address', required=True),
    'sender_email' : fields.String(description='skills backpack email address', required=True)
})

# helper function to iterate through all attributes and find matches
# searches if an candidate matches a specific skill
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
        
# get list of all employers 
def all_employers():
    conn = db.get_conn()
    c = conn.cursor()
    res = []

    employers = c.execute('SELECT email FROM Employer').fetchall()
    for e in employers:
        res.append(e[0])
    conn.close()
    return res


# find if a specified candidate skillset matches the criteria of interest for any employers
# if a match is found, the employer is notified via email
def emailMatches(candidate_email):       
    conn = db.get_conn()
    c = conn.cursor()
    c2 = conn.cursor()
    employer_list = all_employers()
    status = False
    sender_email = 'skillsbackpack@gmail.com'
    
    for employer in employer_list:
        employer_email = employer
        # matching up gradoutcomes
        employer_criteria = []
        matched_criterias = {}
        for gradoutcome in c.execute('SELECT g.g_outcome FROM GraduateOutcomes g, Employer e, Employer_GradOutcomes eg WHERE g.id = eg.gradOutcomeID AND e.email = eg.employerEmail AND e.email = ?', (employer,)):
            employer_criteria.append(gradoutcome[0])
            findEPs(candidate_email, gradoutcome[0], c2, matched_criterias)
        
        # matching up job skills 
        for employer_skillcriteria in c.execute('SELECT s.name FROM Skill s, Employer_Skill es, Employer e WHERE s.id = es.skillID AND e.email = es.employer and e.email = ?', (employer,)):
            employer_criteria.append(employer_skillcriteria[0])
            findEPs(candidate_email, employer_skillcriteria[0], c2, matched_criterias)
        
        # if the number of matched criteria and the number of employer criteria is the same, a match has been found
        if (len(matched_criterias[candidate_email]) == len(employer_criteria)):
            print('sending email from {} to {}'.format(sender_email, employer_email))
            # send email
            message = Mail(
                from_email=sender_email,
                to_emails=employer_email,
                subject='A new candidate matched your job criteria!',
                html_content='<h1>Congratulations! </h1><strong> {} has matched all your job search criteria. Please login to Skills Backpack!</strong><br><br><a href="http://localhost:3000/login">Click here</a>  to view their details'.format(candidate_email)
            )

            message.dynamic_template_data = {
                'header': "A new candidate has matched your job search critera!",
                'text': "To view their details, please click the link below",
                'c2a_link': "http://localhost:3000/login/",
                'c2a_button': "View details"
            }
            message.template_id = 'd-165f1bd189884256a10ee0c090fe3a44'
            API_key = "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"

            try:
                sg = SendGridAPIClient(API_key)
                response = sg.send(message)
                status = True
                returnVal = {
                    'status_code' : response.status_code,
                    'ok' : True,
                }
            except Exception as e:
                print(e)
                returnVal = {
                    'status_code' : 'Unable to send email',
                    'ok' : False,
                }
        
