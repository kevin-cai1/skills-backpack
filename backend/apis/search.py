from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

import db

api = Namespace('Search', description='Search algorithm for employers to find EPs based on employability skills and grad attributes')

search_variables = api.model('search variables', {
    'grad_attributes' : fields.List(fields.String, description = 'grad outcomes that the employer is searching for in EPs',
    'employability_skills' : fields.List(fields.String, description = 'employability skills htat the employer is searching for in EPs')
})

@api.route('/search')
class search(Resource):
    def get(self):
        conn = db.get_conn()
        c = conn.cursor()


