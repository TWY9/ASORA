"""
Auth Routes — Register and login by control number.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
import bcrypt
from app import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user with control number."""
    data = request.get_json()

    # Validate required fields
    required = ['control_number', 'password', 'full_name', 'career', 'semester']
    for field in required:
        if field not in data or not data[field]:
            return jsonify({'error': f'Campo requerido: {field}'}), 400

    control_number = data['control_number'].strip()

    # Validate control number format (8 digits for ITM)
    if not control_number.isdigit() or len(control_number) != 8:
        return jsonify({'error': 'El número de control debe tener 8 dígitos'}), 400

    # Check if already registered
    if User.query.filter_by(control_number=control_number).first():
        return jsonify({'error': 'Este número de control ya está registrado'}), 409

    # Hash password
    password_hash = bcrypt.hashpw(
        data['password'].encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')

    # Create user
    user = User(
        control_number=control_number,
        password_hash=password_hash,
        full_name=data['full_name'].strip(),
        career=data['career'].strip(),
        semester=int(data['semester']),
        role=data.get('role', 'asesorado'),
        is_graduated=data.get('is_graduated', False),
        is_teacher=data.get('is_teacher', False),
    )

    db.session.add(user)
    db.session.commit()

    # Generate tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        'message': 'Registro exitoso',
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token,
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login with control number and password."""
    data = request.get_json()

    control_number = data.get('control_number', '').strip()
    password = data.get('password', '')

    if not control_number or not password:
        return jsonify({'error': 'Número de control y contraseña son requeridos'}), 400

    user = User.query.filter_by(control_number=control_number).first()

    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
        return jsonify({'error': 'Credenciales inválidas'}), 401

    if not user.is_active:
        return jsonify({'error': 'Cuenta desactivada. Contacta al administrador.'}), 403

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token,
    }), 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Get a new access token using refresh token."""
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify({'access_token': access_token}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    """Get the current authenticated user's profile."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    return jsonify({'user': user.to_dict()}), 200
