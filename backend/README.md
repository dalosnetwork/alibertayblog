# Backend (FastAPI + SQLite)

## Kurulum

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

## Migration

```bash
alembic upgrade head
```

## Çalıştırma (local)

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 9027
```

## Docker ile tek komut

Repo root'tan:

```bash
docker compose up --build backend
```

Uygulama startup sırasında örnek yazıları seed eder (veritabanı boşsa).

## Admin Bilgileri

`.env` içindeki `ADMIN_USERNAME` ve `ADMIN_PASSWORD` değerleri kullanılır.
