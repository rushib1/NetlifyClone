from flask import Blueprint, request, render_template, g, session, redirect, url_for, send_from_directory
import io
import uuid
import pyrebase
import time

from app import db
from app import celery
import json

from app.mod_auth.models import User
from app.mod_app.models import Site

from Cryptodome.PublicKey import RSA
from subprocess import Popen, PIPE, STDOUT

mod_app = Blueprint('app', __name__, url_prefix='/app')

config = {
  "apiKey": "AIzaSyB8Tya7fhntcD9JPjd3xDjfcAwYmDyKE7w",
  "authDomain": "netlifyclone-2286a.firebaseapp.com",
  "databaseURL": "https://netlifyclone-2286a.firebaseio.com",
  "storageBucket": "netlifyclone-2286a.appspot.com"
}

firebase = pyrebase.initialize_app(config)

@mod_app.before_request
def before_request():
    if 'email' not in session or User.query.filter_by(email=session.get('email', None)).count() == 0:
        return "201"
    # print(User.query.filter_by(email=session.get('email', None)).count())

@mod_app.route('/api/deploy_key', methods=['GET', 'POST'])
def site_new():
    if request.method == 'GET':
        key = RSA.generate(4096)
        user = User.query.filter_by(email=session.get('email', None)).first()
        private_key = key.exportKey('PEM').decode('utf-8')
        public_key = key.publickey().exportKey('OpenSSH').decode('utf-8')
        site = Site(user_id=user.id, deploy_key_private=private_key, deploy_key_public=public_key)
        db.session.add(site)
        print(private_key)
        db.session.commit()
        deploy_info = {
            'public_key': site.deploy_key_public,
            'siteid': site.id
        }
        print("chlorine")
        return json.dumps(deploy_info), 200
    if request.method == 'POST':
        git_site = request.form.get('provider')
        git_repo = request.form.get('repoid')
        git_repo_name = request.form.get('repo_name')
        ssh_url_to_repo = request.form.get('ssh_url_to_repo')
        build_command = request.form.get('build_command')
        serve_directory = request.form.get('work_dir')
        id = request.form.get('siteid')
        git_repo_branch = request.form.get('branch')
        siteo = Site.query.filter_by(id=id).first()
        siteo.status = 0
        siteo.git_repo = git_repo
        siteo.git_site = git_site
        siteo.git_repo_branch = git_repo_branch
        siteo.git_repo_name = git_repo_name
        siteo.build_command = build_command
        siteo.ssh_url_repo = ssh_url_to_repo
        siteo.serve_directory = serve_directory
        siteo.tmp_name = siteo.tmp_name if siteo.tmp_name else uuid.uuid4().hex[:6].upper()
        siteo.sites_directory = siteo.sites_directory if siteo.sites_directory else uuid.uuid4().hex[:6].upper()
        db.session.commit()
        build_task.delay(siteo.id)
        return "hello"

@mod_app.route('/<path:dummy>', methods=['GET', 'POST'])
def index(dummy):
    return render_template('app/index.html')

def access_user(func):
    def user(*args, **kwargs):
        kwargs['user'] = User.query.filter_by(email=session.get('email')).first()
        return func(*args, **kwargs)
    user.__name__ = func.__name__
    return user

@mod_app.route('/gill/<int:id>')
def delt(id):
    siteo = db.session.query(Site).filter_by(id=id).first()
    print(siteo.tmp_name)
    build_task.delay(id)
    return "{}".format(id), 404

@celery.task(bind=True)
def build_task(self, site_id):
    site = Site.query.filter_by(id=site_id).first()
    print(site.tmp_name)
    params = {
        'git_url': site.ssh_url_repo,
        'ssh_key': site.deploy_key_private,
        'tmp_dir': site.tmp_name,
        'sites_dir': site.sites_directory,
        'build_command': site.build_command,
        'serve_directory': site.serve_directory
    }
    datab = firebase.database()
    command = "{git_url} {ssh_key} {tmp_dir} {sites_dir} {build_command}".format(**params)

    proc = Popen(["bash", "run.sh",  params['git_url'], params['ssh_key'], params['tmp_dir'], params['sites_dir'], params['build_command'], params['serve_directory']], stdout=PIPE, stderr=STDOUT)
    leng = 0
    for line in proc.stdout:
        if (line.strip() != '' and len(line) < 100):
            try:
                datab.child('site/{}/{}'.format(site.sites_directory, leng)).set([
                    int(time.time()), line.decode('ascii')
                ])
                leng = leng + 1
            except:
                pass
            print(line)

    print('rdasdasd', proc.returncode)

    


@mod_app.route('api/all_sites')
@access_user
def list_sites(user):
    sites_list = [{
        'id': i.id,
        'repo': i.git_repo_name,
        'provider': i.git_site, 
        'branch': i.git_repo_branch, 
        'owned': session['email'],
        'last_updated': i.date_modified
    } for i in user.children.filter_by(status=0).all()]
    return json.dumps(sites_list)

@mod_app.route('/api/site_info/<int:id>')
@access_user
def site_info(user, id):
    site = Site.query.filter_by(user_id=user.id, id=id).first()
    if (not site):
        return 'failure', 403
    else:
        site_info = {
            "url": '{}.doubleclick.net'.format(site.sites_directory),
            "site": site.sites_directory,
            "id": site.id,
            "build_command": site.build_command,
            "provider": site.git_site,
            "repo_name": site.git_repo_name,
            "repo_branch": site.git_repo_branch,
        }
        return json.dumps(site_info)