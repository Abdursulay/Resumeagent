# Resume Agent - Frontend

A modern Next.js application for CV analysis and job matching powered by AI.

## Features

- 📄 Upload CV (PDF format)
- 💼 Paste job description
- 🤖 AI-powered matching and analysis
- 📚 Personalized learning recommendations with video resources
- 🎨 Clean, modern UI with Tailwind CSS
- ⚡ Fast and responsive

## Prerequisites

- Node.js 18+ or Bun
- pnpm (package manager)

## Installation

```bash
cd frontend
pnpm install
```

## Development

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Environment Variables

Copy `.env.example` to `.env.local` and update as needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production (Vercel):
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

## Project Structure

```
frontend/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── AnalyzeForm.tsx # CV/Job description form
│   └── AnalysisResult.tsx # Results display
├── lib/               # Utilities
│   ├── api.ts        # API client functions
│   └── utils.ts      # Helper functions
└── public/            # Static files
```

## API Integration

The frontend communicates with the backend's `/api/analyze` endpoint:

**Request:**
- `POST` to `/api/analyze`
- Form data with:
  - `cv` (File, PDF)
  - `job_description` (string)

**Response:**
```json
{
  "match_score": 85,
  "reason": "Your experience aligns well with...",
  "learning_plan": [
    {
      "title": "Advanced Python",
      "video": "https://youtube.com/...",
      "thumbnail": "https://..."
    }
  ]
}
```

## Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push

# Deploy via Vercel dashboard or CLI
vercel
```

## Build

```bash
pnpm build
pnpm start
```

## Troubleshooting

### CORS Issues
Ensure your backend has CORS enabled for the frontend URL.

### API Connection Issues
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify backend is running and accessible
- Check browser console for detailed errors
