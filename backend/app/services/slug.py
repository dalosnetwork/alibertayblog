import re
import unicodedata

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Post


def _slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", normalized).strip("-").lower()
    return slug or "post"


def generate_unique_slug(db: Session, title: str, current_post_id: int | None = None) -> str:
    base_slug = _slugify(title)
    slug = base_slug
    suffix = 2

    while True:
        query = select(Post).where(Post.slug == slug)
        existing = db.execute(query).scalar_one_or_none()
        if existing is None or existing.id == current_post_id:
            return slug
        slug = f"{base_slug}-{suffix}"
        suffix += 1
