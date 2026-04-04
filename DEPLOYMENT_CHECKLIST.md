# Resume Agent - Deployment Checklist

## Pre-Deployment Setup

### ✅ Local Testing
- [ ] Backend runs locally: `python -m uvicorn api.index:app --reload`
- [ ] Frontend runs locally: `cd frontend && pnpm dev`
- [ ] Can upload resume and get analysis results
- [ ] Google Sign-in works on `http://localhost:3000/login`

### ✅ GitHub Setup
- [ ] Code pushed to GitHub repository
- [ ] `.gitignore` properly excludes `.env`, `node_modules/`, `__pycache__/`, `venv/`
- [ ] Repository is public (for free Vercel/Render deployments)

### ✅ Google Cloud Setup
- [ ] Google OAuth credentials created
- [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` noted
- [ ] Localhost redirect URI added: `http://localhost:3000/api/auth/callback/google`

### ✅ GROQ Setup
- [ ] Groq account created at [console.groq.com](https://console.groq.com)
- [ ] API key generated and saved
- [ ] Model: `meta-llama/llama-4-scout-17b-16e-instruct` confirmed

---

## Deployment Steps

### Step 1: Backend Deployment (Render)
- [ ] Go to [render.com](https://render.com)
- [ ] Create new Web Service from GitHub
- [ ] Set build command: `pip install -r requirements.txt`
- [ ] Set start command: `uvicorn api.index:app --host 0.0.0.0 --port $PORT`
- [ ] Add `GROQ_API_KEY` environment variable
- [ ] Add `FRONTEND_URL` environment variable (update after frontend deploys)
- [ ] Deploy and copy URL
- [ ] Wait for "Your service is live" message (~3-5 minutes)

### Step 2: Frontend Deployment (Vercel)
- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Import GitHub repository
- [ ] Set root directory: `frontend/`
- [ ] Add environment variables:
  - `NEXTAUTH_SECRET` (generate new)
  - `NEXTAUTH_URL` (your Vercel URL)
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `NEXT_PUBLIC_API_URL` (your Render URL)
  - `FRONTEND_URL` (same as `NEXTAUTH_URL`)
- [ ] Deploy
- [ ] Wait for deployment to complete (~2-3 minutes)

### Step 3: Post-Deployment Configuration
- [ ] Update Google OAuth redirect URIs:
  - Add: `https://your-vercel-app.vercel.app/api/auth/callback/google`
- [ ] Update Render backend CORS (should auto-detect with `FRONTEND_URL`)
- [ ] Test login flow on production URL
- [ ] Test resume upload and analysis

---

## Testing Production

### Smoke Tests
- [ ] Visit frontend URL (should not have errors)
- [ ] Click "Get Started" (should go to login)
- [ ] Sign in with Google
- [ ] Upload resume and job description
- [ ] Click "Analyze Resume"
- [ ] Verify analysis appears with match score
- [ ] Click user menu and "Sign Out"
- [ ] Verify redirected to home page

### Common Issues During Testing
| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| 500 error on frontend | Missing env vars | Check Vercel env vars |
| API 404 error | Wrong backend URL | Verify `NEXT_PUBLIC_API_URL` |
| Google login fails | CORS issue | Add Vercel URL to Render `FRONTEND_URL` |
| Timeout on analysis | Render free tier sleeping | Upgrade to Starter tier |
| Session lost on refresh | `NEXTAUTH_SECRET` missing | Regenerate and set in Vercel |

---

## Production Environment Variables Needed

### Vercel Frontend
```
NEXTAUTH_SECRET=<32+ char random string>
NEXTAUTH_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=<from Google Console>
GOOGLE_CLIENT_SECRET=<from Google Console>
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
FRONTEND_URL=https://your-app.vercel.app
```

### Render Backend
```
GROQ_API_KEY=<from console.groq.com>
FRONTEND_URL=https://your-app.vercel.app
```

---

## Monitoring

After deployment, monitor:
- **Vercel Logs**: vercel.com → project → deployments → runtime logs
- **Render Logs**: render.com → project → logs
- **Errors**: Check browser console (F12) for client-side issues

---

## Auto-Redeploy After Changes

Once deployed, any push to `main` branch will automatically trigger redeployment:

```bash
git add .
git commit -m "Your change description"
git push origin main
```

Vercel will rebuild in ~2-3 minutes, Render in ~1-3 minutes.

---

## Estimated Costs

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| **Vercel** | Free | $0/mo | Frontend CDN, unlimited builds |
| **Render** | Free | $0/mo | 750 free hours/month (sleeps) |
| **Render** | Starter | $7/mo | Always-on, better for production |
| **Google Cloud** | Free | $0/mo | 300 free credits for 3 months |
| **Groq API** | Free | $0/mo | Limited requests, great for testing |

**Recommended Production Setup**: Vercel Free + Render Starter = ~$7/month

---

## Rollback Instructions

If something breaks in production:

1. **Vercel**: Go to Deployments → find last working version → click "..." → "Redeploy"
2. **Render**: Go to Deploys → select previous working deployment → "Redeploy"

---

For detailed instructions, see:
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Full deployment guide
- [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - Quick 5-step summary
- [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) - OAuth configuration
