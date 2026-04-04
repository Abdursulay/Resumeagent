# Google OAuth Setup Guide

## Overview
Your Resume Agent now includes Google OAuth authentication with session persistence. Users can sign in with their Google account and stay logged in across sessions.

## How to Set Up Google OAuth

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing):
   - Click on the project dropdown at the top
   - Click "NEW PROJECT"
   - Enter project name (e.g., "Resume Agent")
   - Click "CREATE"

3. Enable Google+ API:
   - In the left sidebar, go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click on it and select "ENABLE"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web Application"
   - Add redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for local development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
   - Click "CREATE"
   - Copy your **Client ID** and **Client Secret**

### 2. Set Up Environment Variables

1. Create a `.env.local` file in the `frontend/` directory:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and fill in:
   ```
   NEXTAUTH_SECRET=generate-a-random-32-char-string-here
   GOOGLE_CLIENT_ID=your-client-id-from-google
   GOOGLE_CLIENT_SECRET=your-client-secret-from-google
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. To generate `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```
   Or use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 3. User Flow

- **First Visit**: User lands on `/login`
- **Google Sign In**: Clicks "Sign in with Google" button
- **Authentication**: Redirected to Google login, then back to app
- **Dashboard Access**: User can now access `/upload` and `/analysis`
- **Session Persistence**: User stays logged in across page refreshes and browser sessions
- **Sign Out**: User can click profile menu and select "Sign Out"

### 4. Features Implemented

✅ Google OAuth authentication  
✅ Automatic session persistence (cookies + JWT)  
✅ Protected routes (redirect to login if not authenticated)  
✅ User profile menu with logout  
✅ User info display (name, email, profile picture)  
✅ Smooth redirects after sign in/out  

### 5. Testing Locally

1. Install dependencies and set up env variables (above)
2. Start the frontend:
   ```bash
   cd frontend
   pnpm dev
   ```
3. Open `http://localhost:3000`
4. You should be redirected to `/login`
5. Click "Sign in with Google" and authenticate
6. You'll be redirected to `/upload`
7. Your user profile appears in the top-right corner

### 6. Production Deployment

When deploying to production:

1. Update Google OAuth redirect URIs to include your production domain
2. Set environment variables on your hosting platform:
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_API_URL` (your production API URL)
3. Ensure `NEXTAUTH_URL` is set to your production domain

### 7. Troubleshooting

**"Redirect URI mismatch" error:**
- Make sure the redirect URI in Google Console matches exactly: `http://localhost:3000/api/auth/callback/google`
- Include the trailing `/google`

**"Session not persisting":**
- Ensure cookies are enabled in browser
- Check that `NEXTAUTH_SECRET` is set (must be >32 characters)
- Clear browser cache/cookies and try again

**"Google Sign In button not working":**
- Verify `GOOGLE_CLIENT_ID` is correct
- Check browser console for errors
- Ensure `/api/auth/[...nextauth]/route.ts` is properly configured

---

Feel free to customize the login page styling or add your branding to `app/login/page.tsx`.
