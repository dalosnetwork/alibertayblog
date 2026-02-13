from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import create_access_token, verify_token
from app.config import settings
from app.db import get_db
from app.models import Post
from app.schemas import LoginRequest, PostCreate, PostOut, PostUpdate, TokenResponse
from app.services.slug import generate_unique_slug

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    if payload.username != settings.admin_username or payload.password != settings.admin_password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(payload.username)
    return TokenResponse(access_token=token)


@router.get("/posts", response_model=list[PostOut], dependencies=[Depends(verify_token)])
def list_admin_posts(db: Session = Depends(get_db)) -> list[PostOut]:
    return db.execute(select(Post).order_by(Post.created_at.desc())).scalars().all()


@router.post("/posts", response_model=PostOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(verify_token)])
def create_post(payload: PostCreate, db: Session = Depends(get_db)) -> PostOut:
    slug = generate_unique_slug(db, payload.title)
    published_at = datetime.utcnow() if payload.is_published else None
    post = Post(
        slug=slug,
        title=payload.title,
        subtitle=payload.subtitle,
        content_md=payload.content_md,
        tags=payload.tags,
        is_published=payload.is_published,
        published_at=published_at,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.put("/posts/{post_id}", response_model=PostOut, dependencies=[Depends(verify_token)])
def update_post(post_id: int, payload: PostUpdate, db: Session = Depends(get_db)) -> PostOut:
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    data = payload.model_dump(exclude_unset=True)
    if "title" in data and data["title"] != post.title:
        post.slug = generate_unique_slug(db, data["title"], current_post_id=post.id)

    for key, value in data.items():
        setattr(post, key, value)

    if payload.is_published is True and post.published_at is None:
        post.published_at = datetime.utcnow()
    if payload.is_published is False:
        post.published_at = None

    db.commit()
    db.refresh(post)
    return post


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(verify_token)])
def delete_post(post_id: int, db: Session = Depends(get_db)) -> None:
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()


@router.post("/posts/{post_id}/publish", response_model=PostOut, dependencies=[Depends(verify_token)])
def publish_post(post_id: int, db: Session = Depends(get_db)) -> PostOut:
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.is_published = True
    post.published_at = post.published_at or datetime.utcnow()
    db.commit()
    db.refresh(post)
    return post


@router.post("/posts/{post_id}/unpublish", response_model=PostOut, dependencies=[Depends(verify_token)])
def unpublish_post(post_id: int, db: Session = Depends(get_db)) -> PostOut:
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.is_published = False
    post.published_at = None
    db.commit()
    db.refresh(post)
    return post
