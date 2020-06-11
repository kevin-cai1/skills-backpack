from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

api = Namespace('test', description='test operations')

@api.route('/<int:id>')
class test(Resource):
    def get(self, id):
        return "ret"
