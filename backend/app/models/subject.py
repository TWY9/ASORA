"""
Subject Model — Academic subjects from the retícula.
Supports multiple careers with prerequisite chains.
"""
import uuid
from app import db


class Subject(db.Model):
    __tablename__ = 'subjects'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(150), nullable=False)
    code = db.Column(db.String(20), nullable=True)        # Subject code from retícula
    semester = db.Column(db.Integer, nullable=True)         # Recommended semester
    career = db.Column(db.String(100), nullable=False)      # Career this subject belongs to
    category = db.Column(db.String(50), nullable=True)      # ciencias básicas, programación, etc.
    prerequisite_id = db.Column(db.String(36), db.ForeignKey('subjects.id'), nullable=True)

    # Relationships
    prerequisite = db.relationship('Subject', remote_side=[id], backref='unlocks')
    advisor_profiles = db.relationship('AdvisorProfile', backref='subject', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'semester': self.semester,
            'career': self.career,
            'category': self.category,
            'prerequisite_id': self.prerequisite_id,
        }

    def __repr__(self):
        return f'<Subject {self.name} ({self.career})>'
