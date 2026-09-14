"""
ASORA — Flask Application Factory
"""
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from .config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


import os

def create_app(config_class=Config):
    app = Flask(__name__, static_folder='../uploads', static_url_path='/uploads')
    app.config.from_object(config_class)

    # Ensure upload directory exists
    os.makedirs(app.config.get('UPLOAD_FOLDER', 'uploads'), exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, origins=app.config.get('CORS_ORIGINS', ['http://localhost:5173']),
         supports_credentials=True)

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.users import users_bp
    from .routes.subjects import subjects_bp
    from .routes.advisors import advisors_bp
    from .routes.sessions import sessions_bp
    from .routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(subjects_bp, url_prefix='/api/subjects')
    app.register_blueprint(advisors_bp, url_prefix='/api/advisors')
    app.register_blueprint(sessions_bp, url_prefix='/api/sessions')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # Health check
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'app': 'ASORA API'}

    return app
