from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db

api = Namespace('SkillsAdmin', description='SkillsAdmin user operations')

update_details = api.model('update', {
    'password'  : fields.String(description='password for account access', required=True),
    'new_password' : fields.String(description='new password for account access', required=True)
})

@api.route('/<string:email>')
class SkillsAdminAccount(Resource):
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

@api.route('/<string:email>/new')
@api.doc(params={'email': 'the email of the skillsBackpack admin account'})
class SkillsAdminInfo(Resource):
    @api.doc(description="Gets if the admin is new or not (needs to change password)")
    def get(self, email):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT newAccount FROM SkillsBackpackAdmin WHERE email = ?", (email,))
        newAccount = c.fetchone()
        
        conn.close()
        if newAccount == None:
            api.abort(400, "User '{}' not found".format(email), ok=False)
        if newAccount == 1:
            return {
                'ok' : 'False',
                'message' : 'Account is all good'
            }
        else:
            return {
                'ok' : 'True',
                'message' : 'Password needs to be updated'
            }

@api.route('/<string:email>/details')
class updateAccountP(Resource):
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
        if req['password'] == password:
            c.execute("UPDATE SkillsBackpackAdmin SET password = ? WHERE email = ?", (req['new_password'],email,))
            conn.commit()
        else:
            api.abort(400, "Password incorrect", ok=False)
        conn.close()

        return {
            'ok' : 'True'
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

    @api.doc(description="Edit user name")
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
            
            # getting api input
            # edit_details = request.get_json()
            # pw_edit = req.get('password')
            # name_edit = req.get('name')
            # uni_edit = req.get('university')

            # update 
            c.execute("UPDATE SkillsBackpackAdmin SET (password, name) = (?,?) WHERE email = ?",(req['password'], req['name'], req['email'],))
            conn.commit()
            conn.close()
            new_details = {
                'email' : req['email'],
                'password' : req['password'],
                'name' : req['name'],
            }

        else: 
            api.abort(400, "Update Error")
            conn.close()
        return_val = {
            'ok' : True,
            'new' : new_details
        }
        return return_val