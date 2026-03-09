from flask import Flask
from dotenv import load_dotenv
import os
from flask_cors import CORS
from extensions import db, jwt, migrate
from models import Video

from routes.auth import auth_bp
from routes.category import category_bp
from routes.course import course_bp
from routes.video import video_bp

load_dotenv()

app = Flask(__name__)

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///plataform.db'
app.config['JWT_SECRET_KEY'] = os.environ['SECRET_KEY_JWT']

db.init_app(app)
jwt.init_app(app)
migrate.init_app(app, db)

app.register_blueprint(auth_bp)
app.register_blueprint(category_bp)
app.register_blueprint(course_bp)
app.register_blueprint(video_bp)

@app.route('/')
def initial():
    print('Welcome the Dev Pereira Courses')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)