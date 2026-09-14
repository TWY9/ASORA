"""
GroupSession — Group tutoring sessions with capacity limits.
"""
import uuid
from datetime import datetime, timezone
from app import db


class GroupSession(db.Model):
    __tablename__ = 'group_sessions'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    advisor_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    subject_id = db.Column(db.String(36), db.ForeignKey('subjects.id'), nullable=False)
    topic_name = db.Column(db.String(150), nullable=False)
    max_participants = db.Column(db.Integer, default=10)
    modality = db.Column(db.String(20), default='presencial')
    location = db.Column(db.String(200), nullable=True)
    meeting_link = db.Column(db.String(255), nullable=True)
    # Schedule as JSON matching the prototype format
    schedule = db.Column(db.JSON, nullable=True)
    month_label = db.Column(db.String(50), nullable=True)  # "Abril — 2025"
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    advisor = db.relationship('User', backref='group_sessions_created')
    subject = db.relationship('Subject', backref='group_sessions')
    participants = db.relationship('GroupParticipant', backref='group_session', lazy='dynamic')

    @property
    def participant_count(self):
        return self.participants.count()

    def to_dict(self):
        return {
            'id': self.id,
            'advisor_id': self.advisor_id,
            'advisor': self.advisor.to_dict() if self.advisor else None,
            'subject_id': self.subject_id,
            'subject': self.subject.to_dict() if self.subject else None,
            'topic_name': self.topic_name,
            'max_participants': self.max_participants,
            'participant_count': self.participant_count,
            'modality': self.modality,
            'location': self.location,
            'meeting_link': self.meeting_link,
            'schedule': self.schedule,
            'month_label': self.month_label,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class GroupParticipant(db.Model):
    __tablename__ = 'group_participants'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    group_session_id = db.Column(db.String(36), db.ForeignKey('group_sessions.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    joined_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (db.UniqueConstraint('group_session_id', 'user_id', name='uq_group_user'),)

    user = db.relationship('User', backref='group_participations')
