from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import time
import hashlib

app = FastAPI(title="User Management Service")

# Simple in-memory storage (for demo)
users_db = {}

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str = "User"
    role: str = "user"

class UserLogin(BaseModel):
    email: str
    password: str

def hash_password(password: str) -> str:
    """Simple password hashing for demo"""
    return hashlib.sha256(password.encode()).hexdigest()

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "user-management"}

@app.post("/auth/register")
async def register(user: UserCreate):
    # Check if user exists
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Store user with hashed password
    users_db[user.email] = {
        "id": f"user-{len(users_db) + 1}",
        "email": user.email,
        "password": hash_password(user.password),
        "full_name": user.full_name,
        "role": user.role,
        "created_at": int(time.time())
    }
    
    # Return user without password
    return {
        "id": users_db[user.email]["id"],
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "is_active": True,
        "created_at": users_db[user.email]["created_at"]
    }

@app.post("/auth/login")
async def login(credentials: UserLogin):
    # Check if user exists
    if credentials.email not in users_db:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = users_db[credentials.email]
    
    # Verify password
    if user["password"] != hash_password(credentials.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Return simple token
    return {
        "access_token": f"token-{user['id']}-{int(time.time())}",
        "token_type": "bearer",
        "expires_in": 3600
    }

@app.get("/auth/me")
async def get_me():
    return {
        "id": "user-1",
        "email": "demo@example.com",
        "full_name": "Demo User",
        "role": "admin",
        "is_active": True,
        "created_at": int(time.time())
    }
