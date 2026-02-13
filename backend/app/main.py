from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.db import Base, SessionLocal, engine
from app.routers import admin, public
from app.seed import seed_posts

app = FastAPI(title="Ali Bertay Blog API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": str(exc.detail)})


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_posts(db)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(public.router)
app.include_router(admin.router)
