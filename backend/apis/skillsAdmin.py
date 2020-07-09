from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db
from werkzeug.security import generate_password_hash, check_password_hash


api = Namespace('SkillsAdmin', description='SkillsAdmin user operations')

update_details = api.model('update_skills', {
    'new_password' : fields.String(description='new password for account access', required=True)
})

@api.route('/<string:email>')
class SkillsAdminAccount(Resource):
    @api.doc(description="Get information for administrator with email")
    def get(self, email):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT * FROM SkillsBackpackAdmin WHERE email = ?", (email,))

        info = c.fetchone()
        if info == None:
            api.abort(400, "User '{}' not found".format(email), ok=False)
        print(info)
        name = info[0]
        email = info[1]
        password = info[2]
        user_details = {
            'name' : name,
            'email' : email,
            'password' : password
        }
        return_val = {
            'ok' : 'True',
            'user' : user_details
        }
        return return_val

    @api.doc(description="Update admin password")
    @api.expect(update_details)
    def put(self, email):
        req =request.get_json()

        conn = db.get_conn()
        c = conn.cursor()
        c.execute("SELECT password FROM SkillsBackpackAdmin WHERE email = ?", (email,))
        query = c.fetchone()
        if query == None:
            api.abort(400, "User '{}' not found".format(email), ok=False)
        
        password = query[0]
        #(check_password_hash(password, req['password'])
        hashed_password = generate_password_hash(req['new_password'], "sha256")
        c.execute("UPDATE SkillsBackpackAdmin SET password = ?, newAccount = 0 WHERE email = ?", (hashed_password, email,))
        conn.commit()
            #api.abort(400, "Password incorrect", ok=False)
        conn.close()

        return {
            'ok' : 'True'
        }

@api.route('/new/<string:email>')
@api.doc(params={'email': 'the email of the skillsBackpack admin account'})
class SkillsAdminInfo(Resource):
    @api.doc(description="Gets if the admin is new or not (needs to change password). Returns True if new account")
    def get(self, email):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT newAccount FROM SkillsBackpackAdmin WHERE email = ?", (email,))
        newAccount = c.fetchone()
        
        conn.close()
        if newAccount == None:
            api.abort(400, "User '{}' not found".format(email), ok=False)

        newAccount = newAccount[0]
        if newAccount == 1:
            return {
                'ok' : 'True',
                'message' : 'Password needs to be updated'
            }
        else:
            return {
                'ok' : 'False',
                'message' : 'Account is all good'
            }

# account stuff       
@api.route('/all')
class accounts(Resource):
    def get(self):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT * FROM SkillsBackpackAdmin")
        
skills_admin_details = api.model('skills admin details', {
    'email' : fields.String(description='university email for account identification', required=True),
    'password'  : fields.String(description='password for account access', required=True),
    'name' : fields.String(description='name of user', required=True),
})


@api.route('/<string:account>')
class accountInfo(Resource):
    def get(self, account):
        conn = db.get_conn()
        c = conn.cursor()
        

        c.execute("SELECT EXISTS(SELECT email FROM SkillsBackpackAdmin WHERE email = ?)", (account,))
        account_check = c.fetchone()[0]
        
        if (account_check == 0):
            api.abort(404, "Account '{}' doesn't exist".format(account), ok=False)

        # SELECT STUFF FROM SKILLS ADMIN
        # FORMAT RESPONSE
        return_val = {
            'email' : account
        }
        return return_val
        
    
    @api.doc(description="Delete specified account")
    def delete(self, account):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT EXISTS(SELECT email FROM SkillsBackpackAdmin WHERE email = ?)", (account,))
        account_check = c.fetchone()[0]
        
        if (account_check == 0):
            api.abort(404, "Account '{}' doesn't exist".format(account), ok=False)

        c.execute("DELETE FROM SkillsBackpackAdmin WHERE email = ?)", (account,))
        
        conn.commit()
        conn.close()
        return_val = {
            'ok': True
        }
        return return_val

    @api.doc(description="Edit user details")
    @api.expect(skills_admin_details)
    def put(self, account):
        conn = db.get_conn()
        c = conn.cursor()
        req = request.get_json()
        
        c.execute("SELECT EXISTS(SELECT email FROM SkillsBackpackAdmin WHERE email = ?)", (account,))
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
            c.execute("SELECT password FROM SkillBackpackAdmin WHERE email = ?", (account,))
            query = c.fetchone()
            if query == None:
                api.abort(400, "User '{}' not found".format(account), ok=False)
            password = query[0]
            if req['password'] == password:
            # update 
                c.execute("UPDATE SkillsBackpackAdmin SET (name) = (?) WHERE email = ?",(req['name'], req['email'],))
                conn.commit()
                conn.close()
                new_details = {
                    'email' : account,
                    'password' : hashed_password,
                    'name' : req['name'],
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
