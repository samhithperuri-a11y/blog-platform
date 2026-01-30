from flask import Blueprint, request, jsonify
from services.post_service import create_post
from models import Post

posts_bp = Blueprint("posts", __name__, url_prefix="/posts")

@posts_bp.route("", methods=["POST"])
def add_post():
    data = request.json
    post = create_post(data["title"], data["content"])
    return jsonify(id=post.id, title=post.title)

@posts_bp.route("", methods=["GET"])
def get_posts():
    posts = Post.query.all()
    return jsonify([
        {"id": p.id, "title": p.title, "content": p.content}
        for p in posts
    ])
