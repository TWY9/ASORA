"""
User Model — Both advisors and advisees share this base model.
Authentication is by control_number (número de control).
"""
import uuid
from datetime import datetime, timezone
from app import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    control_number = db.Column(db.String(20), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(150), nullable=False)
    career = db.Column(db.String(100), nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    role = db.Column(db.String(20), nullable=False, default='asesorado')  # asesor | asesorado | both
    avatar_url = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    is_graduated = db.Column(db.Boolean, default=False)  # For graduated students who want to advise
    is_teacher = db.Column(db.Boolean, default=False)     # For teachers who want to collaborate
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    advisor_profiles = db.relationship('AdvisorProfile', backref='user', lazy='dynamic')
    sessions_as_advisee = db.relationship('AdvisorySession', backref='advisee',
                                          foreign_keys='AdvisorySession.advisee_id', lazy='dynamic')
    incentive_log = db.relationship('IncentiveLog', backref='advisor', uselist=False)

    def to_dict(self, include_private=False):
        data = {
            'id': self.id,
            'control_number': self.control_number,
            'full_name': self.full_name,
            'career': self.career,
            'semester': self.semester,
            'role': self.role,
            'avatar_url': self.avatar_url,
            'is_active': self.is_active,
            'is_graduated': self.is_graduated,
            'is_teacher': self.is_teacher,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        return data

    def __repr__(self):
        return f'<User {self.control_number} - {self.full_name}>'
