"""
Advisors Routes — Search, apply to be advisor, verify.
"""
import os
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.advisor_profile import AdvisorProfile
from app.models.subject import Subject

advisors_bp = Blueprint('advisors', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@advisors_bp.route('', methods=['GET'])
def search_advisors():
    """
    Search advisors with filters:
    - subject_id: filter by subject
    - search: text search on user name or subject name
    - modality: presencial | online
    - min_rating: minimum avg_rating
    - day: filter by day availability (lunes, martes, etc.)
    """
    query = AdvisorProfile.query.filter_by(verified=True)

    subject_id = request.args.get('subject_id')
    if subject_id:
        query = query.filter_by(subject_id=subject_id)

    modality = request.args.get('modality')
    if modality:
        query = query.filter(
            (AdvisorProfile.modality == modality) | (AdvisorProfile.modality == 'ambos')
        )

    min_rating = request.args.get('min_rating', type=float)
    if min_rating:
        query = query.filter(AdvisorProfile.avg_rating >= min_rating)

    # Text search on user name or subject name
    search = request.args.get('search')
    if search:
        query = query.join(User).join(Subject).filter(
            db.or_(
                User.full_name.ilike(f'%{search}%'),
                Subject.name.ilike(f'%{search}%')
            )
        )

    advisors = query.order_by(AdvisorProfile.avg_rating.desc()).all()
    return jsonify({'advisors': [a.to_dict() for a in advisors]}), 200


@advisors_bp.route('/<advisor_id>', methods=['GET'])
def get_advisor(advisor_id):
    """Get detailed advisor profile."""
    advisor = AdvisorProfile.query.get(advisor_id)
    if not advisor:
        return jsonify({'error': 'Asesor no encontrado'}), 404
    return jsonify({'advisor': advisor.to_dict()}), 200


@advisors_bp.route('/apply', methods=['POST'])
@jwt_required()
def apply_as_advisor():
    """
    Apply to become an advisor for a specific subject.
    Accepts multipart/form-data for file upload.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    subject_id = request.form.get('subject_id')
    modality = request.form.get('modality', 'presencial')
    schedule_availability = request.form.get('schedule_availability')

    if not subject_id:
        return jsonify({'error': 'subject_id es requerido'}), 400

    subject = Subject.query.get(subject_id)
    if not subject:
        return jsonify({'error': 'Materia no encontrada'}), 404

    existing = AdvisorProfile.query.filter_by(user_id=user_id, subject_id=subject_id).first()
    if existing:
        return jsonify({'error': 'Ya tienes un perfil de asesor para esta materia'}), 409

    # Handle file upload
    filename = None
    if 'kardex' in request.files:
        file = request.files['kardex']
        if file and file.filename != '' and allowed_file(file.filename):
            filename = secure_filename(f"{user.control_number}_{subject.code}_{file.filename}")
            upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            file.save(upload_path)

    profile = AdvisorProfile(
        user_id=user_id,
        subject_id=subject_id,
        modality=modality,
        schedule_availability=schedule_availability,
        recommendation_doc=filename,
        verified=False,  # Needs admin verification
    )

    if user.role == 'asesorado':
        user.role = 'both'

    db.session.add(profile)
    db.session.commit()

    return jsonify({
        'message': 'Solicitud de asesor enviada. Pendiente de verificación.',
        'advisor_profile': profile.to_dict()
    }), 201


@advisors_bp.route('/my-profiles', methods=['GET'])
@jwt_required()
def my_advisor_profiles():
    """Get all advisor profiles for the current user."""
    user_id = get_jwt_identity()
    profiles = AdvisorProfile.query.filter_by(user_id=user_id).all()
    return jsonify({'profiles': [p.to_dict() for p in profiles]}), 200
