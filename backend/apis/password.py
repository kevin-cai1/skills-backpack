# lastest push w changes
from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db

from werkzeug.security import generate_password_hash, check_password_hash

api = Namespace('Password', description='Users can change password')

update_password = api.model('update_pw', {
    'userType' : fields.String(description='user type of specified user', required=True),
    'password'  : fields.String(description='current password for account access'),
    'new_password' : fields.String(description='new password for account access'),
})

@api.route('/<string:account>')
class accountInfo(Resource):
    @api.expect(update_password)
    @api.doc(description="endpoint to update user password")
    def put(self, account):
        conn = db.get_conn()
        c = conn.cursor()
        req = request.get_json(force=True)
        
        userType = req['userType']

        new_password = generate_password_hash(req['new_password'])
        if (userType == "candidate"):
            c.execute("SELECT password FROM Candidate WHERE email = ?", (account,))
            current_pw = c.fetchone()

            if (current_pw == None):
                api.abort(400, "User '{}' of type {} does not exist".format(account, userType), ok=False)

            current_pw = current_pw[0]

            if (check_password_hash(current_pw, req['password'])):  # check existing pw matches
                try:
                    c.execute("UPDATE Candidate SET password = ? WHERE email = ?", (new_password, account,))    # update new pw in database
                    conn.commit()
                except db.sqlite3.Error as e:
                    api.abort(400, 'invalid query {}'.format(e), ok = False)
                    print(e)
            else:
                api.abort(400, 'Current password does not match', ok=False)
        elif (userType == "employer"):
            c.execute("SELECT password FROM Employer WHERE email = ?", (account,))
            current_pw = c.fetchone()

            if (current_pw == None):
                api.abort(400, "User '{}' of type {} does not exist".format(account, userType), ok=False)

            current_pw = current_pw[0]

            if (check_password_hash(current_pw, req['password'])):  # check existing pw matches
                try:
                    c.execute("UPDATE Employer SET password = ? WHERE email = ?", (new_password, account,))    # update new pw in database
                    conn.commit()
                except db.sqlite3.Error as e:
                    api.abort(400, 'invalid query {}'.format(e), ok = False)
                    print(e)
            else:
                api.abort(400, 'Current password does not match', ok=False)
        elif (userType == "courseAdmin"):
            c.execute("SELECT password FROM CourseAdmin WHERE email = ?", (account,))
            current_pw = c.fetchone()

            if (current_pw == None):
                api.abort(400, "User '{}' of type {} does not exist".format(account, userType), ok=False)

            current_pw = current_pw[0]

            if (check_password_hash(current_pw, req['password'])):  # check existing pw matches
                try:
                    c.execute("UPDATE CourseAdmin SET password = ? WHERE email = ?", (new_password, account,))    # update new pw in database
                    conn.commit()
                except db.sqlite3.Error as e:
                    api.abort(400, 'invalid query {}'.format(e), ok = False)
                    print(e)
            else:
                api.abort(400, 'Current password does not match', ok=False)
        elif (userType == "skillsAdmin"):
            c.execute("SELECT password FROM SkillsBackpackAdmin WHERE email = ?", (account,))
            current_pw = c.fetchone()

            if (current_pw == None):
                api.abort(400, "User '{}' of type {} does not exist".format(account, userType), ok=False)

            current_pw = current_pw[0]

            if (check_password_hash(current_pw, req['password'])):  # check existing pw matches
                try:
                    c.execute("UPDATE SkillsBackpackAdmin SET password = ? WHERE email = ?", (new_password, account,))    # update new pw in database
                    conn.commit()
                except db.sqlite3.Error as e:
                    api.abort(400, 'invalid query {}'.format(e), ok = False)
                    print(e)
            else:
                api.abort(400, 'Current password does not match', ok=False)
        else:
            api.abort(400, "User type '{}' does not exist".format(userType), ok=False)
        conn.close()
        return_val = {
            'ok': True
        }
        return return_val