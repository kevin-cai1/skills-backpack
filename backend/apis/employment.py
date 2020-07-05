from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db
import re
from pprint import pprint

api = Namespace('Employment', description='Endpoints relating to employment details on candidate ePortfolios')

employment_data = api.model('employment', {
    'user' : fields.String(description="Email address of user associated with employment details"),
    'employer' : fields.String(description="Employer name of employment"),
    'start_date' : fields.DateTime(description="Start date of employment"),
    'end_date' : fields.DateTime(description="End date of employment"),
    'description' : fields.String(description="Free text input description of employment")
})

@api.route('/<int:record_id>')
@api.doc(params={'record_id': 'the id from an existing employment record'})
class EmploymentDetails(Resource):
    @api.doc(description="Get details of a single employment record")
    def get(self, record_id):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT id, candidate_email, description, startDate, endDate, employer FROM Employment WHERE id = ?", (record_id,))
        result = c.fetchone()
        if (result == None):
            api.abort(400, "Employment record '{}' doesn't exist".format(record_id), ok=False)

        entry = {
            'id' : result[0],
            'start_date' : result[3],
            'end_date' : result[4],
            'description' : result[2],
            'employer' : result[5]
        }

        user = result[1]

        return_val = {
            'ok' : True,
            'user': user,
            'employment' : entry
        }
        return return_val

    @api.doc(description="Delete single employment record")
    def delete(self, record_id):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT EXISTS(SELECT id FROM Employment WHERE id = ?)", (record_id,))  
        record_check = c.fetchone()[0]    # returns 1 if exists, otherwise 0

        if (record_check == 0):   # entry doesn't exist
            api.abort(400, "Entry '{}' doesn't exist".format(record_id),ok=False)

        c.execute("DELETE FROM Employment WHERE id = ?", (record_id,))

        conn.commit()
        conn.close()
        return_val = {
            'ok' : True
        }
        return return_val

@api.route('/add')
class AddEmployment(Resource):
    @api.doc(description="Add new employment record into the system")
    @api.expect(employment_data)
    def post(self):
        req = request.get_json(force=True)      # get body payload from request

        if (not(checkFormat(req['start_date'])) or not(checkFormat(req['end_date']))):
            api.abort(400, "Incorrect date format", ok=False)
        
        conn = db.get_conn()
        c = conn.cursor()

        # check user exists
        c.execute("SELECT email FROM Candidate WHERE email = ?", (req['user'],))
        result = c.fetchone()   # check if exists

        # if ! exists:
        if (result == None):
            api.abort(400, "User '{}' doesn't exist".format(req['user']), ok=False)


        # create employment record
        employmentID = generate_employmentID()
        employment = (employmentID, req['user'], req['description'], req['start_date'], req['end_date'], req['employer'],)
        c.execute("INSERT INTO Employment (id, candidate_email, description, startDate, endDate, employer) VALUES (?,?,?,?,?,?)", employment)

        conn.commit()
        conn.close()
        
        # return success
        entry = {
            'id' : employmentID,
            'start_date' : req['start_date'],
            'end_date' : req['end_date'],
            'description' : req['description'],
            'employer' : req['employer'],
        }

        return_val = {
            'ok' : True,
            'user' : req['user'],
            'employment' : entry
        }
        return return_val

@api.route('/user/<string:email>')
@api.doc(params={'email': 'the email of a candidate in the system'})
class StudentEmployment(Resource):
    @api.doc(description="Get all employment records for specified student")
    def get(self, email):
        conn = db.get_conn()
        c = conn.cursor()
        c.execute('''SELECT id, description, startDate, endDate, employer FROM Employment WHERE candidate_email = ?''', (email,))
        results = c.fetchall()
        if (results == []):
            api.abort(400, "No employment records found for '{}'".format(email), ok=False)
            
        entries = []
        entry_count = 0
        for r in results:
            print(r)
            entry = {
                'id': r[0],
                'description': r[1],
                'start_date': r[2],
                'end_date': r[3],
                'employer': r[4]
            }
            entries.append(entry)
            entry_count += 1
        pprint(entries)
        return_val = {
            'ok': True,
            'entry_count': entry_count,
            'entries': entries
        }

        return return_val


def generate_employmentID():
    conn = db.get_conn() 
    c = conn.cursor() #cursor to execute commands
    c.execute('SELECT MAX(id) FROM Employment')
    val = c.fetchone()[0]
    return val+1

def checkFormat(date):
    if (date == ""):
        return True
    val = re.match("^\d{4}-\d{2}-\d{2}$",date)
    print(val)
    if (val != None):
        return True
    else:
        return False