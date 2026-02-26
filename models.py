from extensions import db
from datetime import datetime

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