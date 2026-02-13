from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ErrorResponse(BaseModel):
    detail: str


class PostBase(BaseModel):
    title: str = Field(min_length=1)
    subtitle: str | None = None
    content_md: str = Field(min_length=1)
    tags: str = ""
    is_published: bool = False

    @field_validator("title", "content_md")
    @classmethod
    def not_empty(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("cannot be empty")
        return value


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: str | None = None
    subtitle: str | None = None
    content_md: str | None = None
    tags: str | None = None
    is_published: bool | None = None

    @field_validator("title", "content_md")
    @classmethod
    def optional_not_empty(cls, value: str | None) -> str | None:
        if value is not None and not value.strip():
            raise ValueError("cannot be empty")
        return value


class PostOut(BaseModel):
    id: int
    slug: str
    title: str
    subtitle: str | None
    content_md: str
    is_published: bool
    tags: str
    created_at: datetime
    updated_at: datetime
    published_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class PaginatedPosts(BaseModel):
    page: int
    page_size: int
    total: int
    items: list[PostOut]


class SearchResponse(BaseModel):
    query: str
    total: int
    items: list[PostOut]


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
