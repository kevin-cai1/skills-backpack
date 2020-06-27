from flask_restplus import Api

from .test import api as ns1
from .account import api as ns2
from .candidate import api as ns3
from .skillsAdmin import api as ns4


api = Api(
        title="Skills Backpack",
        version='1.0',
        description="API to serve skills-app"
        )

api.add_namespace(ns1, path='/test')
api.add_namespace(ns2, path='/account')
api.add_namespace(ns3, path='/candidate')
api.add_namespace(ns4, path='/skills_admin')
