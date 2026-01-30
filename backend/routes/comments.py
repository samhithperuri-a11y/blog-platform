from flask import Blueprint, request, jsonify
from models import Comment, db

comments_bp = Blueprint("comments", __name__, url_prefix="/comments")

@comments_bp.route("", methods=["POST"])
def add_comment():
    data = request.json
    comment = Comment(text=data["text"], post_id=data["post_id"])
    db.session.add(comment)
    db.session.commit()
    return jsonify(message="Comment added")

@comments_bp.route("/approve/<int:id>", methods=["PUT"])
def approve_comment(id):
    comment = Comment.query.get(id)
    comment.approved = True
    db.session.commit()
    return jsonify(message="Approved")
