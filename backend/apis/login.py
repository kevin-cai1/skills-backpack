from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db

api = Namespace('Login', description='Login validation operations')

login_package = api.model('login', {
    'email' : fields.String(description='university email for account identification', required=True),
    'password'  : fields.String(description='password for account access', required=True)
})

account_package = api.model('create', {
    'email' : fields.String(description='university email for account identification', required=True),
    'password'  : fields.String(description='password for account access', required=True),
    'name' : fields.String(description='name of user', required=True),
    'user_type' : fields.String(description='access type of the user', required=True)
})

@api.route('/validate')
class login(Resource):
    @api.expect(login_package)
    def post(self):
        req = request.get_json()
        print(req['email'])
        print(req['password'])
        # check for matching username listing in db
        # if not in database
            # api.abort(404, "User '{}' doesn't exist".format(req['username']), ok=False)
        
        # check password match
        
        # if password doesn't match username
            return_val = {
                'logged_in' : False,
                'user' : req['email']
            }
            # give bad 
        # if password matches
            return_val = {
                'logged_in' : True,
                'user' : req['email']
            }
            # give OK response
        return return_val

@api.route('/create')
class createAccount(Resource):
    @api.expect(account_package)
    def post(self):
        req = request.get_json()
        # if user already exists
            # api.abort(400, "User '{}' already exists".format(req['username']))

        # check validity of fields? (strings, integer, etc)

        # create new account in db

        # return OK
        account = {
            'name' : req['name']
        }

        return_val = {
            'ok' : True,
            'account' : account
        }
