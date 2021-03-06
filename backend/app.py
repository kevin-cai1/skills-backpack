from flask import Flask
from flask_cors import CORS
from apis import api
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
api.init_app(app)

CORS(app, resources={r'/*': {'origins': '*'}})  # allows CORS

if __name__ == "__main__":
    app.run(debug=True)