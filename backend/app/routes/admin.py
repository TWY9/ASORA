"""
Admin Routes — Manage users, verify advisors, etc.
"""
from functools import wraps
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.advisor_profile import AdvisorProfile
from app.models.subject import Subject

admin_bp = Blueprint('admin', __name__)


def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != 'admin':
            return jsonify({'error': 'Acceso denegado. Se requieren permisos de administrador.'}), 403
        return fn(*args, **kwargs)
    return wrapper


@admin_bp.route('/pending-advisors', methods=['GET'])
@admin_required
def get_pending_advisors():
    """Get all advisor profiles that are waiting for verification."""
    profiles = AdvisorProfile.query.filter_by(verified=False).all()
    return jsonify({'profiles': [p.to_dict() for p in profiles]}), 200


@admin_bp.route('/advisors/<advisor_id>/verify', methods=['PATCH'])
@admin_required
def verify_advisor(advisor_id):
    """Admin action: verify or reject an advisor profile."""
    data = request.get_json()
    action = data.get('action')  # 'approve' or 'reject'

    profile = AdvisorProfile.query.get(advisor_id)
    if not profile:
        return jsonify({'error': 'Perfil de asesor no encontrado'}), 404

    if action == 'approve':
        profile.verified = True
        db.session.commit()
        return jsonify({'message': 'Asesor verificado exitosamente', 'advisor_profile': profile.to_dict()}), 200
    elif action == 'reject':
        db.session.delete(profile)
        db.session.commit()
        return jsonify({'message': 'Solicitud de asesor rechazada y eliminada'}), 200
    else:
        return jsonify({'error': 'Acción inválida. Usa "approve" o "reject"'}), 400


@admin_bp.route('/users', methods=['GET'])
@admin_required
def list_users():
    """List all users."""
    users = User.query.all()
    return jsonify({'users': [u.to_dict() for u in users]}), 200
