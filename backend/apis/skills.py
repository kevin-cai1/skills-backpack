from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify
from .match import emailMatches

import db

api = Namespace('Skills', description='Endpoints that manage the system stored list of job skills')

skill_package = api.model('skill', {
    'id' : fields.Integer(description='id of skill to add. -1 if skill is not defined'),
    'name' : fields.String(description='name of the skill')
})

@api.route("/all")
class AllSkills(Resource):
    @api.doc(description="Get list of all skills stored in skill bank")
    def get(self):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT id, name FROM Skill")
        results = c.fetchall()

        if (results == []):
            api.abort(400, "No skills found", ok=False)
            
        entries = []
        entry_count = 0
        for r in results:
            entry = {
                'id': r[0],
                'name': r[1],
            }
            entries.append(entry)
            entry_count += 1

        return_val = {
            'ok': True,
            'entry_count': entry_count,
            'entries': entries
        }
        return return_val

@api.route("/<int:id>")
@api.doc(params={'id': 'the skill id of a specific skill'})
class SkillInfo(Resource):
    @api.doc(description="get info for specific skill by id")
    def get(self, id):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT id, name FROM Skill WHERE id = ?", (id,))
        result = c.fetchone()

        conn.close()

        if (result == None):
            api.abort(400, "No skill with id '{}' found".format(id), ok=False)

        entry = {
            'id': result[0],
            'name': result[1],
        }

        return_val = {
            'ok': True,
            'entry': entry
        }
        
        return return_val

    @api.doc(description="delete specified skill from skill bank")
    def delete(self, id):
        conn = db.get_conn()
        c = conn.cursor()

        c.execute("SELECT id FROM Skill WHERE id = ?", (id,))
        result = c.fetchone()

        if (result == None):
            api.abort(400, "No skill with id '{}' found".format(id), ok=False)

        c.execute("DELETE FROM Skill WHERE id = ?", (id,))

        conn.commit()
        conn.close()

        return_val = {
            'ok': True,
        }
        
        return return_val


@api.route('/<string:email>')
class UserSkills(Resource):
    @api.doc(description="Add specified skill to user (can be candidate or employer)")
    @api.expect(skill_package)
    def post(self, email):
        req = request.get_json(force=True)

        conn= db.get_conn()
        c = conn.cursor()

        # check user exists
        c.execute("SELECT email from Candidate WHERE email = ?", (email,))
        account = c.fetchone()
        linkID = None
        # check if given user is candidate or employer
        if (account != None):
            linkID = account[0]
            userType = "candidate"
        else:
            c.execute("SELECT email from Employer WHERE email = ?", (email,))
            account = c.fetchone()

            if (account != None):
                linkID = account[0]
                userType = "employer"

        if (linkID == None):
            api.abort("User '{}' not found".format(email), ok=False)

        # check if new record or existing record (-1 to specify new skill)
        if (req['id'] == -1):
            # check if similar record already exists
            c.execute('SELECT id, name FROM Skill WHERE LOWER(name) = LOWER(?)', (req['name'],))

            match = c.fetchone()

            if (match == None): # no existing record
                newID = generateID()
                # insert new skill into skills bank
                c.execute("INSERT INTO Skill (id, name) VALUES (?,?)", (newID, req['name'],))
                skillID = newID
            else:
                skillID = match[0]
                
        else:   
            # existing record
            c.execute("SELECT id, name FROM Skill WHERE id = ?", (req['id'],))
            skill = c.fetchone()

            if (skill == None):
                api.abort(400, "Skill with id '{}' not found".format(req['id']), ok=False)
            
            skillID = skill[0]

        # link skillID to user
        if (userType == "candidate"):
            c.execute("SELECT * FROM ePortfolio_Skill WHERE candidate = ? AND skillID = ?", (linkID, skillID,))
            res = c.fetchone()
            if (res == None):
                try:
                    c.execute("INSERT INTO ePortfolio_Skill (candidate, skillID) VALUES (?,?)", (linkID, skillID,))
                except db.sqlite3.Error as e:
                    api.abort(400, 'invalid query {}'.format(e), ok = False)
                    print(e)

        else :
            c.execute("SELECT * FROM Employer_Skill WHERE employer = ? AND skillID = ?", (linkID, skillID,))
            res = c.fetchone()
            if (res == None):
                try:
                    c.execute("INSERT INTO Employer_Skill (employer, skillID) VALUES (?,?)", (linkID, skillID,))
                except db.sqlite3.Error as e:
                    api.abort(400, 'invalid query {}'.format(e), ok = False)
                    print(e)
       
        conn.commit()
        conn.close()
        if userType == "candidate":
            emailMatches(email)

        return_val = {
            'ok': True,
        }
        return return_val

    # Endpoint for retrieving list of skills associated with a candidate or employer criteria
    @api.doc(description="Get list of skills for given user")
    def get(self, email):
        # check user exists
        conn = db.get_conn()
        c = conn.cursor()
        entries = []
        entry_count = 0


        c.execute("SELECT email from Candidate WHERE email = ?", (email,))
        account = c.fetchone()
        linkID = None
        # check account type (candidate or employer)
        if (account != None):
            linkID = account[0]
            userType = "candidate"
        else:
            c.execute("SELECT email from Employer WHERE email = ?", (email,))
            account = c.fetchone()

            if (account != None):
                linkID = account[0]
                userType = "employer"

        if (linkID == None):
            api.abort("User '{}' not found".format(email), ok=False)
        
        if (userType == "candidate"):
            c.execute("SELECT id, name FROM Skill WHERE id IN (SELECT skillID from ePortfolio_Skill WHERE candidate = ?)", (email,))
            
        else:
            c.execute("SELECT id, name FROM Skill WHERE id IN (SELECT skillID from Employer_Skill WHERE employer = ?)", (email,))
        
        results = c.fetchall()
        conn.close()
        entries = []
        entry_count = 0
        for r in results:
            entry = {
                'id': r[0],
                'name': r[1]
            }
            entries.append(entry)
            entry_count += 1

        return_val = {
            'ok': True,
            'entry_count': entry_count,
            'entries': entries
        }
        return return_val

    @api.doc(description="Delete specified skill from given user")
    @api.expect(skill_package)
    def delete(self, email):
        req = request.get_json(force=True)
        conn = db.get_conn()
        c = conn.cursor()
        skillID = req['id']

        c.execute("SELECT email from Candidate WHERE email = ?", (email,))
        account = c.fetchone()
        linkID = None
        # check account type (candidate or employer)
        if (account != None):
            linkID = account[0]
            userType = "candidate"
        else:
            c.execute("SELECT email from Employer WHERE email = ?", (email,))
            account = c.fetchone()

            if (account != None):
                linkID = account[0]
                userType = "employer"

        if (linkID == None):
            api.abort("User '{}' not found".format(email), ok=False)

        # check skill exists for given user
        if (userType == "candidate"):
            c.execute("SELECT * FROM ePortfolio_Skill WHERE candidate = ? AND skillID = ?", (email, skillID,))
        else:
            c.execute("SELECT * FROM Employer_Skill WHERE employer = ? AND skillID = ?", (email, skillID,))

        result = c.fetchone()
        if (result == None):
            api.abort(400, "Skill '{}' does not exist for user '{}'".format(skillID, email))
        
        if (userType == "candidate"):
            c.execute("DELETE FROM ePortFolio_Skill WHERE candidate = ? AND skillID = ?", (email, skillID,))
        else:
            c.execute("DELETE FROM Employer_Skill WHERE employer = ? AND skillID = ?", (email, skillID,))
        
        conn.commit()

        if userType != "candidate":
            for candidate in c.execute('SELECT email FROM Candidate'):
                emailMatches(candidate[0])
        
        conn.close()

        return_val = {
            'ok': True,
        }

        return return_val

# fetch id for new skill
def generateID():
    conn = db.get_conn() 
    c = conn.cursor() #cursor to execute commands
    c.execute('SELECT MAX(id) FROM Skill')
    val = c.fetchone()[0]
    return val+1
