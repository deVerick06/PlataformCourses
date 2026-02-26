from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Course, Video

video_bp = Blueprint('video', __name__)

@video_bp.route('/videos/add', methods=["POST"])
@jwt_required()
def add_video():
    data = request.json

    current_user = get_jwt_identity()
    user = db.session.get(User, current_user)
    if user.role != 'admin':
        return jsonify({'message': 'Without permission'}), 403

    if not 'title' in data or not 'url' in data or not 'course_id' in data:
        return jsonify({'message': 'Invalid data'}), 400
    
    course_exist = db.session.get(Course, data['course_id'])

    if not course_exist:
        return jsonify({'message': 'The course mentioned in this video does not exist.'}), 404
    
    if data['title'].strip() and data['url'].strip():
        video = Video(title=data['title'], resume=data.get('resume', ''), url=data['url'], course_id=data['course_id'])
        db.session.add(video)
        db.session.commit()
        return jsonify({'message': 'Video successfully added'}), 201
    return jsonify({'message': 'Invalid title or url'}), 400

@video_bp.route('/videos/<int:video_id>/update', methods=["PUT"])
@jwt_required()
def update_video(video_id):
    video = db.session.get(Video, video_id)

    current_user = get_jwt_identity()
    user = db.session.get(User, current_user)
    if user.role != 'admin':
        return jsonify({'message': 'Without permission'}), 403

    if not video:
        return jsonify({'message': 'Video not found'}), 404
    
    data = request.json

    if 'title' in data:
        if not data['title'].strip():
            return jsonify({'message': 'Title cannot be empty'}), 400
        
        video.title = data['title']
    
    if 'resume' in data:
        if not data['resume'].strip():
            return jsonify({'message': 'Resume cannot be empty'}), 400
        
        video.resume = data['resume']
    
    if 'url' in data:
        if not data['url'].strip():
            return jsonify({'message': 'Url cannot be empty'}), 400
        
        video.url = data['url']
    
    if 'course_id' in data:
        course = db.session.get(Course, data['course_id'])
        if not course:
            return jsonify({'message': 'Course not found'}), 404
        else:
            video.course_id = data['course_id']
    
    db.session.commit()
    return jsonify({'message': 'Video successfully updated'}), 200

@video_bp.route('/videos/<int:video_id>/delete', methods=["DELETE"])
@jwt_required()
def delete_video(video_id):
    video = db.session.get(Video, video_id)

    current_user = get_jwt_identity()
    user = db.session.get(User, current_user)
    if user.role != 'admin':
        return jsonify({'message': 'Without permission'}), 403

    if not video:
        return jsonify({'message': 'Video not found'}), 404
    
    db.session.delete(video)
    db.session.commit()
    return jsonify({'message': 'Video successfully deleted'}), 200