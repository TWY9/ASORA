"""
AdvisorySession — Individual tutoring sessions between advisor and advisee.
Tracks the full lifecycle: pending → confirmed → completed/cancelled.
"""
import uuid
from datetime import datetime, timezone
from app import db


class AdvisorySession(db.Model):
    __tablename__ = 'advisory_sessions'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    advisor_profile_id = db.Column(db.String(36), db.ForeignKey('advisor_profiles.id'), nullable=False)
    advisee_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    subject_id = db.Column(db.String(36), db.ForeignKey('subjects.id'), nullable=False)
    session_type = db.Column(db.String(20), default='individual')  # individual | grupal
    modality = db.Column(db.String(20), default='presencial')       # presencial | online
    location = db.Column(db.String(200), nullable=True)
    meeting_link = db.Column(db.String(255), nullable=True)
    scheduled_at = db.Column(db.DateTime, nullable=False)
    duration_minutes = db.Column(db.Integer, default=60)
    status = db.Column(db.String(20), default='pending')  # pending | confirmed | completed | cancelled
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    subject = db.relationship('Subject', backref='sessions')
    review = db.relationship('Review', backref='session', uselist=False)

    def to_dict(self):
        return {
            'id': self.id,
            'advisor_profile_id': self.advisor_profile_id,
            'advisor': self.advisor_profile.to_dict() if self.advisor_profile else None,
            'advisee_id': self.advisee_id,
            'advisee': self.advisee.to_dict() if self.advisee else None,
            'subject_id': self.subject_id,
            'subject': self.subject.to_dict() if self.subject else None,
            'session_type': self.session_type,
            'modality': self.modality,
            'location': self.location,
            'meeting_link': self.meeting_link,
            'scheduled_at': self.scheduled_at.isoformat() if self.scheduled_at else None,
            'duration_minutes': self.duration_minutes,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<AdvisorySession {self.id} [{self.status}]>'
