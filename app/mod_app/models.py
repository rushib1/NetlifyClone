from app import db

class Base(db.Model):

    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.Integer, default=db.func.current_timestamp())
    date_modified = db.Column(db.Integer, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

class Site(Base):

    __tablename__ = 'sites_table'

    status = db.Column(db.Integer, default=-1)
    user_id = db.Column(db.Integer, db.ForeignKey('auth_user.id'))
    git_site = db.Column(db.String(64), nullable=True)
    git_repo_branch = db.Column(db.String(64), nullable=True)
    git_repo = db.Column(db.String(64), nullable=True)
    git_repo_name = db.Column(db.String(64), nullable=True)
    deploy_key_public = db.Column(db.String(4096), nullable=True)
    firebase_key = db.Column(db.String(1024), nullable=True)

    ssh_url_repo = db.Column(db.String(256), nullable=True)
    deploy_key_private = db.Column(db.String(4096), nullable=True)
    tmp_name = db.Column(db.String(128), nullable=True)
    build_command = db.Column(db.String(1024), nullable=True)
    sites_directory = db.Column(db.String(1024), nullable=True)
    serve_directory = db.Column(db.String(256), nullable=True)