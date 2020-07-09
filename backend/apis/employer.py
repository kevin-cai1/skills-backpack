from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db

from werkzeug.security import generate_password_hash

api = Namespace('Employer', description='Employer user operations')

@api.route('/all')
class accounts(Resource):
    def get(self):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT * FROM Employer")
        
employer_details = api.model('employer details', {
    'email' : fields.String(description='university email for account identification', required=True),
    'password'  : fields.String(description='password for account access', required=True),
    'name' : fields.String(description='name of user', required=True),
    'company' : fields.String(description='company of employer')
})


@api.route('/<string:account>')
class accountInfo(Resource):
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
            hashed_password = generate_password_hash(req['password'], "sha256")

            # getting api input
            # edit_details = request.get_json()
            # pw_edit = req.get('password')
            # name_edit = req.get('name')
            # uni_edit = req.get('university')
            c.execute("SELECT password FROM Employer WHERE email = ?", (account,))
            query = c.fetchone()
            if query == None:
                api.abort(400, "User '{}' not found".format(account), ok=False)
            password = query[0]
            if req['password'] == password:
            
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
                    'password' : hashed_password,
                    'name' : req['name'],
                    'company' : req['company'],
                }
            else:   
                api.abort(400, "Password incorrect", ok=False)

        else: 
            api.abort(400, "Update Error")
            conn.close()
        return_val = {
            'ok' : True,
            'new' : new_details
        }
        return return_val