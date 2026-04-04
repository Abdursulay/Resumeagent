# Resume Agent - Full Stack AI Application

A production-ready full-stack application for AI-powered resume analysis and job matching.

**Stack:**
- **Backend:** Python + FastAPI + LangGraph + Groq LLM
- **Frontend:** Next.js (React) + TypeScript + Tailwind CSS
- **Deployment:** Vercel (Frontend) + Vercel Functions (Backend)

## Project Structure

```
Resume Agent/
├── api/                    # Backend serverless functions
│   ├── index.py           # FastAPI app with /analyze endpoint
│   └── __init__.py
├── agents/                # AI agents using LangGraph
│   ├── career_agent.py   # Main reasoning agent
│   └── __init__.py
├── tools/                # Tool implementations
│   ├── resume_ops.py     # Resume analysis tools
│   ├── video_search.py   # YouTube video finder
│   └── __init__.py
├── workflows/            # LangGraph workflow definitions
│   ├── matching_flow.py  # Resume matching workflow
│   └── __init__.py
├── frontend/             # Next.js frontend app
│   ├── app/              # Route handlers and layouts
│   ├── components/       # React components
│   ├── lib/              # Utilities and API calls
│   ├── public/           # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── tailwind.config.ts
├── config.py             # Central configuration
├── requirements.txt      # Python dependencies
├── vercel.json          # Vercel deployment config
├── .env                 # Environment variables (secrets)
└── .gitignore
```

## Quick Start

### 1. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Verify environment variables
# .env should contain:
# GROQ_API_KEY=your_key
# SERPAPI_API_KEY=your_key

# Run locally
python -m uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Set environment variables
# .env.local should contain:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## Configuration

### Environment Variables

**Backend (.env):**
```env
GROQ_API_KEY=your_groq_api_key
SERPAPI_API_KEY=your_serpapi_key
```

**Frontend (frontend/.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For Vercel deployment, use environment variables in project settings.

## API Integration

The frontend communicates with the backend via the `/api/analyze` endpoint.

**Request:**
- `POST /api/analyze`
- Form data with `cv` (PDF file) and `job_description` (string)

**Response:**
```json
{
  "match_score": 85,
  "reason": "Analysis details...",
  "learning_plan": [
    {
      "title": "Skill Name",
      "video": "https://youtube.com/...",
      "thumbnail": "https://..."
    }
  ]
}
```

See [backend-api.md](./backend-api.md) for full API documentation.

## Development Features

### Logging
- Backend: Configured logging for debugging
- Frontend: Browser console for client-side debugging

### Error Handling
- Backend: HTTP error responses with detailed messages
- Frontend: User-friendly error display with recovery options

### CORS
- Backend: Enabled for all origins in development
- For production: Update to specific frontend URL

## Deployment

### Vercel (Frontend + Backend)

1. **Create a Vercel Project:**
   ```bash
   vercel
   ```

2. **Set Environment Variables:**
   - Dashboard → Settings → Environment Variables
   - Add `GROQ_API_KEY` and `SERPAPI_API_KEY`
   - Set `NEXT_PUBLIC_API_URL` to your backend URL

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Production Configuration

Update CORS in `api/index.py`:
```python
allow_origins=[
    "https://your-frontend-domain.com",
    "https://your-app.vercel.app"
]
```

## Features

### Frontend
✅ PDF file upload with validation  
✅ Job description text input  
✅ Real-time loading state  
✅ Claude-style interface  
✅ Match score with visual indicator  
✅ Learning recommendations with video links  
✅ Error handling with user feedback  
✅ Responsive design (mobile, tablet, desktop)  

### Backend
✅ PDF text extraction  
✅ AI-powered resume analysis  
✅ Job description matching  
✅ Learning path generation  
✅ Video recommendation search  
✅ FormData handling for file uploads  
✅ CORS enabled for frontend  
✅ Comprehensive error handling  

## Troubleshooting

### "Could not extract text from PDF"
- Ensure PDF is not password-protected
- Try converting PDF with different tools
- Check PDF contains text (not image-only)

### API Connection Errors
- Backend must be running on correct port (8000)
- Check `NEXT_PUBLIC_API_URL` matches backend URL
- Verify CORS is enabled on backend
- Check browser console for detailed errors

### Groq API Issues
- Verify `GROQ_API_KEY` is valid
- Check Groq API rate limits
- Ensure model name is correct

### SerpAPI Issues
- Verify `SERPAPI_API_KEY` is valid
- Check API quota
- Monitor video search tool behavior

## Support

For issues or questions:
1. Check logs in backend and browser console
2. Verify environment variables are set correctly
3. Test API endpoint directly with curl or Postman
4. Check Vercel deployment logs for production issues

## License

Internal use only.
