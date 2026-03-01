from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Category, User, Course

course_bp = Blueprint('course', __name__)

@course_bp.route('/courses/add', methods=["POST"])
@jwt_required()
def add_course():
    data = request.json

    current_user = get_jwt_identity()
    user = db.session.get(User, current_user)
    if user.role != 'admin':
        return jsonify({'message': 'Without permission'}), 403

    if not 'title' in data or not 'teacher_id' in data or not 'category_id' in data:
        return jsonify({'message': 'Invalid data'}), 400
    
    queryTeacher = db.select(User).where(User.id == data['teacher_id'])
    queryCategory = db.select(Category).where(Category.id == data['category_id'])
    teacher_exist = db.session.execute(queryTeacher).scalar()
    category_exist = db.session.execute(queryCategory).scalar()

    if not teacher_exist:
        return jsonify({'message': 'Teacher not found'}), 404
    
    if not category_exist:
        return jsonify({'message': 'Category not found'}), 404
    
    if data['title'].strip():
        course = Course(title=data['title'], description=data.get('description', ''), teacher_id=data['teacher_id'], category_id=data['category_id'])
        db.session.add(course)
        db.session.commit()
        return jsonify({'message': 'Course successfully added'}), 201
    return jsonify({'message': 'Invalid title'}), 400

@course_bp.route('/courses', methods=["GET"])
def get_courses():
    courses = db.session.execute(db.select(Course)).scalars().all()

    courses_list = []

    for course in courses:
        course_content = {
            'id': course.id,
            'title': course.title,
            'category': course.category.name
        }
        courses_list.append(course_content)
    return jsonify(courses_list), 200

@course_bp.route('/courses/<int:course_id>', methods=["GET"])
@jwt_required()
def get_details_course(course_id):
    course = db.session.get(Course, course_id)

    if not course:
        return jsonify({'message': 'Course not found'}), 404
    
    list_videos = []
    for video in course.videos:
        list_videos.append({
            'title': video.title,
            'url': video.url,
            'resume': video.resume
        })
    
    return jsonify({
        'id': course.id,
        'title': course.title,
        'description': course.description,
        'videos': list_videos,
        'teacher': course.teacher.username,
        'category': course.category.name
    }), 200

@course_bp.route('/courses/<int:course_id>/update', methods=["PUT"])
@jwt_required()
def update_course(course_id):
    course = db.session.get(Course, course_id)

    current_user = get_jwt_identity()
    user = db.session.get(User, current_user)
    if user.role != 'admin':
        return jsonify({'message': 'Without permission'}), 403

    if not course:
        return jsonify({'message': 'Course not found'}), 404
    
    data = request.json

    if 'title' in data:
        if not data['title'].strip():
            return jsonify({'message': 'Title cannot be empty'}), 400
        
        course.title = data['title']
    
    if 'description' in data:
        if not data['description'].strip():
            return jsonify({'message': 'Description cannot be empty'}), 400
        
        course.description = data['description']
    
    if 'teacher_id' in data:
        teacher = db.session.get(User, data['teacher_id'])
        if not teacher:
            return jsonify({'message': 'Teacher not found'}), 404
        else:
            course.teacher_id = data['teacher_id']
    
    if 'category_id' in data:
        category = db.session.get(Category, data['category_id'])
        if not category:
            return jsonify({'message': 'Category not found'}), 404
        else:
            course.category_id = data['category_id']
    
    db.session.commit()
    return jsonify({'message': 'Course successfully updated.'}), 200

@course_bp.route('/courses/<int:course_id>/delete', methods=["DELETE"])
@jwt_required()
def delete_course(course_id):
    course = db.session.get(Course, course_id)

    current_user = get_jwt_identity()
    user = db.session.get(User, current_user)
    if user.role != 'admin':
        return jsonify({'message': 'Without permission'}), 403

    if not course:
        return jsonify({'message': 'Course not found'}), 404
    
    db.session.delete(course)
    db.session.commit()
    return jsonify({'message': 'Course successfully deleted'}), 200