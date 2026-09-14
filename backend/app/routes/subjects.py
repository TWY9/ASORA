"""
Subjects Routes — List and filter academic subjects.
"""
from flask import Blueprint, request, jsonify
from app.models.subject import Subject

subjects_bp = Blueprint('subjects', __name__)


@subjects_bp.route('', methods=['GET'])
def list_subjects():
    """List subjects with optional filters: career, semester, category, search."""
    query = Subject.query

    # Filter by career
    career = request.args.get('career')
    if career:
        query = query.filter(Subject.career.ilike(f'%{career}%'))

    # Filter by semester
    semester = request.args.get('semester', type=int)
    if semester:
        query = query.filter_by(semester=semester)

    # Filter by category
    category = request.args.get('category')
    if category:
        query = query.filter(Subject.category.ilike(f'%{category}%'))

    # Search by name
    search = request.args.get('search')
    if search:
        query = query.filter(Subject.name.ilike(f'%{search}%'))

    subjects = query.order_by(Subject.semester, Subject.name).all()
    return jsonify({'subjects': [s.to_dict() for s in subjects]}), 200


@subjects_bp.route('/<subject_id>', methods=['GET'])
def get_subject(subject_id):
    """Get subject details including available advisors."""
    subject = Subject.query.get(subject_id)
    if not subject:
        return jsonify({'error': 'Materia no encontrada'}), 404

    # Include advisors for this subject
    advisors = [ap.to_dict() for ap in subject.advisor_profiles.filter_by(verified=True).all()]

    data = subject.to_dict()
    data['advisors'] = advisors
    return jsonify({'subject': data}), 200
