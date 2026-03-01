from flask import Flask
from dotenv import load_dotenv
import os
from extensions import db, migrate, jwt
from flask_cors import CORS
from routes.auth import auth_bp
from routes.category import category_bp
from routes.course import course_bp
from routes.video import video_bp

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ['SECRET_KEY']

db.init_app(app)
migrate.init_app(app, db)
jwt.init_app(app)

app.register_blueprint(auth_bp)
app.register_blueprint(course_bp)
app.register_blueprint(category_bp)
app.register_blueprint(video_bp)

@app.route('/')
def initial():
    return 'Welcome to the Dev Pereira Courses'

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)