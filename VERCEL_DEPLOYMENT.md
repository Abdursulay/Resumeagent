# Vercel Deployment Guide for Resume Agent

## Overview
This guide covers deploying the **Next.js Frontend** on Vercel and the **FastAPI Backend** on Render (or alternative service).

---

## Part 1: Deploy Frontend on Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub, GitLab, or email
3. Create a free account

### Step 2: Push Your Code to GitHub
1. Initialize git repo (if not already done):
   ```bash
   cd "c:\Users\VP\Documents\Resume Agent"
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a GitHub repo:
   - Go to [github.com/new](https://github.com/new)
   - Create a new repository
   - Follow the commands to push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/resume-agent.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Paste your GitHub repo URL and click "Import"
4. Set **Root Directory** to `frontend/`
5. Click "Environment Variables" and add:

   ```
   NEXTAUTH_SECRET=<your-generated-secret>
   NEXTAUTH_URL=https://your-vercel-app.vercel.app
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   NEXT_PUBLIC_API_URL=https://your-backend-api.com
   ```

6. Click "Deploy"
7. Wait for build to complete (~2-3 minutes)

> **Note**: Replace placeholders with actual values from Google Cloud Console and your backend URL

### Generate NEXTAUTH_SECRET
Run this in PowerShell:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Part 2: Deploy Backend on Render

### Step 1: Prepare Backend for Production

1. Create `requirements.txt` in root (already exists, verify it has all dependencies):
   ```
   fastapi
   uvicorn[standard]
   PyPDF2
   langchain
   langchain-groq
   langgraph
   python-multipart
   ```

2. Create `Procfile` for Render:
   ```
   web: uvicorn api.index:app --host 0.0.0.0 --port $PORT
   ```

3. Ensure `api/index.py` has proper CORS for production:
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "http://localhost:3000",
           "https://your-vercel-app.vercel.app",  # Add your Vercel URL
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Set up the service:
   - **Name**: `resume-agent-api`
   - **Root Directory**: (leave blank or `.`)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api.index:app --host 0.0.0.0 --port $PORT`

5. Add Environment Variables:
   ```
   GROQ_API_KEY=<your-groq-api-key>
   MODEL_NAME=meta-llama/llama-4-scout-17b-16e-instruct
   ```

6. Select "Free" tier (if testing) or "Starter" for production
7. Click "Create Web Service"
8. Wait for deployment (~3-5 minutes)

9. Copy your Render URL (e.g., `https://resume-agent-api.onrender.com`)

### Step 3: Update Vercel Frontend with Backend URL

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Update `NEXT_PUBLIC_API_URL` to your Render URL:
   ```
   NEXT_PUBLIC_API_URL=https://resume-agent-api.onrender.com
   ```
5. Click "Save"
6. Trigger a redeploy: Go to "Deployments" → Click "..." → "Redeploy"

---

## Part 3: Update Google OAuth for Production

Since your Vercel URL will be different from localhost, update Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Click on your OAuth credential
5. Add your Vercel redirect URI under "Authorized redirect URIs":
   ```
   https://your-vercel-app.vercel.app/api/auth/callback/google
   ```
6. Click "Save"

---

## Part 4: Verify Everything Works

1. Go to your Vercel deployment URL
2. You should land on the login page
3. Click "Sign in with Google"
4. Complete authentication
5. Upload a resume and test the analysis
6. Check that the backend API calls are successful

---

## Troubleshooting

### 500 Error on Frontend
- Check Vercel deployment logs: Dashboard → Project → Deployments → View Logs
- Verify all environment variables are set

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check Render backend logs
- Ensure CORS is enabled in `api/index.py`
- Verify Groq API key is valid

### Google Sign-In Not Working
- Confirm redirect URI is added to Google Cloud Console
- Check that `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` are set
- Clear browser cookies and try again

### Backend Timeout
- Render free tier may sleep after 15 minutes of inactivity
- Upgrade to Starter tier for always-on service
- Or use alternative: Railway, Fly.io, or AWS Lambda

---

## Production Checklist

- ✅ Frontend pushed to GitHub
- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on Render
- ✅ Environment variables configured on both platforms
- ✅ Google OAuth redirect URIs updated
- ✅ CORS enabled for production domain
- ✅ API URL updated in Vercel
- ✅ Tested end-to-end flow

---

## Monitoring & Maintenance

### View Logs
- **Vercel**: Dashboard → Project → Deployments → Build Logs or Runtime Logs
- **Render**: Dashboard → Project → Logs

### Rebuild / Redeploy
- **Vercel**: Push new commit to GitHub (automatic) or manual redeploy
- **Render**: Make a git commit and push, or manual retrigger via dashboard

### Scale Up
- **Vercel**: Automatically scales; upgrade for more concurrent builds
- **Render**: Upgrade instance type for better performance

---

## Alternative Backend Deployments

If Render doesn't work for you, try:

| Platform | Free Tier | Always-On | Setup Difficulty |
|----------|-----------|-----------|------------------|
| **Render** | Yes (sleeps) | No | Easy |
| **Railway** | Yes | Yes (limited hours) | Easy |
| **Fly.io** | Yes | Yes | Medium |
| **AWS Lambda** | Yes (1M requests) | Yes | Hard |
| **Heroku** | No (paid) | Yes | Easy |
| **PythonAnywhere** | Yes | Yes | Medium |

---

## Quick Redeploy Command (After Making Changes)

```bash
git add .
git commit -m "Update: your changes here"
git push origin main
```

Vercel will automatically rebuild and redeploy within 1-2 minutes.
