from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db
import os

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

api = Namespace('Course Admin', description='Course Admin invite and creation')

email_details = api.model('update', {
    'skills_email'  : fields.String(description='email of skills admin inviting course admin', required=True),
    'course_email' : fields.String(description='new password for account access', required=True)
})

@api.route('/invite')
class Invite(Resource):
    @api.doc(description="sends an email invite to the specified email")
    @api.expect(email_details)
    def post(self):
        req = request.get_json()
        skills_email = req['skills_email']
        course_email = req['course_email']

        message = Mail(
            from_email=skills_email,
            to_emails=course_email,
            subject='Join Skills Backpack platform!',
            html_content='<h1>Welcome {}</h1><strong> {} has invited you to join Skills Backpack!</strong><br><br><a href="http://localhost:3000/register">Click here</a> to join'.format(course_email, skills_email)
        )
        message.dynamic_template_data = {
            'header': "{} has invited you to join Skills Backpack!".format(skills_email),
            'text': "To create an account, please click the link below",
            'c2a_link': "http://localhost:3000/register",
            'c2a_button': "Create account"
        }
        message.template_id = 'd-165f1bd189884256a10ee0c090fe3a44'
        print(os.environ.get('SENDGRID_API_KEY'))
        try:
            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
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

        
        

