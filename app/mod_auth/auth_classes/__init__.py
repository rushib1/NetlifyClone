import requests
import json

from app import db
from app.mod_auth.models import User

GITLAB_APP_ID = ""
GITLAB_SECRET = ""

GITLAB_BASE_URL = "https://gitlab.com/api/v4/"

GITLAB_OUATH_ENDPOINT = "https://gitlab.com/oauth/token"
GITLAB_USER_DETAILS_ENDPOINT = ""

class Gitlab:

    def __init__(self, oauth2=None, data=None):
        self.oauth2 = oauth2
        self.data = json.loads(data) if data is not None else ""

    @staticmethod
    def gen_redirect_url():
        # url = "https://gitlab.com/oauth/authorize?client_id={}&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fauthorize%2Fdone&response_type=code".format(GITLAB_APP_ID)
        url = "https://gitlab.com/oauth/authorize?client_id={}&redirect_uri=http%3A%2F%2Fdoubleclick.net%2Fauth%2Fauthorize%2Fdone&response_type=code".format(GITLAB_APP_ID)
        return url

    def get_access_token(self, code):
        parameters = {
            "client_id": GITLAB_APP_ID,
            "client_secret": GITLAB_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": 'http://doubleclick.net/auth/authorize/done'
        }
        response = requests.post(GITLAB_OUATH_ENDPOINT, data=parameters).content
        response_json = json.loads(response.decode('utf-8'))
        self.oauth2 = response_json['access_token']
        return response

    def get_user_details(self):
        url = GITLAB_BASE_URL + "user?access_token={}".format(self.oauth2)
        response = (requests.get(url)).content
        response_json = json.loads(response.decode('utf-8'))
        return response_json

    def create_or_update_user(self, session):
        user_details = self.get_user_details()
        if (session.get('email', None) or User.query.filter_by(email=user_details['email']).count()):
            user = User.query.filter_by(email=session.get('email', user_details['email'])).first()
            user.gitlab_oauth2 = self.oauth2
            user.gitlab_data = json.dumps(user_details)
            session['email'] = user.email
            db.session.commit()
        else:
            new_user = User(email=user_details['email'], password=None, gitlab_oauth2=self.oauth2, gitlab_data=json.dumps(user_details))
            db.session.add(new_user)
            db.session.commit()
            session['email'] = new_user.email
        
    def get_repo_list(self):
        url = GITLAB_BASE_URL + "/users/{}/projects?access_token={}".format(self.data['username'], self.oauth2)
        response = (requests.get(url)).content
        response_json = json.loads(response.decode('utf-8'))
        return response