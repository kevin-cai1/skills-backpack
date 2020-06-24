from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db
import secrets
import string

api = Namespace('Login', description='Login validation operations')

login_package = api.model('login', {
    'email' : fields.String(description='university email for account identification', required=True),
    'password'  : fields.String(description='password for account access', required=True)
})

account_package = api.model('create', {
    'email' : fields.String(description='university email for account identification', required=True),
    'password'  : fields.String(description='password for account access', required=True),
    'name' : fields.String(description='name of user', required=True),
    'user_type' : fields.String(description='access type of the user', required=True),
    'university' : fields.String(description='university of candidate/course admin'),
    'degree' : fields.String(description='degree of candidate'),
    'gradYear' : fields.Integer(description='graduation year'),
    'company' : fields.String(description='employers comapany')
})

@api.route('/login')
class login(Resource):
    @api.expect(login_package)
    def post(self):
        req = request.get_json()

        conn= db.get_conn()
        c = conn.cursor()
        print(req)
        # check for matching username listing in db
        c.execute('''SELECT * FROM (
                        SELECT email, password FROM Candidate UNION ALL 
                        SELECT email, password FROM Employer UNION ALL 
                        SELECT email, password FROM SkillsBackpackAdmin UNION ALL 
                        SELECT email, password FROM CourseAdmin) WHERE email = ?''', (req['email'],))

        account = c.fetchone() # returns 1 if exists

        conn.close()
        print("=====================================")
        print(account)
        # if not in database
        if (account == [] or account == None):
            api.abort(400, "User '{}' not found".format(req['email']), logged_in=False)
        
        password = account[1]
        # check password match
        if (req['password'] == password):         # if password matches
            return_val = {
                'logged_in' : True,
                'user' : req['email'],
                'message' : "Logged in successfully"
            }
        else:
        # if password doesn't match username
            return_val = {
                'logged_in' : False,
                'user' : req['email'],
                'message' : "Password incorrect"
            }

        return return_val

@api.route('/create')
class createAccount(Resource):
    @api.expect(account_package)
    def post(self):
        req = request.get_json()
        conn = db.get_conn()
        c = conn.cursor()

        # check type of account
        accountType = req['user_type']
        if (accountType == "candidate"):           
            c.execute("SELECT EXISTS(SELECT email FROM Candidate WHERE email = ?)", (req['email'],))
            account_check = c.fetchone()[0] # returns 1 if exists
            
            if (account_check == 1):    # user already exists
                api.abort(400, "User '{}' already exists".format(req['email']), ok=False)

            c.execute("INSERT INTO Candidate values (?,?,?,?,?,?)",(req['email'], req['name'], req['university'], req['password'], req['degree'], req['gradYear'],),)
            conn.commit()
            conn.close()
            account = {
                'name' : req['name'],
                'email' : req['email'],
                'password' : req['password'],
                'user_type' : accountType,
                'university' : req['university'],
                'degree' : req['degree'],
                'gradYear' : req['gradYear']
            }
        elif (accountType == "employer"):
            c.execute("SELECT EXISTS (SELECT email FROM Employer WHERE email = ?)", (req['email'],))
            account_check = c.fetchone()[0] # return 1 if exists

            if (account_check == 1):    # user already exists
                api.abort(400, "User '{}' already exists".format(req['email']), ok=False)
            
            c.execute("INSERT INTO Employer(email, name, password, company) values (?,?,?,?)", (req['email'], req['name'],req['password'], req['company'],),)
            conn.commit()
            conn.close()
            account = {
                'name' : req['name'],
                'email' : req['email'],
                'password' : req['password'],
                'company' : req['company']
            }
        elif (accountType == "courseAdmin"):
            c.execute("SELECT EXISTS (SELECT email FROM CourseAdmin WHERE email = ?)", (req['email'],))
            account_check = c.fetchone()[0] # return 1 if exists

            if (account_check == 1):    # user already exists
                api.abort(400, "User '{}' already exists".format(req['email']), ok=False)
            
            c.execute("INSERT INTO CourseAdmin(name, email, university, password) values (?,?,?,?)", (req['name'], req['email'],req['university'], req['password'],),)
            conn.commit()
            conn.close()
            account = {
                'name' : req['name'],
                'email' : req['email'],
                'university' : req['university'],
                'password' : req['password']
            }
        elif (accountType == "skillsAdmin"):
            c.execute("SELECT EXISTS (SELECT email FROM SkillsBackpackAdmin WHERE email = ?)", (req['email'],))
            account_check = c.fetchone()[0] # return 1 if exists

            if (account_check == 1):    # user already exists
                api.abort(400, "User '{}' already exists".format(req['email']), ok=False)
            
            new_password = generatePassword(20)


            c.execute("INSERT INTO SkillsBackpackAdmin(name, email, password, newAccount) values (?,?,?,?)", (req['name'], req['email'],new_password,1,),)
            conn.commit()
            conn.close()
            account = {
                'name' : req['name'],
                'email' : req['email'],
                'password' : new_password
            }
        else:
            api.abort(400, "User type not valid")

        # return OK
        return_val = {
            'ok' : True,
            'account' : account
        }

        return return_val

def generatePassword(length):
    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for i in range(length))
    return password
