"""
Review — Post-session ratings and comments.
"""
import uuid
from datetime import datetime, timezone
from app import db


class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = db.Column(db.String(36), db.ForeignKey('advisory_sessions.id'), nullable=False, unique=True)
    reviewer_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    reviewed_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    reviewer = db.relationship('User', foreign_keys=[reviewer_id], backref='reviews_given')
    reviewed = db.relationship('User', foreign_keys=[reviewed_id], backref='reviews_received')

    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'reviewer_id': self.reviewer_id,
            'reviewer_name': self.reviewer.full_name if self.reviewer else None,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
