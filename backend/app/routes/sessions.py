"""
Sessions Routes — Schedule, manage, and review tutoring sessions.
"""
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.session import AdvisorySession
from app.models.advisor_profile import AdvisorProfile
from app.models.review import Review
from app.models.incentive import IncentiveLog

sessions_bp = Blueprint('sessions', __name__)


@sessions_bp.route('', methods=['POST'])
@jwt_required()
def create_session():
    """Schedule a new tutoring session."""
    user_id = get_jwt_identity()
    data = request.get_json()

    required = ['advisor_profile_id', 'scheduled_at']
    for field in required:
        if field not in data:
            return jsonify({'error': f'Campo requerido: {field}'}), 400

    advisor_profile = AdvisorProfile.query.get(data['advisor_profile_id'])
    if not advisor_profile:
        return jsonify({'error': 'Perfil de asesor no encontrado'}), 404

    if advisor_profile.user_id == user_id:
        return jsonify({'error': 'No puedes agendar una asesoría contigo mismo'}), 400

    session = AdvisorySession(
        advisor_profile_id=data['advisor_profile_id'],
        advisee_id=user_id,
        subject_id=advisor_profile.subject_id,
        modality=data.get('modality', advisor_profile.modality),
        location=data.get('location'),
        meeting_link=data.get('meeting_link'),
        scheduled_at=datetime.fromisoformat(data['scheduled_at']),
        duration_minutes=data.get('duration_minutes', 60),
        notes=data.get('notes'),
        status='pending',
    )

    db.session.add(session)
    db.session.commit()

    return jsonify({
        'message': 'Asesoría agendada. Esperando confirmación del asesor.',
        'session': session.to_dict()
    }), 201


@sessions_bp.route('', methods=['GET'])
@jwt_required()
def list_sessions():
    """Get sessions for current user (as advisor or advisee)."""
    user_id = get_jwt_identity()
    role_filter = request.args.get('role', 'all')  # advisor | advisee | all
    status_filter = request.args.get('status')      # pending | confirmed | completed | cancelled

    # Sessions as advisee
    advisee_query = AdvisorySession.query.filter_by(advisee_id=user_id)

    # Sessions as advisor (through advisor profiles)
    advisor_profiles = AdvisorProfile.query.filter_by(user_id=user_id).all()
    profile_ids = [p.id for p in advisor_profiles]
    advisor_query = AdvisorySession.query.filter(
        AdvisorySession.advisor_profile_id.in_(profile_ids)
    ) if profile_ids else AdvisorySession.query.filter(False)

    if role_filter == 'advisee':
        query = advisee_query
    elif role_filter == 'advisor':
        query = advisor_query
    else:
        query = advisee_query.union(advisor_query)

    if status_filter:
        # Apply status filter — need to use subquery for union
        sessions = [s for s in query.all() if s.status == status_filter]
    else:
        sessions = query.order_by(AdvisorySession.scheduled_at.desc()).all()

    return jsonify({'sessions': [s.to_dict() for s in sessions]}), 200


@sessions_bp.route('/<session_id>', methods=['PATCH'])
@jwt_required()
def update_session(session_id):
    """Update session status (confirm, complete, cancel)."""
    user_id = get_jwt_identity()
    data = request.get_json()
    session = AdvisorySession.query.get(session_id)

    if not session:
        return jsonify({'error': 'Sesión no encontrada'}), 404

    new_status = data.get('status')
    valid_transitions = {
        'pending': ['confirmed', 'cancelled'],
        'confirmed': ['completed', 'cancelled'],
    }

    if session.status not in valid_transitions:
        return jsonify({'error': 'Esta sesión no se puede modificar'}), 400

    if new_status not in valid_transitions.get(session.status, []):
        return jsonify({'error': f'Transición inválida: {session.status} → {new_status}'}), 400

    session.status = new_status

    # If completed, update advisor hours
    if new_status == 'completed':
        advisor_profile = session.advisor_profile
        hours = session.duration_minutes / 60.0
        advisor_profile.total_hours += hours

        # Update incentive log
        incentive = IncentiveLog.query.filter_by(advisor_id=advisor_profile.user_id).first()
        if not incentive:
            incentive = IncentiveLog(advisor_id=advisor_profile.user_id)
            db.session.add(incentive)
        incentive.hours_accumulated += hours

    if 'notes' in data:
        session.notes = data['notes']

    db.session.commit()

    return jsonify({
        'message': f'Sesión actualizada a: {new_status}',
        'session': session.to_dict()
    }), 200


@sessions_bp.route('/<session_id>/review', methods=['POST'])
@jwt_required()
def review_session(session_id):
    """Leave a review for a completed session."""
    user_id = get_jwt_identity()
    data = request.get_json()
    session = AdvisorySession.query.get(session_id)

    if not session:
        return jsonify({'error': 'Sesión no encontrada'}), 404

    if session.status != 'completed':
        return jsonify({'error': 'Solo se pueden reseñar sesiones completadas'}), 400

    if session.advisee_id != user_id:
        return jsonify({'error': 'Solo el asesorado puede dejar reseña'}), 403

    if session.review:
        return jsonify({'error': 'Esta sesión ya tiene reseña'}), 409

    rating = data.get('rating')
    if not rating or not (1 <= rating <= 5):
        return jsonify({'error': 'Rating debe ser entre 1 y 5'}), 400

    review = Review(
        session_id=session_id,
        reviewer_id=user_id,
        reviewed_id=session.advisor_profile.user_id,
        rating=rating,
        comment=data.get('comment', ''),
    )

    db.session.add(review)

    # Update advisor average rating
    advisor_profile = session.advisor_profile
    advisor_profile.total_reviews += 1
    # Recalculate average
    all_reviews = Review.query.join(AdvisorySession).filter(
        AdvisorySession.advisor_profile_id == advisor_profile.id
    ).all()
    if all_reviews:
        advisor_profile.avg_rating = sum(r.rating for r in all_reviews) / len(all_reviews)

    db.session.commit()

    return jsonify({
        'message': 'Reseña enviada',
        'review': review.to_dict()
    }), 201
