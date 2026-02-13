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


## Python Sürümü Notu

- Python `3.11`, `3.12` veya `3.13` kullanın.
- Python `3.14` ile `pydantic-core` derleme hatası alabilirsiniz (PyO3 uyumluluğu).

Örnek (pyenv):

```bash
pyenv install 3.13.6
pyenv local 3.13.6
python -m venv .venv
```
