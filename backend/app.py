import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)
USERS_FILE = os.path.join(BASE_DIR, "users.json")
POSTS_FILE = os.path.join(BASE_DIR, "posts.json")


# ----------------------------
# JSON helpers
# ----------------------------
def ensure_file(path, default_value):
    if not os.path.exists(path):
        with open(path, "w", encoding="utf-8") as f:
            json.dump(default_value, f, indent=2)


def read_json(path, default_value):
    ensure_file(path, default_value)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


# ----------------------------
# Auth helpers (simple token)
# token = username
# header: Authorization: Bearer <token>
# ----------------------------
def get_bearer_token():
    auth = request.headers.get("Authorization", "")
    parts = auth.split(" ")
    if len(parts) != 2:
        return None
    if parts[0].lower() != "bearer":
        return None
    return parts[1].strip()


def require_auth_username():
    token = get_bearer_token()
    if not token:
        return None

    users = read_json(USERS_FILE, [])
    if any(u.get("username") == token for u in users):
        return token
    return None


# ----------------------------
# Base route
# ----------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask backend running", "status": "ok"}), 200


# ----------------------------
# Register: {username, password}
# ----------------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()

    if not username or not password:
        return jsonify({"error": "username and password required"}), 400

    users = read_json(USERS_FILE, [])

    if any(u.get("username") == username for u in users):
        return jsonify({"error": "User already exists"}), 409

    users.append({"username": username, "password": password})
    write_json(USERS_FILE, users)

    return jsonify({"message": "Registered successfully"}), 201


# ----------------------------
# Login: {username, password}
# ----------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()

    if not username or not password:
        return jsonify({"error": "username and password required"}), 400

    users = read_json(USERS_FILE, [])
    user = next((u for u in users if u.get("username") == username), None)

    if user is None:
        return jsonify({"error": "User does not exist"}), 404

    if user.get("password") != password:
        return jsonify({"error": "Invalid credentials"}), 401

    # token = username (simple learning token)
    return jsonify({"message": "Login success", "token": username}), 200


# ----------------------------
# Protected test
# ----------------------------
@app.route("/dashboard-data", methods=["GET"])
def dashboard_data():
    username = require_auth_username()
    if not username:
        return jsonify({"error": "Unauthorized. Please login."}), 401

    return jsonify({"message": f"Welcome {username} ✅"}), 200


# ----------------------------
# Posts (Protected)
# ----------------------------
@app.route("/posts", methods=["GET"])
def get_posts():
    username = require_auth_username()
    if not username:
        return jsonify({"error": "Unauthorized. Please login."}), 401

    posts = read_json(POSTS_FILE, [])
    return jsonify(posts), 200


@app.route("/posts", methods=["POST"])
def create_post():
    username = require_auth_username()
    if not username:
        return jsonify({"error": "Unauthorized. Please login."}), 401

    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    content = (data.get("content") or "").strip()

    if not title or not content:
        return jsonify({"error": "title and content required"}), 400

    posts = read_json(POSTS_FILE, [])
    new_id = max([p.get("id", 0) for p in posts], default=0) + 1

    new_post = {
        "id": new_id,
        "title": title,
        "content": content,
        "created_by": username
    }

    posts.insert(0, new_post)
    write_json(POSTS_FILE, posts)

    return jsonify(new_post), 201


@app.route("/posts/<int:post_id>", methods=["PUT"])
def update_post(post_id):
    username = require_auth_username()
    if not username:
        return jsonify({"error": "Unauthorized. Please login."}), 401

    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    content = (data.get("content") or "").strip()

    posts = read_json(POSTS_FILE, [])
    post = next((p for p in posts if p.get("id") == post_id), None)

    if post is None:
        return jsonify({"error": "Post not found"}), 404

    # only creator can edit
    if post.get("created_by") != username:
        return




if(__name__=='__main__'):
    app.run(debug=True)


