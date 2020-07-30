from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db

from werkzeug.security import generate_password_hash

api = Namespace('Employer', description='Employer user operations')

@api.route('/all')
class SkillsCriteria(Resource):
    @api.doc(Description = 'getting list of all graduate outcomes in the db so the employer can choose from the list to add to their criteria')
    def get(self):
        gradoutcomes_list = []
        conn = db.get_conn()
        c = conn.cursor()

        for gradoutcome in c.execute("SELECT g_outcome FROM GraduatOutcomes"):
            gradoutcomes_list.append(gradoutcome[0])

        conn.close()
        returnVal = {
                'ok' : True,
                gradoutcomes : gradoutcomes_list
        }
        return returnVal
        
employer_details = api.model('employer details', {
    'email' : fields.String(description='university email for account identification', required=True),
    # 'password'  : fields.String(description='password for account access', required=True),
    'name' : fields.String(description='name of user', required=True),
    'company' : fields.String(description='company of employer')
})

GradOutcomes = api.model('GradOutcomes', {
    'GradOutcomes' : fields.List(fields.String, description = 'List of gradoutcomes that the employer wants to add to their skills criteria', required = True)
})

@api.route('/<string:account>')
class accountInfo(Resource):
    @api.doc(description = 'get account email')
    def get(self, account):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT EXISTS(SELECT email FROM Employer WHERE email = ?)", (account,))
        account_check = c.fetchone()[0]
       


        if (account_check == 0):
            api.abort(404, "Account '{}' doesn't exist".format(account), ok=False)
        
        # name = account_details[1]
        # email = account_details[0]
        # company = account_details[6]
        # SELECT STUFF FROM EMPLOYER
        # FORMAT RESPONSE ????
        
        return_val = {
             #'user' : name
             'email' : account
        }
       
        return return_val
        
    
    @api.doc(description="Delete specified account")
    def delete(self, account):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT EXISTS(SELECT email FROM Employer WHERE email = ?)", (account,))
        account_check = c.fetchone()[0]
        
        if (account_check == 0):
            api.abort(404, "Account '{}' doesn't exist".format(account), ok=False)

        c.execute("DELETE FROM Employer WHERE email = ?)", (account,))
        
        conn.commit()
        conn.close()
        return_val = {
            'ok': True
        }
        return return_val

    @api.doc(description="Edit employer details")
    @api.expect(employer_details)
    def put(self, account):
        conn = db.get_conn()
        c = conn.cursor()
        req = request.get_json()
        
        c.execute("SELECT EXISTS(SELECT email FROM Employer WHERE email = ?)", (account,))
        account_check = c.fetchone()[0] 
        
        # if account does not exist abort
        if (account_check == 0):
            api.abort(404, "Account '{}' doesn't exist".format(account), ok=False)
        
        # change account details if account exists
        elif (account_check == 1):  
            # hashed_password = generate_password_hash(req['password'], "sha256")

            # getting api input
            # edit_details = request.get_json()
            # pw_edit = req.get('password')
            # name_edit = req.get('name')
            # uni_edit = req.get('university')
            # c.execute("SELECT password FROM Employer WHERE email = ?", (account,))
            # query = c.fetchone()
            # if query == None:
            #     api.abort(400, "User '{}' not found".format(account), ok=False)
            # password = query[0]
            # if req['password'] == password:
            
            # getting api input
            # edit_details = request.get_json()
            # pw_edit = req.get('password')
            # name_edit = req.get('name')
            # uni_edit = req.get('university')
            # degree_edit = req.get('name')
            # grad_edit = req.get('gradYear')

            # update 
                c.execute("UPDATE Employer SET (name, company) = (?,?) WHERE email = ?",(req['name'], req['company'], req['email'],))
                conn.commit()
                conn.close()
                new_details = {
                    'email' : account,
                    # 'password' : hashed_password,
                    'name' : req['name'],
                    'company' : req['company'],
                }
            # else:   
            #     api.abort(400, "Password incorrect", ok=False)

        else: 
            api.abort(400, "Update Error")
            conn.close()
        return_val = {
            'ok' : True,
            'new' : new_details
        }
        return return_val

    # Endpoint for adding gradoutcomes to an employer's criteria of interest.
    # Takes in a list of strings of gradoutcomes and adds them to employer_gradoutcomes table
    @api.doc(Description = 'Adding GradOutcomes to criteria of interest for a particular employer')
    @api.expect(GradOutcomes)
    def post(self, account):
        req = request.get_json() 
        conn = db.get_conn()
        c = conn.cursor()

        #for gradoutcome in req['GradOutcomes']:
            #try:
                #c.execute('INSERT INTO 
                



