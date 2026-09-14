"""
Users Routes — Profile management.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User

users_bp = Blueprint('users', __name__)


@users_bp.route('/<user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Get a user's public profile."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    return jsonify({'user': user.to_dict()}), 200


@users_bp.route('/me', methods=['PATCH'])
@jwt_required()
def update_profile():
    """Update current user's profile."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    data = request.get_json()
    updatable_fields = ['full_name', 'career', 'semester', 'avatar_url']

    for field in updatable_fields:
        if field in data:
            setattr(user, field, data[field])

    db.session.commit()
    return jsonify({'user': user.to_dict(), 'message': 'Perfil actualizado'}), 200
