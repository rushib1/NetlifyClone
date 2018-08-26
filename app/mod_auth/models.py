from app import db
from sqlalchemy.orm import relationship

from app.mod_app.models import Site

class Base(db.Model):

    __abstract__  = True
    id            = db.Column(db.Integer, primary_key=True)
    date_created  = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

class User(Base):

    __tablename__  = 'auth_user'

    name = db.Column(db.String(128), nullable=True)
    email = db.Column(db.String(128), nullable=False, unique=True)
    password = db.Column(db.String(192), nullable=True)
    gitlab_oauth2 = db.Column(db.String(300), nullable=True)
    gitlab_data = db.Column(db.String(5000), nullable=True)
    children = relationship("Site", lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.name)