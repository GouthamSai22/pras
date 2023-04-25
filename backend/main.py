# Description: Main FastAPI file
# import libraries
import aiosql
import psycopg2
from dotenv import load_dotenv
import os
from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Union, List, Optional
from auth import authn_user
from datetime import datetime
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session, sessionmaker, joinedload, relationship
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, BigInteger, String, Integer, DateTime, Boolean, ForeignKey
import pytz
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from jinja2 import Template
import pytesseract
from PIL import Image
from pyzbar import pyzbar
import nltk

# Timezone
IST = pytz.timezone('Asia/Kolkata')

# Load environment variables
load_dotenv()

# initialize pytesseract path
pytesseract.pytesseract.tesseract_cmd = os.getenv("TESSERACT_PATH")

# download the required corpus and model data
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('taggers/averaged_perceptron_tagger')
    nltk.data.find('chunkers/maxent_ne_chunker')
    nltk.data.find('corpora/words')
except LookupError:
    nltk.download('punkt')
    nltk.download('averaged_perceptron_tagger')
    nltk.download('maxent_ne_chunker')
    nltk.download('words')

# Database credentials
DATABASE = os.getenv("DATABASE")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASS = os.getenv("POSTGRES_PASS")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")

# Database connection
conn  = psycopg2.connect(
    database=DATABASE,
    user=POSTGRES_USER,
    password=POSTGRES_PASS,
    host=POSTGRES_HOST,
    port=POSTGRES_PORT
)

print("Database connection established")

# SQL Alchemy setup
SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASS}@{POSTGRES_HOST}:{POSTGRES_PORT}/{DATABASE}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get a SQLAlchemy session for database operations
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# SQL Alchemy Models
class DBUser(Base):
    __tablename__ = "users"
    user_id = Column(BigInteger, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    phone_number = Column(String(15), unique=True, nullable=True)
    room = Column(String(255), nullable=True)
    role = Column(String(15), nullable=False)

class DBPackage(Base):
    __tablename__ = "package"

    package_id = Column(BigInteger, primary_key=True, index=True)
    package_number = Column(String(255), unique=True, nullable=False, index=True)
    package_type = Column(String(20), nullable=True)
    status = Column(Integer, default=0)
    owner_name = Column(String(255), nullable=True)
    arrival = Column(DateTime, default=datetime.now(IST), nullable=False)

    collected_packages = relationship("DBCollectedPackage", backref="package")

class DBCollectedPackage(Base):
    __tablename__ = "package_collection"

    collected_package_id = Column(BigInteger, ForeignKey("package.package_id"), primary_key=True, index=True)
    collected_by_email = Column(String(255), ForeignKey("user.email"), nullable=False, index=True)
    collection_time = Column(DateTime, default=datetime.now(IST), nullable=False)

# Pydantic Models
class User(BaseModel):
    user_id: int
    email: EmailStr
    name: str
    phone_number: Optional[str]
    room: Optional[str]
    role: str

    class Config:
        orm_mode = True

    @classmethod
    def get_by_email(cls, db: Session, email: str) -> Optional["User"]:
        user = db.query(DBUser).filter(DBUser.email == email).first()
        if user:
            return User.from_orm(user)
        return None


class Package(BaseModel):
    package_id: int
    package_number: str
    status: int = 0
    owner_name: Optional[str]
    package_type: Optional[str]
    arrival: datetime
    collection_time: Optional[datetime]
    collected_by_email: Optional[str]

    class Config:
        orm_mode = True
    
    @classmethod
    def get_by_id(cls, db: Session, package_id: int) -> Optional["Package"]:
        package = db.query(DBPackage).filter(DBPackage.package_id == package_id).first()
        if package:
            collected_package = db.query(DBCollectedPackage).join(DBPackage).filter(DBPackage.package_id == package_id).first()
            if collected_package:
                package_dict = package.__dict__
                package_dict["collection_time"] = collected_package.collection_time
                package_dict["collected_by_email"] = collected_package.collected_by_email
                return Package(**package_dict)
            return Package.from_orm(package)
        return None

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
    email, name, picture = authn_user(Authorization)
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"email": email, 
            "name": name, 
            "picture": picture}

def send_email(name, package_id, collected_by, receiver_list):
    gmail_user = os.getenv("GMAIL_USER")
    gmail_password = os.getenv("GMAIL_PASSWORD")
    receiver = ', '.join(receiver_list)
    message = MIMEMultipart("alternative")
    message["Subject"] = "Package Collected"
    message["From"] = gmail_user
    message["To"] = receiver
    
    with open("collection.html", "r") as f:
        template_str = f.read()
    
    template = Template(template_str)
    html = template.render(name=name, package_id=package_id, collected_by=collected_by)
    part = MIMEText(html, "html")
    message.attach(part)

    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.ehlo()
        server.login(gmail_user, gmail_password)
        server.sendmail(gmail_user, receiver, message.as_string())
        server.close()
        print("Email sent!")
    except Exception as err:
        print(err)

def get_details_from_image(img):
    text = pytesseract.image_to_string(img)
    barcodes = pyzbar.decode(img)
    for barcode in barcodes:
        barcodeData = barcode.data.decode("utf-8")
    
    lines = text.splitlines()
    sentences = []
    for line in lines:
        sentences += nltk.sent_tokenize(line)

    name_detected = ""
    flag = 0

    for sentence in sentences:
        words = nltk.word_tokenize(sentence)
        tagged = nltk.pos_tag(words)
        # use the named entity recognizer to extract named entities
        named_entities = nltk.ne_chunk(tagged)
        # loop over each named entity
        for entity in named_entities:
            # if the entity is a person and has a label of 'PERSON'
            if hasattr(entity, 'label') and entity.label() == 'PERSON' and flag == 0:
                # check if the person is an Indian name by looking for Indian prefixes
                name_detected = ' '.join(c[0] for c in entity.leaves() if c[0] not in ['Mr.', 'Ms.', 'Mrs.', 'Dr.'])
                flag = 1
                break
        if flag == 1:
            break

    for line in lines:
        if name_detected in line:
            full_name = line
            break
    
    return {"package_number": barcodeData, "owner_name": full_name}

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
async def auth(details: dict = Depends(verify_auth_token)):
    """
    Test Endpoint to validate user identity
    """
    return details

@app.get("/users/{email}")
async def get_user(email: str, db: Session = Depends(get_db)):
    user = User.get_by_email(db, email)
    if user:
        return user
    return {"message": "User not found"}

@app.get("/packages/{package_id}")
async def get_package(package_id: int, db: Session = Depends(get_db)):
    package = Package.get_by_id(db, package_id)
    if package:
        return package
    return {"message": "Package not found"}

# send_email('Vikhyath', 'AWB1002', 'Goutham', ['cs20btech11056@iith.ac.in', 'cs20btech11042@iith.ac.in', 'cs19btech11051@iith.ac.in', 'es19btech11017@iith.ac.in'])
# img = Image.open('images/test_image.jpeg').convert('L')
# package = get_details_from_image(img)
# print(package)