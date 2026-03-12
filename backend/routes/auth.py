from extensions import db
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=["POST"])
def signup():
    data = request.json

    if data.get('username') and data.get('email') and data.get('password'):
        if not data['username'].strip() or not data['email'] or not data['password'].strip():
            return jsonify({'message': 'Invalid data'}), 400
        
        query = db.select(User).where(User.email == data.get('email'))
        user_exist = db.session.execute(query).scalar()

        if user_exist:
            return jsonify({'message': 'User already exist'}), 400
        
        hashed_password = generate_password_hash(data['password'])

        user = User(username=data['username'], email=data['email'], password=hashed_password)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User sucessfully created'}), 201
    return jsonify({'message': 'Invalid data'}), 400

@auth_bp.route('/login', methods=["POST"])
def login():
    data = request.json

    print("1. O React enviou isso:", data)

    if data.get('email') and data.get('password'):
        query = db.select(User).where(User.email == data['email'])
        user = db.session.execute(query).scalar()

        print("2. O Flask achou esse usuário no banco:", user)

        if not user:
            return jsonify({'message': 'Unauthorized'}), 401
        
        if check_password_hash(user.password, data.get('password')):
            access_token = create_access_token(identity=str(user.id))
            return jsonify({
                'message': 'Login successful!',
                'access_token': access_token,
                'role': user.role
            }), 200
        
    return jsonify({'message': 'Unauthorized'}), 401

@auth_bp.route('/users/teachers', methods=["GET"])
@jwt_required()
def get_teachers():
    teachers = db.session.execute(db.select(User).where(User.role == 'admin')).scalars().all()

    if not teachers:
        return jsonify({'message': 'Teachers not found'}), 404
    
    teacher_list = []
    for teacher in teachers:
        content_data = {
            'id': teacher.id,
            'username': teacher.username
        }
        teacher_list.append(content_data)
    return jsonify(teacher_list), 200