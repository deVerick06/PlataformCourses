from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=["POST"])
def signup():
    data = request.json

    if data.get('username') and data.get('email') and data.get('password') and data.get('role', 'aluno'):
        query = db.select(User).where(User.email == data.get('email'))
        user_exist = db.session.execute(query).scalar()

        if user_exist:
            return jsonify({'message': 'User already exist'}), 400
        
        hashed_password = generate_password_hash(data['password'])

        user = User(username=data['username'], email=data['email'], password=hashed_password, role=data['role'])
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User sucessfully created'}), 201
    return jsonify({'message': 'Invalid data'}), 400

@auth_bp.route('/login', methods=["POST"])
def login():
    data = request.json

    if data.get('email') and data.get('password'):
        query = db.select(User).where(User.email == data['email'])
        user = db.session.execute(query).scalar()

        if not user:
            return jsonify({'message': 'Unauthorized'}), 401
        
        if check_password_hash(user.password, data.get('password')):
            access_token = create_access_token(identity=str(user.id))
            return jsonify({
                'message': 'Login successful!',
                'access_token': access_token
            }), 200
        
    return jsonify({'message': 'Unauthorized'}), 401