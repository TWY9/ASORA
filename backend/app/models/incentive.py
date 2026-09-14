"""
IncentiveLog — Tracks advisor hours for complementary credit.
"""
import uuid
from datetime import datetime, timezone
from app import db


class IncentiveLog(db.Model):
    __tablename__ = 'incentive_log'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    advisor_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, unique=True)
    hours_accumulated = db.Column(db.Float, default=0.0)
    credit_granted = db.Column(db.Boolean, default=False)
    credit_period = db.Column(db.String(20), nullable=True)  # "2026-1"
    last_updated = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                             onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'advisor_id': self.advisor_id,
            'hours_accumulated': self.hours_accumulated,
            'credit_granted': self.credit_granted,
            'credit_period': self.credit_period,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
        }
