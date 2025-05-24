from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from db.database import SessionLocal, engine, Base
from db import schemas
import db.crud.post as post_crud
import db.models.posts
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Her yerden erişime izin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

SECRET = "alsd987654nfklaOUI45678KOMFHJUMFfnaskldjn83546773aASEFASFASFsdkjnab24356BERTO2347sdlksanbdglkASEDFA243652345WEFASVflkajdngbaklsjdfn785646790aslkjdgnase123412365ASDG43265A"

# ✅ Buradaki alias sayesinde "Authorization" header'ı okunabilir
def verify_token(token: str = Header(..., alias="Authorization")):
    if token != SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")

@app.post("/posts/", response_model=schemas.BlogPost)
def create_post(post: schemas.BlogPostCreate, db: Session = Depends(get_db), _: str = Depends(verify_token)):
    return post_crud.create_post(db, post)

@app.get("/posts/", response_model=list[schemas.BlogPost])
def read_posts(db: Session = Depends(get_db)):
    return post_crud.get_posts(db)

@app.get("/posts/{post_id}", response_model=schemas.BlogPost)
def read_post(post_id: int, db: Session = Depends(get_db)):
    db_post = post_crud.get_post(db, post_id)
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post

@app.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), _: str = Depends(verify_token)):
    deleted = post_crud.delete_post(db, post_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"detail": "Post deleted"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=6050, reload=True)
