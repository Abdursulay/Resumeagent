# Quick Reference

## 🚀 Start Local Development

### One-Time Setup
```bash
# Backend
pip install -r requirements.txt

# Frontend
cd frontend
pnpm install
```

### Daily Development

**Terminal 1 - Backend:**
```bash
python -m uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend && pnpm dev
```

**Open in Browser:**
```
http://localhost:3000
```

---

## 📋 Project Configuration

| Component | Location | Key File |
|-----------|----------|----------|
| **Backend Config** | Root | `config.py` |
| **Backend API** | `api/` | `index.py` |
| **Frontend Config** | `frontend/` | `next.config.ts` |
| **Frontend Page** | `frontend/app/` | `page.tsx` |
| **Components** | `frontend/components/` | `*.tsx` |
| **AI Agent** | `agents/` | `career_agent.py` |
| **Tools** | `tools/` | `resume_ops.py`, `video_search.py` |
| **Workflow** | `workflows/` | `matching_flow.py` |

---

## 🔗 Key Endpoints & URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | `http://localhost:3000` | Web app |
| Backend | `http://localhost:8000` | API server |
| API Docs | `http://localhost:8000/docs` | Swagger UI |
| Health | `http://localhost:8000/` | API health check |
| Analyze | `POST http://localhost:8000/api/analyze` | Main endpoint |

---

## 🎯 Common Tasks

### Test Backend API
```bash
curl -X GET http://localhost:8000/
```

### Test Analyze Endpoint
```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "cv=@path/to/resume.pdf" \
  -F "job_description=Software Engineer..."
```

### View Frontend Console Logs
Press `F12` in browser → Console tab

### View Backend Logs
Check terminal where `uvicorn` is running

---

## 📝 Environment Variables

### Backend (.env)
```
GROQ_API_KEY=your_key_here
SERPAPI_API_KEY=your_key_here
```

### Frontend (frontend/.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Test Your Variables
```bash
# Backend
python -c "from config import Config; print('GROQ:', Config.GROQ_API_KEY[:20]...)"

# Frontend  
echo %NEXT_PUBLIC_API_URL%
```

---

## 🐛 Debugging

### Backend Not Starting
```bash
# Check port 8000 is not in use
netstat -an | find "8000"

# Run with debug logs
python -m uvicorn api.index:app --log-level debug --reload
```

### Frontend Not Connecting
```bash
# Check if backend is running
curl http://localhost:8000

# Check env variable
cd frontend && echo $env:NEXT_PUBLIC_API_URL
```

### PDF Parsing Issues
- Ensure PDF is not scanned image
- Try different PDF
- Check PDF size (< 20MB)

---

## 📁 Important Files to Remember

```
config.py              # Change model/keys here
api/index.py           # Backend API logic
frontend/.env.local    # Frontend config
frontend/app/page.tsx  # Main UI
frontend/components/   # UI Components
requirements.txt       # Python packages
```

---

## ✅ Pre-Deployment Checklist

- [ ] Backend runs locally without errors
- [ ] Frontend loads and connects to backend
- [ ] Can upload PDF and submit job description
- [ ] API returns results with match score
- [ ] Videos display with links
- [ ] Error messages show on invalid input
- [ ] No console errors in browser
- [ ] No critical errors in backend logs

---

## 🚀 Deploy to Vercel

```bash
# From root directory
vercel

# From frontend directory for frontend only
cd frontend && vercel
```

Set environment variables in Vercel dashboard settings.

---

## 📞 Support

**Error: "Could not extract text from PDF"**
- PDF might be scanned/image-based
- Try converting to text-based PDF

**Error: "API connection failed"**
- Check backend is running
- Verify NEXT_PUBLIC_API_URL in frontend/.env.local
- Check CORS settings in backend

**Error: "Groq API error"**
- Verify GROQ_API_KEY is set
- Check Groq dashboard for rate limits
- Test key with: `curl https://api.groq.com/...`

---

**Remember:** Both backend and frontend need to be running for the app to work!
