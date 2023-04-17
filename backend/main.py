import aiosql
import psycopg2
from dotenv import load_dotenv
import os
from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Union, List
from auth import authn_user

load_dotenv()

DATABASE = os.getenv("DATABASE")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASS = os.getenv("POSTGRES_PASS")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")

conn  = psycopg2.connect(
    database=DATABASE,
    user=POSTGRES_USER,
    password=POSTGRES_PASS,
    host=POSTGRES_HOST,
    port=POSTGRES_PORT
)

print("Database connection established")

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

queries = aiosql.from_path("db", "psycopg2")

def verify_auth_token(Authorization: str = Header()):
    email = authn_user(Authorization)
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return email

@app.get("/")
async def root():
    try:
        results = queries.get_temp(conn)
        print(results)
    except Exception as err:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(err))
    
    return {"message": "Hello World"}

@app.get("/auth")
async def auth(email: str = Depends(verify_auth_token)):
    """
    Test Endpoint to validate user identity
    """
    return {"email": email}