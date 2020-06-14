from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

api = Namespace('Login', description='Login validation operations')

login_package = api.model('login', {
    'username' : fields.String(description='unique user name for account identification'),
    'password': fields.String(description='password for account access')
})

@api.route('/validate')
class login(Resource):
    @api.expect(login_package)
    def post(self):
        req = request.get_json()
        print(req['username'])
        print(req['password'])
        # check for matching username listing in db
        # if not in database
            # api.abort(404, "User '{}' doesn't exist".format(req['username']), ok=False)
        
        # check password match
        
        # if password doesn't match username
            
        # if password matches
            # give OK response
        return 0

