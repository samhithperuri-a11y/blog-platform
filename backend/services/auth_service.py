from models import User, db

def create_user(username, password):
    user = User(username=username, password=password, is_admin=True)
    db.session.add(user)
    db.session.commit()
