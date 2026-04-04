import os
import sys
import logging
from pathlib import Path

# Setup basic logging to catch Vercel stdout/stderr
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the project root to sys.path so Vercel can find 'workflows', 'agents', etc.
project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.append(str(project_root))

try:
    from fastapi import FastAPI, HTTPException, File, UploadFile, Form
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel, EmailStr
    from workflows.matching_flow import app as graph_app
    from langchain_core.messages import HumanMessage, ToolMessage
    import re
    import ast
    import PyPDF2
    import io
    from config import Config
    from auth import create_user, verify_user_email, authenticate_user, resend_verification_code, get_user_by_email
    
    logger.info("Successfully imported all backend modules.")
except Exception as e:
    import traceback
    error_msg = f"CRITICAL: Failed to initialize backend modules during cold start:\n{traceback.format_exc()}"
    print(error_msg)
    # We still need to define 'app' so Vercel doesn't fail basic routing
    from fastapi import FastAPI
    app = FastAPI()
    @app.get("/")
    async def startup_error():
        return {"error": "Backend initialization failed", "details": str(e)}
    # Re-raise for Vercel to see the failure in logs
    raise

# Initialize FastAPI
app = FastAPI()

# Verify API Keys on startup
if not Config.GROQ_API_KEY:
    logger.warning("GROQ_API_KEY is missing! Vercel functions will likely fail.")

# Add CORS middleware
allowed_origins = [
    "http://localhost:3000",           # Local development
    "https://localhost:3000",          # Local development (HTTPS)
    "http://localhost:8000",           # Backend local
    os.getenv("FRONTEND_URL", ""),     # Production frontend URL
]
# Remove empty strings from allowed_origins
allowed_origins = [origin for origin in allowed_origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins or ["*"],  # Fallback to all origins if no specific URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== PYDANTIC MODELS ====================
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class VerifyRequest(BaseModel):
    email: str
    code: str

class ResendVerificationRequest(BaseModel):
    email: str

# ==================== AUTH ENDPOINTS ====================
@app.post("/api/signup")
async def signup(request: SignupRequest):
    """Sign up a new user."""
    try:
        if not request.name or not request.email or not request.password:
            raise HTTPException(status_code=400, detail="Name, email, and password are required")
        
        if len(request.password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        
        user = create_user(request.name, request.email, request.password)
        return {
            "success": True,
            "message": "User created. Please check your email for verification code.",
            "user": user
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail="Signup failed")

@app.post("/api/verify")
async def verify(request: VerifyRequest):
    """Verify user email with verification code."""
    try:
        if not request.email or not request.code:
            raise HTTPException(status_code=400, detail="Email and code are required")
        
        verified = verify_user_email(request.email, request.code)
        if not verified:
            raise HTTPException(status_code=400, detail="Invalid or expired verification code")
        
        return {
            "success": True,
            "message": "Email verified successfully. You can now log in."
        }
    except Exception as e:
        logger.error(f"Verify error: {e}")
        raise HTTPException(status_code=500, detail="Verification failed")

@app.post("/api/resend-verification")
async def resend_verification(request: ResendVerificationRequest):
    """Resend verification code to user email."""
    try:
        if not request.email:
            raise HTTPException(status_code=400, detail="Email is required")
        
        success = resend_verification_code(request.email)
        if not success:
            raise HTTPException(status_code=400, detail="User not found or already verified")
        
        return {
            "success": True,
            "message": "Verification code resent to your email"
        }
    except Exception as e:
        logger.error(f"Resend verification error: {e}")
        raise HTTPException(status_code=500, detail="Resend failed")

@app.post("/api/login")
async def login(request: LoginRequest):
    """Log in a user."""
    try:
        if not request.email or not request.password:
            raise HTTPException(status_code=400, detail="Email and password are required")
        
        user = authenticate_user(request.email, request.password)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        return {
            "success": True,
            "message": "Login successful",
            "user": user
        }
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

@app.get("/api/user/{user_id}")
async def get_user(user_id: str):
    """Get user info by ID."""
    try:
        # In a real app, verify the user token/session first
        users = []
        from auth import load_users
        all_users = load_users()
        for user_data in all_users.values():
            if user_data.get("id") == user_id:
                return {
                    "id": user_data["id"],
                    "email": user_data["email"],
                    "name": user_data["name"],
                    "verified": user_data["verified"]
                }
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        logger.error(f"Get user error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user")

@app.get("/")
def home():
    return {"message": "Career Coach AI is running!"}

def parse_response(final_response: str, messages: list) -> dict:
    # ... (same as before)
    score_match = re.search(r'(\d+)%', final_response)
    score = int(score_match.group(1)) if score_match else 0
    reason = final_response.strip()
    videos = []
    for msg in messages:
        if isinstance(msg, ToolMessage):
            try:
                video_data = ast.literal_eval(msg.content)
                if isinstance(video_data, list):
                    videos = [
                        {
                            "title": v.get("title", ""),
                            "video": v.get("link", ""),
                            "thumbnail": v.get("thumbnail", "")
                        }
                        for v in video_data if isinstance(v, dict) and v.get("link")
                    ]
                    if videos:
                        break
            except (ValueError, SyntaxError):
                pass
    if not videos:
        video_pattern = r'\*\s*([^\n]+?):\s*(https://www\.youtube\.com/watch\?v=[^\s]+)'
        matches = re.findall(video_pattern, final_response)
        for title, link in matches:
            videos.append({
                "title": title.strip(),
                "video": link,
                "thumbnail": ""
            })
    return {
        "match_score": score,
        "reason": reason,
        "learning_plan": videos
    }

@app.post("/api/analyze")
@app.post("/analyze")
async def analyze_career(cv: UploadFile = File(...), job_description: str = Form(...)):
    """
    Endpoint that handles PDF upload and triggers the Agent Workflow.
    """
    try:
        # 1. Read the PDF content
        pdf_content = await cv.read()
        
        # 2. Extract text from PDF using PyPDF2
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
        resume_text = ""
        for page in pdf_reader.pages:
            resume_text += page.extract_text() or ""
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the PDF.")

        # 3. Create the initial prompt for the agent
        initial_prompt = (
            f"Here is a Job Description: {job_description} \n\n"
            f"Here is a Resume: {resume_text} \n\n"
            "Step 1: Compare them and calculate a percentage match score. "
            "Step 2: If the score is under 100%, identify the TOP missing skill. "
            "Step 3: Use the video tool to find 3 specific YouTube videos for that missing skill. "
            "Step 4: Final output should be the Score, the Reasoning, and the Video Links."
        )
        
        inputs = {"messages": [HumanMessage(content=initial_prompt)]}
        
        # 4. Run the graph
        result = graph_app.invoke(inputs)
        final_response = result["messages"][-1].content
        structured_response = parse_response(final_response, result["messages"])
        
        return structured_response

    except Exception as e:
        import traceback
        print(f"[ERROR] Backend failure:\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))
