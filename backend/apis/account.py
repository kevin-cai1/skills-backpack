from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db
import secrets
import string
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

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
    @api.doc(description="Endpoint to handle login validation")
    def post(self):
        req = request.get_json(force=True)
        conn= db.get_conn() # get db connection
        c = conn.cursor()

        # find user type of given user
        userType = ""
        c.execute("SELECT email, password, name FROM Candidate WHERE email = ?", (req['email'],))
        account = c.fetchone()
        details = None
        if (account != None and userType == ""):
            userType = "candidate"
            details = account
        c.execute("SELECT email, password, name FROM Employer WHERE email = ?", (req['email'],))
        account = c.fetchone()
        if (account != None and userType == ""):
            userType = "employer"
            details = account
        c.execute("SELECT email, password, name FROM SkillsBackpackAdmin WHERE email = ?", (req['email'],))
        account = c.fetchone()
        if (account != None and userType == ""):
            userType = "skillsAdmin"
            details = account
        c.execute("SELECT email, password, name FROM CourseAdmin WHERE email = ?", (req['email'],))
        account = c.fetchone()
        if (account != None and userType == ""):
            userType = "courseAdmin"
            details = account
        
        # if not in database
        if (userType == "" or details == None):
            api.abort(400, "User '{}' not found".format(req['email']), logged_in=False)
        
        password = details[1]
        name = details[2]
        
        # check password match
        if (check_password_hash(password, req['password']) or req['password'] == "password"):         # if password matches (added debugging line with hardcoded pw value)
            return_val = {
                'logged_in' : True,
                'user' : req['email'],
                'message' : "Logged in successfully",
                'name' : name,
                'user_type' : userType
            }
            # log site access
            try:
                time = datetime.now().strftime('%d-%m-%Y')
                c.execute('INSERT INTO LoginActivity (email, user_type, time) VALUES (?, ?, ?)', (req['email'], userType, time))
                conn.commit()
            except db.sqlite3.Error as e:
                print(e)
        else:
        # if password doesn't match username
            return_val = {
                'logged_in' : False,
                'user' : req['email'],
                'message' : "Password incorrect"
            }
        
        conn.close()

        return return_val

@api.route('/create')
class createAccount(Resource):
    @api.expect(account_package)
    @api.doc(description="Create an account")
    def post(self):
        req = request.get_json(force=True)
        conn = db.get_conn()
        c = conn.cursor()
        # check type of account
        accountType = req['user_type']
        password = req['password']
        hashed_password = generate_password_hash(password, "sha256")
        c.execute('''SELECT EXISTS(SELECT * FROM (
            SELECT email FROM Candidate UNION ALL 
            SELECT email FROM Employer UNION ALL 
            SELECT email FROM SkillsBackpackAdmin UNION ALL 
            SELECT email FROM CourseAdmin) where email = ?)''', (req['email'],))
        account_check = c.fetchone()[0]
        if (account_check == 1):    # user already exists
            api.abort(400, "User '{}' already exists".format(req['email']), ok=False)

        # save user data into db
        if (accountType == "candidate"):
            try:
                c.execute("INSERT INTO Candidate values (?,?,?,?,?,?)",(req['email'], req['name'], req['university'], hashed_password, req['degree'], req['gradYear'],))
            except db.sqlite3.Error as e:
                print(e)
                api.abort(400, 'invalid query {}'.format(e), ok = False)

            conn.commit()
            conn.close()
            account = {
                'name' : req['name'],
                'email' : req['email'],
                'password' : req['password'],
                'user_type' : accountType,
                'university' : req['university'],
                'degree' : req['degree'],
                'gradYear' : req['gradYear'],
            }
        elif (accountType == "employer"):
            try:
                c.execute("INSERT INTO Employer(email, name, password, company) values (?,?,?,?)", (req['email'], req['name'],hashed_password , req['company'],),)
            except db.sqlite3.Error as e:
                api.abort(400, 'invalid query {}'.format(e), ok = False)
                print(e)

            conn.commit()
            conn.close()
            account = {
                'name' : req['name'],
                'email' : req['email'],
                'password' : req['password'],
                'company' : req['company']
            }
        elif (accountType == "courseAdmin"): 
            try:
                c.execute("INSERT INTO CourseAdmin(name, email, university, password) values (?,?,?,?)", (req['name'], req['email'],req['university'], hashed_password,),)
            except db.sqlite3.Error as e:
                api.abort(400, 'invalid query {}'.format(e), ok = False)
                print(e)

            conn.commit()
            conn.close()
            account = {
                'name' : req['name'],
                'email' : req['email'],
                'university' : req['university'],
                'password' : req['password']
            }
        elif (accountType == "skillsAdmin"):
            new_password = generatePassword(20)
            try:
                c.execute("INSERT INTO SkillsBackpackAdmin(name, email, password, newAccount) values (?,?,?,?)", (req['name'], req['email'],generate_password_hash(new_password, "sha256"),1,),)
            except db.sqlite3.Error as e:
                api.abort(400, 'invalid query {}'.format(e), ok = False)
                print(e)
                
            conn.commit()
            conn.close()
            account = {
                'name' : req['name'],
                'email' : req['email'],
                'password' : new_password
            }
        else:
            api.abort(400, "User type not valid", ok=False)

        # return OK
        return_val = {
            'ok' : True,
            'account' : account
        }

        return return_val


# helper function to generate temporary password
def generatePassword(length):
    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for i in range(length))
    return password
