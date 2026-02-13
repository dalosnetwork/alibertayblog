from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Post
from app.schemas import PaginatedPosts, PostOut, SearchResponse

router = APIRouter(prefix="/api", tags=["public"])


@router.get("/posts", response_model=PaginatedPosts)
def list_posts(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
) -> PaginatedPosts:
    base_query = select(Post).where(Post.is_published.is_(True))
    total = db.execute(select(func.count()).select_from(base_query.subquery())).scalar_one()

    items = db.execute(
        base_query.order_by(Post.published_at.desc().nullslast(), Post.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).scalars().all()

    return PaginatedPosts(page=page, page_size=page_size, total=total, items=items)


@router.get("/posts/{slug}", response_model=PostOut)
def get_post(slug: str, db: Session = Depends(get_db)) -> PostOut:
    post = db.execute(select(Post).where(Post.slug == slug, Post.is_published.is_(True))).scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.get("/search", response_model=SearchResponse)
def search_posts(q: str = Query(min_length=1), db: Session = Depends(get_db)) -> SearchResponse:
    pattern = f"%{q}%"
    items = (
        db.execute(
            select(Post)
            .where(
                Post.is_published.is_(True),
                or_(
                    Post.title.ilike(pattern),
                    Post.subtitle.ilike(pattern),
                    Post.content_md.ilike(pattern),
                ),
            )
            .order_by(Post.published_at.desc().nullslast(), Post.created_at.desc())
        )
        .scalars()
        .all()
    )
    return SearchResponse(query=q, total=len(items), items=items)


@router.get("/tags", response_model=list[str])
def list_tags(db: Session = Depends(get_db)) -> list[str]:
    posts = db.execute(select(Post.tags).where(Post.is_published.is_(True))).scalars().all()
    tag_set = set()
    for tag_string in posts:
        for tag in tag_string.split(","):
            cleaned = tag.strip()
            if cleaned:
                tag_set.add(cleaned)
    return sorted(tag_set)
