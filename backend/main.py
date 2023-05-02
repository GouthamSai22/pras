# Description: Main FastAPI file
# import libraries
import aiosql
import psycopg2
from dotenv import load_dotenv
import os
from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Union, List, Optional, Dict
from auth import authn_user
from datetime import datetime
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session, sessionmaker, joinedload, relationship
from sqlalchemy import create_engine, and_, or_
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
from enum import Enum
from abc import ABC, abstractmethod
import base64

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
    collected_by_email = Column(String(255), ForeignKey("users.email"), nullable=False, index=True)
    collection_time = Column(DateTime, default=datetime.now(IST), nullable=False)

class FilterStategy(ABC):
    @abstractmethod
    def apply_filter(self, query: Session, filter_value: Optional[str], from_date: Optional[datetime], to_date: Optional[datetime]) -> Session:
        pass

class PackageNumberFilter(FilterStategy):
    def apply_filter(self, query: Session, filter_value: Optional[str], from_date: Optional[datetime], to_date: Optional[datetime]) -> Session:
        if filter_value:
            query = query.filter(DBPackage.package_number.contains(filter_value))
        return query
    
class PackageTypeFilter(FilterStategy):
    def apply_filter(self, query: Session, filter_value: Optional[str], from_date: Optional[datetime], to_date: Optional[datetime]) -> Session:
        if filter_value:
            query = query.filter(DBPackage.package_type == filter_value)
        return query
    
class OwnerNameFilter(FilterStategy):
    def apply_filter(self, query: Session, filter_value: Optional[str], from_date: Optional[datetime], to_date: Optional[datetime]) -> Session:
        if filter_value:
            query = query.filter(DBPackage.owner_name == filter_value)
        return query

class ArrivalFilter(FilterStategy):
    def apply_filter(self, query: Session, filter_value: Optional[str], from_date: Optional[datetime], to_date: Optional[datetime]) -> Session:
        if from_date and to_date:
            query = query.filter(and_(DBPackage.arrival >= from_date, DBPackage.arrival <= to_date))
        elif from_date:
            query = query.filter(DBPackage.arrival >= from_date)
        elif to_date:
            query = query.filter(DBPackage.arrival <= to_date)
        return query
    
class CollectedByEmailFilter(FilterStategy):
    def apply_filter(self, query: Session, filter_value: Optional[str], from_date: Optional[datetime], to_date: Optional[datetime]) -> Session:
        if filter_value:
            query = query.join(DBCollectedPackage).filter(DBCollectedPackage.collected_by_email == filter_value)
        return query

class CollectionTimeFilter(FilterStategy):
    def apply_filter(self, query: Session, filter_value: Optional[str], from_date: Optional[datetime], to_date: Optional[datetime]) -> Session:
        if from_date and to_date:
            query = query.join(DBCollectedPackage).filter(and_(DBCollectedPackage.collection_time >= from_date, DBCollectedPackage.collection_time <= to_date))
        elif from_date:
            query = query.join(DBCollectedPackage).filter(DBCollectedPackage.collection_time >= from_date)
        elif to_date:
            query = query.join(DBCollectedPackage).filter(DBCollectedPackage.collection_time <= to_date)
        return query

class UserRole(str, Enum):
    ADMIN = "admin"
    STUDENT = "student"

# Pydantic Models
class User(BaseModel):
    # _instance = None

    user_id: int
    email: EmailStr
    name: str
    phone_number: Optional[str]
    room: Optional[str]
    role: UserRole

    class Config:
        orm_mode = True

    # def __new__(cls, *args, **kwargs):
    #     if cls._instance is None:
    #         cls._instance = super(User, cls).__new__(cls, *args, **kwargs)
    #     return cls._instance

    @classmethod
    def get_by_email(cls, db: Session, email: str) -> Optional["User"]:
        user = db.query(DBUser).filter(DBUser.email == email).first()
        if user:
            return User.from_orm(user)
        return None
    
    def notify(self, package: "Package"):
        if package.get_status() == 1:
            send_email(package.owner_name, package.package_number, [package.observer.email], "arrival")
        elif package.get_status() == 2:
            send_email(package.owner_name, package.package_number, [package.observer.email], "collection", package.observer.email)
            
    def search_uncollected_packages(self, db: Session, filter_by: Dict[str, Optional[Union[str, datetime]]] = {}):
        filters = {
            "package_number": PackageNumberFilter(),
            "owner_name": OwnerNameFilter(),
            "package_type": PackageTypeFilter(),
            "arrival": ArrivalFilter(),
        }
        query = db.query(DBPackage).filter(DBPackage.status == 1)
        for key, value in filter_by.items():
            if value is None:
                continue

            if key == "arrival":
                from_date, to_date = value
                query = filters[key].apply_filter(query, None, from_date, to_date)
            else:
                query = filters[key].apply_filter(query, value, None, None)
        
        return query.all()
        
class Student(User):
    @classmethod
    def create(cls, user: User):
        if user.role == UserRole.STUDENT:
            return cls(**user.dict())
        raise ValueError("Invalid user role for creating a student.")

    @classmethod
    def add_student(cls, db: Session, details: dict) -> Optional["Student"]:
        user = User.get_by_email(db, details["email"])
        if user:
            return None
        details["role"] = UserRole.STUDENT
        db_user = DBUser(**details)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return cls.from_orm(db_user)

class Admin(User):
    @classmethod
    def create(cls, user: User):
        if user.role == UserRole.ADMIN:
            return cls(**user.dict())
        raise ValueError("Invalid user role for creating an admin.")
     

class UserFactory:
    @staticmethod
    def create_user(user: User):
        if user.role == UserRole.ADMIN:
            return Admin.create(user)
        elif user.role == UserRole.STUDENT:
            return Student.create(user)
        else:
            raise ValueError("Invalid user role for creating a user.")


class Package(BaseModel):
    package_id: int
    package_number: str
    status: int = 0
    owner_name: Optional[str]
    package_type: Optional[str]
    arrival: datetime
    collection_time: Optional[datetime]
    collected_by_email: Optional[str]

    observer: Optional[User] = None

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

    @classmethod
    def add_package(cls, db: Session, details: dict) -> "Package":
        db_package = DBPackage(**details)
        db.add(db_package)
        db.commit()
        db.refresh(db_package)
        return cls.from_orm(db_package)
    
    def set_observer(self, observer: User) -> None:
        self.observer = observer
    
    def get_status(self):
        return self.status

    def set_status(self, db: Session, status: int) -> None:
        previous_status = self.status
        self.status = status
        if previous_status != status:
            if self.observer:
                self.observer.notify(self)
        db_package = db.query(DBPackage).filter(DBPackage.package_id == self.package_id).first()
        db_package.status = status
        if status == 2:
            db_collected_package = DBCollectedPackage(collected_package_id=self.package_id, collected_by_email=self.observer.email)
            db.add(db_collected_package)
        db.commit()

class Package_Manager:
    def __init__(self):
        self.current_user = None
        self.current_package = None
    
    def set_current_user(self, user: User):
        self.current_user = user
    
    def set_current_package(self, package: Package):
        self.current_package = package

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

def send_email(name, package_id, receiver_list, email_type, collected_by=None):
    gmail_user = os.getenv("GMAIL_USER")
    gmail_password = os.getenv("GMAIL_PASSWORD")
    receiver = ', '.join(receiver_list)
    message = MIMEMultipart("alternative")
    message["Subject"] = "Package " + package_id + " update"
    message["From"] = gmail_user
    message["To"] = receiver
    
    if email_type == "collection":
        with open("collection.html", "r") as f:
            template_str = f.read()
        template = Template(template_str)
        html = template.render(name=name, package_id=package_id, collected_by=collected_by)
    
    elif email_type == "arrival":
        with open("arrival.html", "r") as f:
            template_str = f.read()
        template = Template(template_str)
        html = template.render(name=name, package_id=package_id)

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
    barcodeData = ""
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
            full_name = line.strip()
            break
    
    return {"package_number": barcodeData, "owner_name": full_name}

def get_roll_number_from_image(img):
    barcodes = pyzbar.decode(img)
    barcodeData = ""
    for barcode in barcodes:
        barcodeData = barcode.data.decode("utf-8")
    return {"roll_number": barcodeData}

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
async def auth(details: dict = Depends(verify_auth_token), db: Session = Depends(get_db)):
    """
    Test Endpoint to validate user identity
    """
    email = details["email"]
    user = User.get_by_email(db, email)
    if user:
        user_object = UserFactory.create_user(user)
        if user_object.role == "admin":
            details["isAdmin"] = True
        elif user_object.role == "student":
            details["isAdmin"] = False
    return details

@app.post("/signup")
async def signup(request: Request, details: dict = Depends(verify_auth_token), db: Session = Depends(get_db)):
    """
    Endpoint to register a new user
    """
    body = await request.json()
    body.update(details)
    student = Student.add_student(db, body)
    print(student)
    print(type(student))
    if student:
        return {"result": "success"}
    return {"result": "failure"}

@app.get("/users/{email}")
async def get_user(email: str, db: Session = Depends(get_db)):
    user = User.get_by_email(db, email)
    if user:
        user_object = UserFactory.create_user(user)
        return user_object
    return {"message": "User not found"}

@app.get("/packages/{package_id}")
async def get_package(package_id: int, db: Session = Depends(get_db)):
    package = Package.get_by_id(db, package_id)
    if package:
        return package
    return {"message": "Package not found"}

@app.post("/camera")
async def get_details_from_camera(request: Request):
    body = await request.json()
    img_str = body["pic"].split(",")[1]
    img_bytes = base64.b64decode(img_str)
    with open("image.jpg", "wb") as f:
        f.write(img_bytes)
    img = Image.open("image.jpg").convert("L")
    details = get_details_from_image(img)
    return details

@app.post("/roll-number")
async def get_roll_number_from_camera(request: Request):
    body = await request.json()
    img_str = body["pic"].split(",")[1]
    img_bytes = base64.b64decode(img_str)
    with open("roll.jpg", "wb") as f:
        f.write(img_bytes)
    img = Image.open("roll.jpg").convert("L")
    roll = get_roll_number_from_image(img)
    return roll

@app.get("/packages")
async def get_packages(db: Session = Depends(get_db)):
    packages = db.query(DBPackage).all()
    result = []
    for package in packages:
        package_dict = package.__dict__
        collected_package = db.query(DBCollectedPackage).filter(DBCollectedPackage.collected_package_id == package.package_id).first()
        if collected_package:
            package_dict["collected_by_email"] = collected_package.collected_by_email
            package_dict["collection_time"] = collected_package.collection_time
        else:
            package_dict["collected_by_email"] = None
            package_dict["collection_time"] = None
        package = Package(**package_dict)
        result.append(package)
    return result

@app.post("/add-package")
async def add_package(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    body["status"] = 1
    package = Package.add_package(db, body)
    if package:
        return {"result": "success"}
    return {"result": "failure"}

@app.post("/collect-package")
async def collect_package(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    img_str = body["pic"].split(",")[1]
    img_bytes = base64.b64decode(img_str)
    with open("roll.jpg", "wb") as f:
        f.write(img_bytes)
    img = Image.open("roll.jpg").convert("L")
    roll = get_roll_number_from_image(img)
    if roll["roll_number"] == "":
        return {"result": "roll number not detected"}
    collected_email = roll["roll_number"] + "@iith.ac.in"
    user = User.get_by_email(db, collected_email)

    if user:
        user_obect = UserFactory.create_user(user)
    else:
        return {"result": "user not found"}
    
    package_id = body["package_id"]
    package_object = Package.get_by_id(db, package_id)
    if package_object:
        pass
    else:
        return {"result": "package not found"}
    if package_object.get_status() == 0:
        return {"result": "package hasn't arrived yet"}
    elif package_object.get_status() == 2:
        return {"result": "package already collected"}
    
    package_object.set_observer(user_obect)
    package_object.set_status(db, 2)

    return {"result": "success"}


# send_email('Vikhyath', 'AWB1002', ['cs20btech11056@iith.ac.in'], email_type="arrival")
# img = Image.open('images/test_image.jpeg').convert('L')
# package = get_details_from_image(img)
# print(package)