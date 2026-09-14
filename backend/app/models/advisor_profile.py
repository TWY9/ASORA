"""
AdvisorProfile — Links a user to a subject they can advise on.
Includes verification status, schedule, and rating aggregates.
"""
import uuid
from datetime import datetime, timezone
from app import db


class AdvisorProfile(db.Model):
    __tablename__ = 'advisor_profiles'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    subject_id = db.Column(db.String(36), db.ForeignKey('subjects.id'), nullable=False)
    recommendation_doc = db.Column(db.String(255), nullable=True)  # Path to recommendation file
    avg_rating = db.Column(db.Float, default=0.0)
    total_reviews = db.Column(db.Integer, default=0)
    total_hours = db.Column(db.Float, default=0.0)
    verified = db.Column(db.Boolean, default=False)
    modality = db.Column(db.String(20), default='presencial')  # presencial | online | ambos
    # Schedule as JSON: {"lunes": ["8:00-9:00", "10:00-11:00"], "martes": [...]}
    schedule_availability = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Unique constraint: one profile per user per subject
    __table_args__ = (db.UniqueConstraint('user_id', 'subject_id', name='uq_advisor_subject'),)

    # Relationships
    sessions = db.relationship('AdvisorySession', backref='advisor_profile', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'subject_id': self.subject_id,
            'user': self.user.to_dict() if self.user else None,
            'subject': self.subject.to_dict() if self.subject else None,
            'avg_rating': round(self.avg_rating, 1),
            'total_reviews': self.total_reviews,
            'total_hours': self.total_hours,
            'verified': self.verified,
            'modality': self.modality,
            'schedule_availability': self.schedule_availability,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<AdvisorProfile {self.user_id} → {self.subject_id}>'
