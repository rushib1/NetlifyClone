from flask import Blueprint, request, render_template, flash, g, session, redirect, url_for

from app import db

from app.mod_auth.models import User

from app.mod_auth.auth_classes import Gitlab

import json

mod_auth = Blueprint('auth', __name__, url_prefix='/auth')

print(__name__)

def is_user():
    if (session.get('email', None)):
        if (User.query.filter_by(email=session.get('email')).count()):
            return True
    return False

def login_required(func):
    def authoriz(*args, **kwargs):
        if is_user():
            return func(*args, **kwargs)
        else:
            return redirect(url_for("auth.signin"))
    return authoriz

@mod_auth.route('/signin', methods=['GET', 'POST'])
def signin():
    if (request.method == 'POST'):
        if request.form.get('email', None) and request.form.get('password', None):
            new_user = User(email=request.form.get('email'), password=request.form.get('password'))
            db.session.add(new_user)
            db.session.commit()
            session['email'] = new_user.email
            return redirect("/auth/index")
        return "wrong details"
    else:
        if is_user():
            return redirect("/auth/index")
        return render_template('auth/signin.html')

@mod_auth.route('/signout')
def signout():
    session.pop('email')
    return redirect('auth/signin')

@mod_auth.route('/index', methods=['GET'])
@login_required
def index():
   user = User.query.filter_by(email=session.get('email')).first()
   gitlab = Gitlab(user.gitlab_oauth2, user.gitlab_data)
   username = gitlab.data['username']
   return render_template('/auth/redirect.html', oauth2=user.gitlab_oauth2, username=username)

@mod_auth.route('/authorize/', methods=['GET'])
def authorize():
    if (request.args.get('provider', 'github') == 'gitlab'):
        url = Gitlab.gen_redirect_url()
        return redirect(url)
    return 'done'

@mod_auth.route('/authorize/done', methods=['GET', 'POST'])
def auth_done():
    gitlab = Gitlab()
    gitlab.get_access_token(request.args.get('code'))
    gitlab.create_or_update_user(session)
    return redirect('auth/index')