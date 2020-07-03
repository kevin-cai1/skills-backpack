from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import os

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from cryptography.fernet import Fernet

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
        req = request.get_json()
        skills_email = req['skills_email']
        course_email = req['course_email']

        # temporary line for sendgrid to always work v
        skills_email = 'z5165218@unsw.edu.au'

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
        message.template_id = 'd-165f1bd189884256a10ee0c090fe3a44'
        print(os.environ.get('SENDGRID_API_KEY'))
        API_key = "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"
        try:
            sg = SendGridAPIClient(API_key)
            response = sg.send(message)
            print(response.status_code)
            print(response.body)
            print(response.headers)
            return_val = {
                'status_code' : response.status_code,
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
        

