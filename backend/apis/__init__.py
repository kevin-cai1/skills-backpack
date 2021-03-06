from flask_restplus import Api

from .test import api as ns1
from .account import api as ns2
from .candidate import api as ns3
from .skillsAdmin import api as ns4
from .course import api as ns5
from .courseAdmin import api as ns6
from .employment import api as ns7
from .skills import api as ns8
from .employer import api as ns9
from .ePortfolio import api as ns10
from .search import api as ns11
from .password import api as ns12
from .links import api as ns13
from .match import api as ns14

api = Api(
        title="Skills Backpack",
        version='1.0',
        description="API to serve skills-app"
        )

api.add_namespace(ns1, path='/test')
api.add_namespace(ns2, path='/account')
api.add_namespace(ns3, path='/candidate')
api.add_namespace(ns4, path='/skills_admin')
api.add_namespace(ns5, path='/course/add')
api.add_namespace(ns6, path='/course_admin')
api.add_namespace(ns7, path='/employment')
api.add_namespace(ns8, path='/skills')
api.add_namespace(ns9, path='/employer')
api.add_namespace(ns10, path='/ePortfolio')
api.add_namespace(ns11, path='/search')
api.add_namespace(ns12, path='/password')
api.add_namespace(ns13, path='/link')
api.add_namespace(ns14, path='/match')