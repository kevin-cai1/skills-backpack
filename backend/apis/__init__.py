from flask_restplus import Api

from .test import api as ns1
from .login import api as ns2


api = Api(
        title="Skills Backpack",
        version='1.0',
        description="API to serve skills-app"
        )

api.add_namespace(ns1, path='/test')
api.add_namespace(ns2, path='/account')