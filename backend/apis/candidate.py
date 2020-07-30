from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db
from werkzeug.security import generate_password_hash

api = Namespace('Candidate', description='Candidate account operations')

candidate_details = api.model('candidate details', {
    'email' : fields.String(description='university email for account identification', required=True),
    # 'password'  : fields.String(description='password for account access', required=True),
    'name' : fields.String(description='name of user', required=True),
    'university' : fields.String(description='university of candidate/course admin'),
    'degree' : fields.String(description='degree of candidate'),
    'gradYear' : fields.Integer(description='graduation year')
})

add_course_details = api.model('course details', {
    'code' : fields.String(description = 'Course code', required = True),
    'university' : fields.String(description = 'The university corresponding to the course being added', required = True)
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
            'email' : account
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

    @api.doc(description="Edit user details")
    @api.expect(candidate_details)
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
            # hashed_password = generate_password_hash(req['password'], "sha256")
            # getting api input
            # edit_details = request.get_json()
            # pw_edit = req.get('password')
            # name_edit = req.get('name')
            # uni_edit = req.get('university')
            # degree_edit = req.get('name')
            # grad_edit = req.get('gradYear')

            # update 

            # checks password matches before they can edit user details
            # c.execute("SELECT password FROM Candidate WHERE email = ?", (account,))
            # query = c.fetchone()
            # if query == None:
            #     api.abort(400, "User '{}' not found".format(account), ok=False)
            

            c.execute("UPDATE Candidate SET (name, university, degree, gradYear) = (?,?,?,?) WHERE email = ?",(req['name'], req['university'], req['degree'], req['gradYear'], req['email'],))
            conn.commit()
            # c.execute("SELECT name FROM Candidate WHERE email = ?", (account,))
            # check = c.fetchone()
            # newname = check[0]
            conn.close()
            new_details = {
                'email' : account,
                # 'password' : hashed_password,
                'name' : req['name'],
                'university' : req['university'],
                'degree' : req['degree'],
                'gradYear' : req['gradYear']
            }
            # else:   
            #    api.abort(400, "Password incorrect", ok=False)

        else: 
            api.abort(400, "Update Error")
            conn.close()
        
        return_val = {
            'ok' : True,
            'new' : new_details
            #'newname' : newname
        }
        return return_val
