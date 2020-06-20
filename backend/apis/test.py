from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

api = Namespace('test', description='test operations')

@api.route('/<int:id>')
class test(Resource):
    @api.doc("Endpoint to return ID")
    def get(self, id):
        ret = {
            'id' : id
        }
        return ret
