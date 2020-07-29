from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db

from werkzeug.security import generate_password_hash, check_password_hash

api = Namespace('Password', description='Users can change password')

update_password = api.model('create', {
    'email' : fields.String(description='university email for account identification', required=True),
    'password'  : fields.String(description='current password for account access'),
    'new_password' : fields.String(description='new password for account access'),
})

@api.route('/<string:account>')
class accountInfo(Resource):
    @api.expect(update_password)
    def put(self, account):
        conn = db.get_conn()
        c = conn.cursor()
        req = request.get_json(force=True)

        # check if user is a candidate and match password before changing password 
        c.execute("SELECT EXISTS(SELECT email FROM Candidate WHERE email = ?)", (account,))
        candidate_check = c.fetchone()[0]
        if (candidate_check == 1):
            hashed_password = generate_password_hash(req['new_password'], "sha256")

            c.execute("SELECT password FROM Candidate WHERE email = ?", (account,))
            query = c.fetchone()
            password = query[0]
            if check_password_hash(password, req['password']):

                c.execute("UPDATE Candidate SET password = ? WHERE email = ?",(hashed_password, req['email'],))
                conn.commit()
                conn.close()
                return_val = {
                    'ok' : True,
                    'email' : account,
                    'message' : "Password successfully updated"
                } 
            else: 
                api.abort(400, "Candidate password incorrect", ok=False)
        
        # if user is not a candidate, check if they are an employer and match passworord before changing password 
        elif (candidate_check == 0):
            c.execute("SELECT EXISTS(SELECT email FROM Employer WHERE email = ?)", (account,))
            employer_check = c.fetchone()[0]
            if (employer_check == 1):
                hashed_password = generate_password_hash(req['new_password'], "sha256")

                c.execute("SELECT password FROM Employer WHERE email = ?", (account,))
                query = c.fetchone()
                password = query[0]
                if check_password_hash(password, req['password']):

                    c.execute("UPDATE Employer SET password = ? WHERE email = ?",(hashed_password, req['email'],))
                    conn.commit()
                    conn.close()
                    return_val = {
                        'email' : account,
                        'ok' : True,
                        'message' : "Password successfully updated"
                    } 
                else: 
                    api.abort(400, "Employer assword incorrect", ok=False)
        
        # if user is not a candidate or emplopyer, check if they are a skills backpack admin and match 
        # password before changing password 
        elif (employer_check == 0):
            c.execute("SELECT EXISTS(SELECT email FROM SkillsBackpackAdmin WHERE email = ?)", (account,))
            skillsadmin_check = c.fetchone()[0]
            if (skillsadmin_check == 1):
                hashed_password = generate_password_hash(req['new_password'], "sha256")

                c.execute("SELECT password FROM SkillsBackpackAdmin WHERE email = ?", (account,))
                query = c.fetchone()
                password = query[0]
                if check_password_hash(password, req['password']):

                    c.execute("UPDATE SkillsBackpackAdmin SET password = ? WHERE email = ?",(hashed_password, req['email'],))
                    conn.commit()
                    conn.close()
                    return_val = {
                        'email' : account,
                        'ok' : True,
                        'message' : "Password successfully updated"
                    } 
                else: 
                    api.abort(400, "Skills admin Password incorrect", ok=False)
            
        
        # if user is not a candidate or emplopyer or skills backpack admin, check if they are a course admin and 
        # match passworord before changing password 
        elif (skillsadmin_check == 0):
            c.execute("SELECT EXISTS(SELECT email FROM CourseAdmin WHERE email = ?)", (account,))
            courseadmin_check = c.fetchone()[0]
            if (courseadmin_check == 1):
                hashed_password = generate_password_hash(req['new_password'], "sha256")

                c.execute("SELECT password FROM CourseAdmin WHERE email = ?", (account,))
                query = c.fetchone()
                password = query[0]
                if check_password_hash(password, req['password']):

                    c.execute("UPDATE CourseAdmin SET password = ? WHERE email = ?",(hashed_password, req['email'],))
                    conn.commit()
                    conn.close()
                    return_val = {
                        'email' : account,
                        'ok' : True,
                        'message' : "Password successfully updated"
                    } 
                else: 
                    api.abort(400, "Course Admin password incorrect", ok=False)
        
        # return unable to update password if user does not match any of these users
        else: 
            api.abort(400, "Unable to update password, user does not exist")
            conn.close()
        
        return return_val


