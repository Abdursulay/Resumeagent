# Setup & Deployment Guide

## ✅ Current Status

Your full-stack Resume Agent application is now ready!

### ✓ Backend (FastAPI)
- **Status:** Running on `http://localhost:8000`
- **Endpoint:** `POST /api/analyze`
- **Features:** PDF parsing, AI analysis, video recommendations
- **Framework:** FastAPI + LangGraph + Groq LLM

### ✓ Frontend (Next.js)
- **Status:** Running on `http://localhost:3000`
- **Features:** File upload, job description input, results display
- **Styling:** Tailwind CSS with clean, modern UI
- **Framework:** Next.js + React + TypeScript

### ✓ Integration
- **CORS:** Enabled on backend for frontend communication
- **API:** POST `/api/analyze` accepts multipart form data
- **Response:** JSON with match score, analysis, and video links

---

## 🚀 Local Development

### Terminal 1: Backend
```bash
cd "C:\Users\VP\Documents\Resume Agent"
python -m uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2: Frontend
```bash
cd "C:\Users\VP\Documents\Resume Agent\frontend"
pnpm dev
```

### Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 📱 Testing Locally

1. Open http://localhost:3000 in your browser
2. Click "Click or drag PDF here" to upload a resume (PDF)
3. Paste a job description in the text area
4. Click "Analyze Resume"
5. Wait for AI analysis (30-60 seconds)
6. View results with match score and learning videos

### Test Files
- Create a sample resume PDF for testing
- Use any job description from LinkedIn, Indeed, etc.

---

## 🌐 Deployment (Vercel)

### Prerequisites
- GitHub account (push code)
- Vercel account (https://vercel.com)
- Environment variables ready

### Step 1: Push to GitHub

```bash
cd "C:\Users\VP\Documents\Resume Agent"
git add .
git commit -m "Initial deployment"
git push origin main
```

### Step 2: Deploy Frontend

```bash
cd frontend
vercel
```

Follow prompts to link Vercel account and deploy.

### Step 3: Deploy Backend

```bash
vercel
```

This deploys the Python backend as serverless functions.

### Step 4: Set Environment Variables

On Vercel Dashboard:

1. **Backend Function Settings:**
   - Add `GROQ_API_KEY`
   - Add `SERPAPI_API_KEY`

2. **Frontend Environment Variables:**
   - Add `NEXT_PUBLIC_API_URL=https://your-api.vercel.app`

### Step 5: Update Frontend Configuration

In `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

---

## 🔧 Configuration

### Backend Config (config.py)
```python
class Config:
    MODEL_NAME = "meta-llama/llama-4-scout-17b-16e-instruct"
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")
```

### Frontend Config (next.config.ts)
```typescript
const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },
};
```

### CORS Policy (api/index.py)

**Development:**
```python
allow_origins=["*"]  # All origins allowed
```

**Production:**
```python
allow_origins=[
    "https://your-app.vercel.app",
    "https://yourdomain.com"
]
```

---

## 📋 API Specification

### Request
```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "cv=@resume.pdf" \
  -F "job_description=Senior Python Developer..."
```

### Response (200 OK)
```json
{
  "match_score": 85,
  "reason": "Your Python and FastAPI experience align well...",
  "learning_plan": [
    {
      "title": "Docker for Beginners",
      "video": "https://youtube.com/watch?v=...",
      "thumbnail": "https://..."
    }
  ]
}
```

### Error Response (400/500)
```json
{
  "detail": "Could not extract text from the PDF."
}
```

---

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check Python dependencies
pip install -r requirements.txt

# Verify environment variables
echo %GROQ_API_KEY%
echo %SERPAPI_API_KEY%

# Try verbose logging
python -m uvicorn api.index:app --log-level debug
```

### Frontend won't connect to backend
```bash
# Verify backend is running
curl http://localhost:8000

# Check environment variable
echo %NEXT_PUBLIC_API_URL%

# Check browser console for CORS errors
```

### PDF parsing fails
- Ensure PDF is text-based (not scan)
- Try different PDF tool
- Check PDF file size (< 20MB recommended)

### Groq API errors
- Verify API key is correct
- Check Groq dashboard for rate limits
- Monitor token usage

---

## 📦 Deployment Checklist

- [ ] All environment variables set
- [ ] CORS configured for production domains
- [ ] Backend API tested manually
- [ ] Frontend connects to backend
- [ ] PDF parsing works
- [ ] Video search returns results
- [ ] Error handling tested
- [ ] Performance acceptable
- [ ] Logs are readable
- [ ] Deployment verified

---

## 🔐 Security Notes

### Production
- Use HTTPS only
- Restrict CORS to specific domains
- Never commit `.env` files
- Use Vercel secrets for sensitive data
- Validate all file uploads on backend
- Implement rate limiting

### Current (Development)
- CORS allows all origins
- Environment variables in plain `.env`
- No authentication required
- Use for testing only

---

## 📚 Project Structure Summary

```
Resume Agent/
├── api/              # Backend functions
├── agents/           # AI reasoning  
├── tools/            # AI tools
├── workflows/        # LangGraph workflows
├── frontend/         # Next.js app
├── config.py         # Central config
├── requirements.txt  # Python deps
├── README.md         # This file
└── .env              # Secrets
```

---

## 🎯 Next Steps

1. **Test Locally**
   - Try uploading sample resumes
   - Test with different job descriptions
   - Monitor logs for issues

2. **Optimize**
   - Adjust AI parameters in `config.py`
   - Improve video search in `tools/video_search.py`
   - Enhance UI in `frontend/components/`

3. **Deploy**
   - Push to GitHub
   - Deploy to Vercel
   - Set production environment variables
   - Monitor and iterate

4. **Scale**
   - Add user authentication
   - Implement database for history
   - Add email notifications
   - Build admin dashboard

---

## 💬 Support & Debugging

Enable detailed logs:

**Backend:**
```python
logging.basicConfig(level=logging.DEBUG)
```

**Frontend:**
- Open browser DevTools (F12)
- Check Network tab for API calls
- Check Console tab for JavaScript errors

---

**Status:** ✅ Ready for Development & Deployment!
