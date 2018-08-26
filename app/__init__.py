from flask import Flask, request, send_from_directory
from celery import Celery

from flask_sqlalchemy import SQLAlchemy

broker_url = 'redis://localhost:6379/0'

app = Flask(__name__)
celery = Celery(app.name, broker=broker_url)
 

app.config.from_object('config')

app.secret_key = "HELLOWORLD"

db = SQLAlchemy(app)


@app.errorhandler(404)
def not_found(err):
    return "NOT FOUND {}".format(request.url), 404

@app.route('/sites/<site>/<path:filename>')
def serve_website(site, filename):
    return send_from_directory('sites/{}'.format(site), filename)

from app.mod_auth.controller import mod_auth as auth_module
from app.mod_app.controller import mod_app as app_module

app.register_blueprint(app_module)
app.register_blueprint(auth_module)

db.create_all()