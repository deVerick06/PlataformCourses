from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from dotenv import load_dotenv
import os
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ['SECRET_KEY']

db = SQLAlchemy(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    role = db.Column(db.String(5), default='aluno')

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True)
    courses = db.relationship('Course', backref='category')

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    teacher = db.relationship('User', backref='created_courses')
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    videos = db.relationship('Video', backref='course', cascade='all, delete-orphan')

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    resume = db.Column(db.Text, nullable=True)
    url = db.Column(db.Text, nullable=False, unique=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)

# TODO: Hash Password

# Auth
@app.route('/signup', methods=["POST"])
def signup():
    data = request.json

    if data.get('username') and data.get('email') and data.get('password') and data.get('role', 'aluno'):
        query = db.select(User).where(User.email == data.get('email'))
        user_exist = db.session.execute(query).scalar()

        if user_exist:
            return jsonify({'message': 'User already exist'}), 400

        user = User(username=data['username'], email=data['email'], password=data['password'], role=data['role'])
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User sucessfully created'}), 201
    return jsonify({'message': 'Invalid data'}), 400

@app.route('/login', methods=["POST"])
def login():
    data = request.json

    if data.get('email') and data.get('password'):
        query = db.select(User).where(User.email == data['email'])
        user = db.session.execute(query).scalar()

        if not user:
            return jsonify({'message': 'Unauthorized'}), 401
        
        if data.get('password') == user.password:
            access_token = create_access_token(identity=str(user.id))
            return jsonify({
                'message': 'Login successful!',
                'access_token': access_token
            }), 200
        
    return jsonify({'message': 'Unauthorized'}), 401

# Category
@app.route('/categories/add', methods=["POST"])
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

@app.route('/categories', methods=["GET"])
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

# Course
@app.route('/courses/add', methods=["POST"])
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

@app.route('/courses', methods=["GET"])
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

@app.route('/courses/<int:course_id>', methods=["GET"])
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

@app.route('/courses/<int:course_id>/update', methods=["PUT"])
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

@app.route('/courses/<int:course_id>/delete', methods=["DELETE"])
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

# Video
@app.route('/videos/add', methods=["POST"])
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

@app.route('/videos/<int:video_id>/update', methods=["PUT"])
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

@app.route('/videos/<int:video_id>/delete', methods=["DELETE"])
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

@app.route('/')
def initial():
    print('Welcome the Dev Pereira Courses')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)