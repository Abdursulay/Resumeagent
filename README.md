# Resume Agent: AI-Powered Career Guidance

A full-stack application built with **Next.js (App Router)** and **FastAPI**. Upload your CV (PDF), paste a job description, and get instant AI feedback on your profile match along with a custom learning roadmap.

## Project Structure

- `/frontend`: Next.js frontend with `shadcn/ui` and `lucide-react`.
- `/api`: FastAPI backend with `PyPDF2` for resume text extraction.
- `/workflows`: LangGraph agentic workflow for resume analysis and video searching.
- `/tools`: Custom tools for JD comparison and YouTube video lookup.

## Key Features

- **Claude-style UI**: Clean, minimalist, and responsive design.
- **Agentic Workflow**: Uses LangChain and Groq for intelligent resume-to-JD gap analysis.
- **Automated Learning Plan**: Searches for relevant YouTube tutorials based on missing skills.
- **Serverless Ready**: Designed for Vercel (Front-end) and easily portable back-end.

## Setup & Research

Detailed implementation logs and findings can be found in [WALKTHROUGH.md](./WALKTHROUGH.md).

---

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev
```

### Backend Setup
```bash
# Using Python 3.x
pip install -r requirements.txt
python api/index.py
```

### Environment Variables
Configure a `.env` file in the root with:
- `GROQ_API_KEY`: Your Groq API key.
- `SERPAPI_API_KEY`: Your SerpAPI key for video searching.
