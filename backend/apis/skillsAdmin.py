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
        if req['password'] == password:
            c.execute("UPDATE SkillsBackpackAdmin SET password = ? WHERE email = ?", (req['new_password'],email,))
            conn.commit()
        else:
            api.abort(400, "Password incorrect", ok=False)
        conn.close()

        return {
            'ok' : 'True'
        }

@api.route('/new/<string:email>')
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
