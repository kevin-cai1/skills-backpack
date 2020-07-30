from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db
from werkzeug.security import generate_password_hash, check_password_hash
from itertools import groupby


api = Namespace('SkillsAdmin', description='SkillsAdmin user operations')

update_details = api.model('update_skillsadminpw', {
    'new_password' : fields.String(description='new password for account access', required=True)
})

# payload of update skills admin details
skills_admin_details = api.model('skills admin details', {
    'email' : fields.String(description='university email for account identification', required=True),
    'password'  : fields.String(description='password for account access', required=True),
    'name' : fields.String(description='name of user', required=True),
})

@api.route('/<string:email>')
class SkillsAdminAccount(Resource):
    @api.doc(description="Get user details for given skills backpack admin")
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

# creates new skills admin 
@api.route('/new/<string:email>')
@api.doc(params={'email': 'the email of the skillsBackpack admin account'})
class SkillsAdminInfo(Resource):
    @api.doc(description="Gets if the admin is new or not (needs to change password). Returns true for first time logins")
    def get(self, email):
        conn = db.get_conn()
        c = conn.cursor()

        # fetch flag for new accounts
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

# updated initial course admin password 
@api.route('/details/<string:email>')
class updateAccountP(Resource):
    @api.expect(update_details)
    @api.doc(description="Update skillsbackpack admin password")
    def put(self, email):
        req =request.get_json()

        conn = db.get_conn()
        c = conn.cursor()
        c.execute("SELECT password FROM SkillsBackpackAdmin WHERE email = ?", (email,))
        query = c.fetchone()
        if query == None:
            api.abort(400, "User '{}' not found".format(email), ok=False)
        
        password = query[0]
        hashed_password = generate_password_hash(req['new_password'], "sha256")
        print("UPDATE PASSWORD")
        try:
            c.execute("UPDATE SkillsBackpackAdmin SET password = ?, newAccount = 0 WHERE email = ?", (hashed_password, email,))
        except db.sqlite3.Error as e:
            api.abort(400, 'invalid query {}'.format(e), ok = False)
            print(e)
        conn.commit()
        
        conn.close()

        return {
            'ok' : 'True'
        }
      
@api.route('/all')
class accounts(Resource):
    @api.doc(description="Get all admin details from system")
    def get(self):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT * FROM SkillsBackpackAdmin")

        return 0
        
@api.route('/<string:account>')
class accountInfo(Resource):
    def get(self, account):
        conn = db.get_conn()
        c = conn.cursor()
        
        c.execute("SELECT EXISTS(SELECT email FROM SkillsBackpackAdmin WHERE email = ?)", (account,))
        account_check = c.fetchone()[0]
        
        if (account_check == 0):
            api.abort(404, "Account '{}' doesn't exist".format(account), ok=False)

        return_val = {
            'email' : account
        }
        return return_val
        
    # delete skills admin
    @api.doc(description="Delete specified account")
    def delete(self, account):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT EXISTS(SELECT email FROM SkillsBackpackAdmin WHERE email = ?)", (account,))
        account_check = c.fetchone()[0]
        
        if (account_check == 0):
            api.abort(404, "Account '{}' doesn't exist".format(account), ok=False)

        c.execute("DELETE FROM SkillsBackpackAdmin WHERE email = ?", (account,))
        
        conn.commit()
        conn.close()
        return_val = {
            'ok': True
        }
        return return_val

    # skills admin edit details
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
           
            c.execute("UPDATE SkillsBackpackAdmin SET (name) = (?) WHERE email = ?",(req['name'], req['email'],))
            conn.commit()
            conn.close()
            new_details = {
                'email' : account,
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

@api.route('/dash/accounts')
class DashInfo(Resource):
    @api.doc(description="Get account counts for skills admin dashboard")
    def get(self):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute('''SELECT 
                    (SELECT COUNT(*) FROM Candidate) AS candidate_count, 
                    (SELECT COUNT(*) FROM Employer) AS employer_count,
                    (SELECT COUNT(*) FROM CourseAdmin) AS course_admin_count,
                    (SELECT COUNT(*) FROM SkillsBackpackAdmin) AS skills_admin_count''')

        results = c.fetchone()
        
        values = [
            {'name': 'Candidates', 'count': results[0]},
            {'name': 'Employers', 'count': results[1]},
            {'name': 'Course Admins', 'count': results[2]},
            {'name': 'Skills Admins', 'count': results[3]}]
        
        return_val = {
            'ok': True,
            'data': values
        }
        return return_val

@api.route('/dash/activity')
class DashActivity(Resource):
    @api.doc(description="Get access activity for skills admin dashboard")
    def get(self):
        conn = db.get_conn()
        c = conn.cursor()
        
        # select all log activity
        c.execute("SELECT time, user_type, count(user_type) FROM LoginActivity GROUP BY time, user_type")
        results = c.fetchall()

        grouped_results = sorted(results, key=lambda tup: tup[0])   # sort log activity by time
        values = []
        # group log activity by time
        for key, group in groupby(grouped_results, lambda x: x[0]): # iterate through grouped time dict
            candidate_count = 0
            employer_count = 0
            course_admin_count = 0
            skills_admin_count = 0
            for item in group:
                if (item[1] == 'candidate'):
                    candidate_count += item[2]
                elif (item[1] == 'employer'):
                    employer_count += item[2]
                elif (item[1] == 'courseAdmin'):
                    course_admin_count += item[2]
                elif (item[1] == 'skillsAdmin'):
                    skills_admin_count += item[2]
            entry = {
                'name': key, 'candidate': candidate_count, 'employer': employer_count, 'courseAdmin': course_admin_count, 'skillsAdmin': skills_admin_count
            }
            values.append(entry)
        
        return_val = {
            'ok': True,
            'data': values
        }

        return return_val

        