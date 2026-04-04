"""Authentication and user management module."""
import json
import os
import secrets
import time
from pathlib import Path
from typing import Optional, Dict, Any
import bcrypt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import Config

# User store file
USERS_FILE = Path(__file__).parent / "data" / "users.json"
USERS_FILE.parent.mkdir(parents=True, exist_ok=True)


def load_users() -> Dict[str, Any]:
    """Load users from JSON file."""
    if not USERS_FILE.exists():
        return {}
    try:
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading users: {e}")
        return {}


def save_users(users: Dict[str, Any]) -> None:
    """Save users to JSON file."""
    try:
        with open(USERS_FILE, 'w') as f:
            json.dump(users, f, indent=2)
    except Exception as e:
        print(f"Error saving users: {e}")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash."""
    try:
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except Exception:
        return False


def generate_verification_code() -> str:
    """Generate a 6-digit verification code."""
    return str(int(secrets.token_hex(3), 16) % 1000000).zfill(6)


def send_verification_email(email: str, code: str) -> Optional[str]:
    """Send verification email. Returns preview URL if using Ethereal test account."""
    try:
        host = Config.SMTP_HOST
        port = int(Config.SMTP_PORT or 587)
        user = Config.SMTP_USER
        password = Config.SMTP_PASS
        sender = Config.SMTP_FROM
        
        if not host or not user:
            # Use Ethereal test account for development
            print(f"[DEV] Verification code for {email}: {code}")
            return f"[TEST MODE] Code: {code}"
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'Resume Agent - Verification Code'
        msg['From'] = sender
        msg['To'] = email
        
        text = f"Your verification code is: {code}"
        html = f"""
        <html>
            <body>
                <h2>Resume Agent</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">{code}</h1>
                <p>This code expires in 10 minutes.</p>
            </body>
        </html>
        """
        
        msg.attach(MIMEText(text, 'plain'))
        msg.attach(MIMEText(html, 'html'))
        
        with smtplib.SMTP(host, port) as server:
            if port == 587:
                server.starttls()
            server.login(user, password)
            server.send_message(msg)
        
        return None
    except Exception as e:
        print(f"Error sending email: {e}")
        return None


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Get user by email."""
    users = load_users()
    return users.get(email.lower())


def create_user(name: str, email: str, password: str) -> Dict[str, Any]:
    """Create a new user and send verification email."""
    email = email.lower()
    users = load_users()
    
    if email in users:
        raise ValueError("User already exists")
    
    verification_code = generate_verification_code()
    verification_expires = int(time.time()) + (10 * 60)  # 10 minutes
    
    user = {
        "id": secrets.token_urlsafe(16),
        "name": name,
        "email": email,
        "passwordHash": hash_password(password),
        "verified": False,
        "verificationCode": verification_code,
        "verificationExpires": verification_expires,
        "createdAt": time.time(),
    }
    
    users[email] = user
    save_users(users)
    
    # Send verification email
    send_verification_email(email, verification_code)
    
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "verified": user["verified"],
    }


def verify_user_email(email: str, code: str) -> bool:
    """Verify user email with code."""
    email = email.lower()
    users = load_users()
    user = users.get(email)
    
    if not user:
        return False
    
    if user["verified"]:
        return True
    
    if user.get("verificationCode") != code:
        return False
    
    if user.get("verificationExpires", 0) < time.time():
        return False
    
    user["verified"] = True
    user["verificationCode"] = None
    user["verificationExpires"] = None
    users[email] = user
    save_users(users)
    
    return True


def resend_verification_code(email: str) -> bool:
    """Resend verification code to user."""
    email = email.lower()
    users = load_users()
    user = users.get(email)
    
    if not user:
        return False
    
    if user["verified"]:
        return False
    
    verification_code = generate_verification_code()
    verification_expires = int(time.time()) + (10 * 60)
    
    user["verificationCode"] = verification_code
    user["verificationExpires"] = verification_expires
    users[email] = user
    save_users(users)
    
    send_verification_email(email, verification_code)
    return True


def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    """Authenticate user with email and password."""
    email = email.lower()
    user = get_user_by_email(email)
    
    if not user:
        return None
    
    if not user.get("verified"):
        return None
    
    if not verify_password(password, user.get("passwordHash", "")):
        return None
    
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "verified": user["verified"],
    }
