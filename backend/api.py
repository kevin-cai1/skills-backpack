from flask import Flask, request, jsonify
from flask_restplus import Resource, Api, fields
import db

app = Flask(__name__)
api = Api(
        app,
        default="Learning Tracking",
        title="Learning Tracking System",
        description="API to serve learning-mgmt-system"
        )