from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse, Response

from sqlalchemy import text

from app.config import settings
from app.db import Base, SessionLocal, engine
from app.routers import admin, public
from app.seed import seed_posts

app = FastAPI(title="Ali Bertay Blog API", version="1.0.0")

# --- Performance (SEO'ya dolaylı katkı) ---
app.add_middleware(GZipMiddleware, minimum_size=1000)

# --- CORS ---
# Prod'da mümkünse allow_origin_regex=".*" yerine settings.cors_origins ile sınırla.
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",   # dev-friendly (tüm origin)
    allow_credentials=True,    # cookie/authorization header vb.
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,
)

# Preflight'ı ekstra garantiye almak istersen:
@app.options("/{full_path:path}", include_in_schema=False)
async def preflight_handler(full_path: str) -> Response:
    return Response(status_code=204)

# --- SEO / Robots headers ---
# Public içerik indexlenebilir kalsın.
# Admin, docs, openapi ve (istersen) tüm API host'u noindex olsun.
NOINDEX_PATH_PREFIXES = ("/admin", "/docs", "/redoc", "/openapi.json")

@app.middleware("http")
async def seo_robots_headers(request: Request, call_next) -> Response:
    response = await call_next(request)

    host = (request.url.hostname or "").lower()
    path = request.url.path

    is_sensitive_path = path.startswith(NOINDEX_PATH_PREFIXES)
    is_api_host = host.startswith("api-")  # api-alibertay... gibi

    # ✅ SEO: Public site indexlensin; API/admin/docs indexlenmesin
    if is_sensitive_path or is_api_host:
        response.headers["X-Robots-Tag"] = "noindex, nofollow, noarchive, nosnippet, noimageindex"

    return response


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


# --- robots.txt (SEO-friendly) ---
# Eğer bu servis sadece API domain'inde çalışıyorsa:
#   robots.txt "Disallow: /" bırakmak daha mantıklı olabilir.
# Ama sen "site indexlensin" dediğin için; admin/docs'i kapatıp genel Allow verdim.
@app.get("/robots.txt", include_in_schema=False)
def robots_txt() -> PlainTextResponse:
    # Canonical/Sitemap URL'sini config'e koyman en iyisi:
    # settings.public_site_url = "https://alibertay.dalosnetwork.com"
    site = getattr(settings, "public_site_url", "").rstrip("/")
    lines = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /admin",
        "Disallow: /docs",
        "Disallow: /redoc",
        "Disallow: /openapi.json",
    ]
    if site:
        lines.append(f"Sitemap: {site}/sitemap.xml")
    return PlainTextResponse("\n".join(lines) + "\n")


# --- sitemap.xml (SEO-friendly) ---
# ÖNEMLİ: Sitemap normalde FRONTEND domain'inde servis edilmeli.
# Ama backend'den de üretmek istersen aşağıdaki gibi yapabilirsin.
@app.get("/sitemap.xml", include_in_schema=False)
def sitemap_xml() -> Response:
    site = getattr(settings, "public_site_url", "").rstrip("/")
    # site boşsa sitemap anlamsız; gene de boş urlset döndürelim
    # (prod'da zorunlu tutmak daha iyi)
    urls: list[tuple[str, str | None]] = []

    if site:
        # Ana sayfa vb. statik sayfalar
        urls.append((f"{site}/", None))

        # Post URL'leri (DB şemanıza göre düzenleyin)
        # Aşağıdaki sorguyu kendi tablo/kolon adlarına göre güncelle:
        #
        # Varsayım: posts tablosu var, slug var, updated_at veya created_at var,
        # publish flag'i olabilir.
        try:
            with SessionLocal() as db:
                rows = db.execute(text("""
                    SELECT slug, COALESCE(updated_at, created_at) AS lastmod
                    FROM posts
                    WHERE COALESCE(is_published, 1) = 1
                """)).all()
                for slug, lastmod in rows:
                    if not slug:
                        continue
                    # Frontend route'un: /post/<slug> veya /posts/<slug> ise burayı değiştir
                    loc = f"{site}/post/{slug}"
                    lastmod_str = None
                    if lastmod is not None:
                        # datetime ise ISO'ya çevir
                        try:
                            lastmod_str = lastmod.date().isoformat()
                        except Exception:
                            try:
                                lastmod_str = str(lastmod)
                            except Exception:
                                lastmod_str = None
                    urls.append((loc, lastmod_str))
        except Exception:
            # Şema tutmazsa sitemap yine çalışsın (boş/az içerikle)
            pass

    # XML üretimi
    def esc(s: str) -> str:
        return (s.replace("&", "&amp;")
                 .replace("<", "&lt;")
                 .replace(">", "&gt;")
                 .replace('"', "&quot;")
                 .replace("'", "&apos;"))

    xml = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, lastmod in urls:
        xml.append("<url>")
        xml.append(f"<loc>{esc(loc)}</loc>")
        if lastmod:
            xml.append(f"<lastmod>{esc(lastmod)}</lastmod>")
        xml.append("</url>")
    xml.append("</urlset>")

    return Response("\n".join(xml) + "\n", media_type="application/xml")


app.include_router(public.router)
app.include_router(admin.router)
