from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Category, User

category_bp = Blueprint('category', __name__)

@category_bp.route('/categories/add', methods=["POST"])
@jwt_required()
def add_category():
    data = request.json

    current_user = get_jwt_identity()
    user = db.session.get(User, current_user)
    if user.role != 'admin':
        return jsonify({'message': 'Without permission'}), 403

    if 'name' in data:
        if not data["name"].strip():
            return jsonify({'message': 'Name cannot be empty'}), 400
        
        query = db.select(Category).where(Category.name == data['name'])
        category_exist = db.session.execute(query).scalar()

        if category_exist:
            return jsonify({'message': 'Category already exist'}), 400
        
        category = Category(name=data['name'])
        db.session.add(category)
        db.session.commit()
        return jsonify({'message': 'Category created successfully'}), 201
    
    return jsonify({'message': 'Invalid data'}), 400

@category_bp.route('/categories', methods=["GET"])
def get_categories():
    categories = db.session.execute(db.select(Category)).scalars().all()

    categories_list = []

    for category in categories:
        category_content = {
            'id': category.id,
            'name': category.name
        }
        categories_list.append(category_content)
    return jsonify(categories_list), 200