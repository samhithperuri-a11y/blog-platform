from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import User, db   # ✅ db kuda import cheyyi

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify(message="username and password required"), 400

    existing = User.query.filter_by(username=username).first()
    if existing:
        return jsonify(message="User already exists"), 409

    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify(message="User registered successfully"), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()

    if user and user.password == data["password"]:
        token = create_access_token(identity=user.username)
        return jsonify(access_token=token)

    return jsonify(message="Invalid credentials"), 401
