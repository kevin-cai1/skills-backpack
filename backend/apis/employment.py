from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db
import re

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

        c.execute("SELECT id, description, startDate, endDate, employer FROM Employment WHERE id = ?", (record_id,))
        result = c.fetchone()
        if (result == None):
            api.abort(400, "Employment record '{}' doesn't exist".format(record_id), ok=False)

        entry = {
            'id' : result[0],
            'start_date' : result[2],
            'end_date' : result[3],
            'description' : result[1],
            'employer' : result[4],
        }
        c.execute('''select email from Candidate c 
            LEFT JOIN Employment_ePortfolio ep ON ep.EP_ID = c.EP_ID 
            LEFT JOIN Employment e ON ep.employmentId = e.id WHERE e.id = ?''', (record_id,))
        user = c.fetchone()[0]

        return_val = {
            'ok' : True,
            'user': user,
            'employment' : entry
        }
        return return_val

    @api.doc(description="Delete single employment record")
    def delete(self, record_id):
        pass

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
        c.execute("SELECT EP_ID FROM Candidate WHERE email = ?", (req['user'],))
        portfolioID = c.fetchone()   # check if exists

        # if ! exists:
        if (portfolioID == None):
            api.abort(400, "User '{}' doesn't exist".format(req['user']), ok=False)
        
        #portfolioID = __
        portfolioID = portfolioID[0]

        # create employment record

        employmentID = generate_employmentID()
        employment = (employmentID, req['description'], req['start_date'], req['end_date'], req['employer'],)
        c.execute("INSERT INTO Employment (id, description, startDate, endDate, employer) VALUES (?,?,?,?,?)", employment)
        
        # map employmentID to portfolioID
        c.execute("INSERT INTO Employment_ePortfolio (employmentID, EP_ID) VALUES(?,?)", (employmentID, portfolioID,))
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
        pass


def generate_employmentID():
    conn = db.get_conn() 
    c = conn.cursor() #cursor to execute commands
    c.execute('SELECT MAX(id) FROM Employment')
    val = c.fetchone()[0]
    return val+1

def checkFormat(date):
    val = re.match("^\d{4}-\d{2}-\d{2}$",date)
    print(val)
    if (val != None):
        return True
    else:
        return False