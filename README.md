# Ali Bertay Blog (Backend + Frontend)

Kişisel blog için FastAPI backend ve React frontend içeren monorepo.

## Backend (local)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 9027
```

API: `http://localhost:9027`

## Backend (Docker - tek komut)

```bash
docker compose up --build backend
```

## Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

UI: `http://localhost:5173`

## Özellikler

- Gazete tarzı anasayfa (manşet + yan akış + grid)
- Yazı detay sayfası
- Arama
- Admin login + CRUD + publish/unpublish
- SQLite + Alembic migration + seed data


## URLs

- Public frontend: `http://localhost:5173`
- Public API (local): `http://localhost:9027`
- Admin URL: `http://localhost:5173/admin/login`
