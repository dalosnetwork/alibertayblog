from sqlalchemy.orm import Session
from ..models.posts import BlogPost
from ..schemas import BlogPostCreate

def get_posts(db: Session):
    return db.query(BlogPost).all()

def get_post(db: Session, post_id: int):
    return db.query(BlogPost).filter(BlogPost.id == post_id).first()

def create_post(db: Session, post: BlogPostCreate):
    db_post = BlogPost(title=post.title, content=post.content)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def delete_post(db: Session, post_id: int):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()

    if post:
        db.delete(post)
        db.commit()
    return post