from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db
from werkzeug.security import generate_password_hash

api = Namespace('Candidate', description='Candidate account operations')

@api.route('/all')
class accounts(Resource):
    def get(self):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT * FROM Candidate")
        
update_details = api.model('create', {
    'email' : fields.String(description='university email for account identification', required=True),
    'password'  : fields.String(description='password for account access', required=True),
    'name' : fields.String(description='name of user', required=True),
    'university' : fields.String(description='university of candidate/course admin'),
    'degree' : fields.String(description='degree of candidate'),
    'gradYear' : fields.Integer(description='graduation year')
})


@api.route('/<string:account>')
class accountInfo(Resource):
    def get(self, account):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT EXISTS(SELECT email FROM Candidate WHERE email = ?)", (account,))
        account_check = c.fetchone()[0]
        
        if (account_check == 0):
            api.abort(404, "Account '{}' doesn't exist".format(account), ok=False)

        # SELECT STUFF FROM CANDIDATE
        # FORMAT RESPONS
        return_val = {

        }
        return return_val
    
    @api.doc(description="Delete specified account")
    def delete(self, account):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT EXISTS(SELECT email FROM Candidate WHERE email = ?)", (account,))
        account_check = c.fetchone()[0]
        
        if (account_check == 0):
            api.abort(404, "Account '{}' doesn't exist".format(account), ok=False)

        c.execute("DELETE FROM Candidate WHERE email = ?)", (account,))
        
        conn.commit()
        conn.close()
        return_val = {
            'ok': True
        }
        return return_val

    @api.doc(description="Edit user name")
    @api.expect(update_details)
    def put(self, account):
        conn = db.get_conn()
        c = conn.cursor()
        req = request.get_json()
        
        c.execute("SELECT EXISTS(SELECT email FROM Candidate WHERE email = ?)", (account,))
        account_check = c.fetchone()[0] 
        
        # if account does not exist abort
        if (account_check == 0):
            api.abort(404, "Account '{}' doesn't exist".format(account), ok=False)
        
        # change account details if account exists
        elif (account_check == 1):  
            
            # getting api input
            # edit_details = request.get_json()
            # pw_edit = req.get('password')
            # name_edit = req.get('name')
            # uni_edit = req.get('university')
            # degree_edit = req.get('name')
            # grad_edit = req.get('gradYear')

            # update 
            hashed_password = generate_password_hash(req['password'], "sha256")
            c.execute("UPDATE Candidate SET (password, name, university, degree, gradYear) = (?,?,?,?,?) WHERE email = ?",(hashed_password, req['name'], req['university'], req['degree'], req['gradYear'], req['email'],))
            conn.commit()
            conn.close()
            new_details = {
                'email' : req['email'],
                'password' : req['password'],
                'name' : req['name'],
                'university' : req['university'],
                'degree' : req['degree'],
                'gradYear' : req['gradYear']
            }

        else: 
            api.abort(400, "Update Error")
            conn.close()
        return_val = {
            'ok' : True,
            'new' : new_details
        }
        return return_val