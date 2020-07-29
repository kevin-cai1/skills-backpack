  
from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import os, db

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from cryptography.fernet import Fernet
from werkzeug.security import generate_password_hash

api = Namespace('Course Admin', description='Course Admin invite and creation')

email_details = api.model('update', {
    'skills_email'  : fields.String(description='email of skills admin inviting course admin', required=True),
    'course_email' : fields.String(description='new password for account access', required=True)
})

encryption_package = api.model('decrypt', {
    'token' : fields.String(description='encrypted token', required=True)
})

@api.route('/invite')
class Invite(Resource):
    @api.doc(description="sends an email invite to the specified email")
    @api.expect(email_details)
    def post(self):
        print("SENDING COURSE ADMIN INVITE")
        req = request.get_json()
        skills_email = req['skills_email']
        course_email = req['course_email']

        # assign skills email to be the skillsbackpack email
        skills_email = 'skillsbackpack@gmail.com'

        message = Mail(
            from_email=skills_email,
            to_emails=course_email,
            subject='Join Skills Backpack platform!',
            html_content='<h1>Welcome {}</h1><strong> {} has invited you to join Skills Backpack!</strong><br><br><a href="http://localhost:3000/register">Click here</a> to join'.format(course_email, skills_email)
        )

        encrypted_email = encrypt_email(course_email)

        message.dynamic_template_data = {
            'header': "{} has invited you to join Skills Backpack!".format(skills_email),
            'text': "To create an account, please click the link below",
            'c2a_link': "http://localhost:3000/register/{}".format(encrypted_email),
            'c2a_button': "Create account"
        }
        # template id
        message.template_id = 'd-165f1bd189884256a10ee0c090fe3a44' 
        # api key for sendgrid access
        API_key = "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" 
        
        # send email request
        try:
            sg = SendGridAPIClient(API_key)
            response = sg.send(message) 
            return_val = {
                'status_code' : response.status_code,
                'sendgrid_body': response.body,
                'ok' : True
            }
        except Exception as e:
            print(e)
            api.abort(400, 'Email failed to send', ok=False)

        return return_val

@api.route('/email/decode')
class Decode(Resource):
    @api.doc(description="Helper function to decode encrypted email")
    @api.expect(encryption_package)
    def post(self):
        req = request.get_json(force=True)
        email = decrypt_email(req['token'])
        return {
            'ok' : True,
            'email' : email
        }

# takes in email string, returns encrypted string
def encrypt_email(email):
    key = "Jcrnrh_1-Zc5DSNoMNmlDwaRWBCYhaE3ZyCZkSLJvIY="
    f = Fernet(key)
    token = f.encrypt(email.encode())
    return token.decode()

# takes in encrypted string, returns descrypted email string
def decrypt_email(token):
    key = "Jcrnrh_1-Zc5DSNoMNmlDwaRWBCYhaE3ZyCZkSLJvIY="
    f = Fernet(key)
    email = f.decrypt(token.encode())
    return email.decode()

# account stuff
@api.route('/all')
class accounts(Resource):
    @api.doc(description="get all account details")
    def get(self):
        conn = db.get_conn()
        c = conn.cursor()
        c.execute("SELECT * FROM CourseAdmin")

# payload needed to update course admin details
course_admin_details = api.model('course admin details', {
    'email' : fields.String(description='university email for account identification', required=True),
    'name' : fields.String(description='name of user', required=True),
    'university' : fields.String(description='university of course admin')
})

@api.route('/<string:account>')
class accountInfo(Resource):
    def get(self, account):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT EXISTS(SELECT email FROM CourseAdmin WHERE email = ?)", (account,))
        account_check = c.fetchone()[0]

        if (account_check == 0):
            api.abort(404, "Account '{}' doesn't exist".format(account), ok=False)

        return_val = {
            'email' : account
        }
        return return_val

    # delete course admin account
    @api.doc(description="Delete specified account")
    def delete(self, account):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT EXISTS(SELECT email FROM CourseAdmin WHERE email = ?)", (account,))
        account_check = c.fetchone()[0]

        if (account_check == 0):
            api.abort(404, "Account '{}' doesn't exist".format(account), ok=False)

        c.execute("DELETE FROM CourseAdmin WHERE email = ?)", (account,))

        conn.commit()
        conn.close()
        return_val = {
            'ok': True
        }
        return return_val

    # allows course admin to update their details
    @api.doc(description="Edit user details")
    @api.expect(course_admin_details)
    def put(self, account):
        conn = db.get_conn()
        c = conn.cursor()
        req = request.get_json()

        c.execute("SELECT EXISTS(SELECT email FROM CourseAdmin WHERE email = ?)", (account,))
        account_check = c.fetchone()[0]

        # if account does not exist abort
        if (account_check == 0):
            api.abort(404, "Account '{}' doesn't exist".format(account), ok=False)

        # change account details if account exists
        elif (account_check == 1):
            
            # updating details
            c.execute("UPDATE CourseAdmin SET (name, university) = (?,?) WHERE email = ?",(req['name'], req['university'], req['email'],))
            conn.commit()
            conn.close()
            new_details = {
                'email' : account,
                'name' : req['name'],
                'university' : req['university']
            }
            
        else:
            api.abort(400, "Update Error")
            conn.close()
        return_val = {
            'ok' : True,
            'new' : new_details
        }
        return return_val

    # returns a list of tuples of (course code, university, course name) or empty list if no associated courses
    @api.doc(description = 'Get list of registered courses associated with admin')
    def getcourse(self, account):
        conn = db.get_conn()
        c = conn.cursor()
        c.execute('SELECT code, university, name FROM Course WHERE courseAdminEmail = ?', (account,))
        res = c.fetchall()
        returnVal = {
            'courses': res
        }
        return returnVal