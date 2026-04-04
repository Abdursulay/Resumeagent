# Quick Deploy to Vercel

## TL;DR (5 Steps to Deploy)

### Step 1: Push to GitHub
```bash
cd c:\Users\VP\Documents\Resume Agent
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/resume-agent.git
git branch -M main
git push -u origin main
```

### Step 2: Create Google OAuth Credentials
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials (Web Application)
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Note your **Client ID** and **Client Secret**

### Step 3: Deploy Backend on Render
1. Go to [render.com](https://render.com) → "New +" → "Web Service"
2. Connect your GitHub repo
3. Set:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api.index:app --host 0.0.0.0 --port $PORT`
   - **Environment Variable**: `GROQ_API_KEY=<your-key>`
4. Deploy and copy your URL (e.g., `https://resume-agent-api.onrender.com`)

### Step 4: Deploy Frontend on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Set **Root Directory**: `frontend/`
4. Add Environment Variables:
   ```
   NEXTAUTH_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
   NEXTAUTH_URL=https://your-vercel-app-name.vercel.app
   GOOGLE_CLIENT_ID=<from Google Console>
   GOOGLE_CLIENT_SECRET=<from Google Console>
   NEXT_PUBLIC_API_URL=https://resume-agent-api.onrender.com
   FRONTEND_URL=https://your-vercel-app-name.vercel.app
   ```
5. Click "Deploy"

### Step 5: Update Google OAuth
1. Go back to Google Cloud Console
2. Add this redirect URI to your OAuth credentials:
   ```
   https://your-vercel-app-name.vercel.app/api/auth/callback/google
   ```

**Done! 🎉** Your app is now live on Vercel!

---

## Important Notes

- **Default Render Instance**: Free tier sleeps after 15 minutes. Upgrade to **Starter** ($7/mo) for production.
- **Vercel Frontend**: Free tier supports unlimited deployments.
- **GROQ API**: Get key from [console.groq.com](https://console.groq.com)
- **Vercel URL**: Will be `https://[project-name].vercel.app`

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Redirect URI mismatch" | Add exact URL to Google OAuth credentials |
| Backend timeout | Upgrade Render to Starter tier |
| API call fails (404) | Verify `NEXT_PUBLIC_API_URL` matches your Render URL |
| Session not persisting | Check `NEXTAUTH_SECRET` is set (>32 chars) |

---

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions.
