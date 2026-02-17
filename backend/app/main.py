from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse, Response

from app.config import settings
from app.db import Base, SessionLocal, engine
from app.routers import admin, public
from app.seed import seed_posts

app = FastAPI(title="Ali Bertay Blog API", version="1.0.0")

# --- CORS: FULL OPEN (dev-friendly) ---
# Not: allow_credentials=True iken allow_origins=["*"] kullanılamaz (tarayıcı engeller).
# Bu yüzden "her origin'i yansıtma" (regex) yöntemiyle full-open yapıyoruz.
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",   # tüm origin'lere izin ver
    allow_credentials=True,    # cookie/authorization header gibi credential'lar için
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,             # preflight cache (1 gün)
)

# Eğer sen credentials kullanmıyorsan (cookie falan yok, sadece bearer token vs),
# o zaman en basit FULL OPEN şudur:
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=False,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

@app.middleware("http")
async def add_noarchive_headers(request: Request, call_next) -> Response:
    response = await call_next(request)
    response.headers["X-Robots-Tag"] = "noindex, nofollow, noarchive, nosnippet, noimageindex"
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


# Preflight'ı ekstra garantiye almak istersen (çoğu zaman middleware yeterli):
@app.options("/{full_path:path}", include_in_schema=False)
async def preflight_handler(full_path: str) -> Response:
    return Response(status_code=204)


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


@app.get("/robots.txt", include_in_schema=False)
def robots_txt() -> PlainTextResponse:
    return PlainTextResponse("User-agent: *\nDisallow: /\n")


app.include_router(public.router)
app.include_router(admin.router)
