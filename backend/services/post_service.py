from models import Post, db

def create_post(title, content):
    post = Post(title=title, content=content)
    db.session.add(post)
    db.session.commit()
    return post
