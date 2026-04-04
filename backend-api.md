# Backend API Documentation

## Endpoint

### POST /api/analyze

Analyzes a resume against a job description and returns a match score with learning recommendations.

**URL:** `/api/analyze`  
**Method:** `POST`  
**Content-Type:** `multipart/form-data`

### Request

```
Form Data:
- cv (File, required): PDF file of the resume
- job_description (string, required): Job description text
```

**Example with cURL:**
```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "cv=@resume.pdf" \
  -F "job_description=Software Engineer role focusing on Python and FastAPI..."
```

**Example with fetch (as used in frontend):**
```javascript
const formData = new FormData();
formData.append('cv', pdfFile);
formData.append('job_description', jobDescriptionText);

fetch('http://localhost:8000/api/analyze', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log(data))
```

### Response

**Status:** 200 OK

```json
{
  "match_score": 85,
  "reason": "Your experience aligns well with the role. You have strong Python and FastAPI experience. Missing skills include Docker and Kubernetes orchestration.",
  "learning_plan": [
    {
      "title": "Docker for Beginners",
      "video": "https://www.youtube.com/watch?v=...",
      "thumbnail": "https://..."
    },
    {
      "title": "Kubernetes Essential",
      "video": "https://www.youtube.com/watch?v=...",
      "thumbnail": "https://..."
    }
  ]
}
```

### Error Responses

**400 Bad Request** - Missing or invalid file:
```json
{
  "detail": "Could not extract text from the PDF."
}
```

**400 Bad Request** - Missing required field:
```json
{
  "detail": "cv: required"
}
```

**500 Internal Server Error**:
```json
{
  "detail": "Internal server error message"
}
```

## CORS Support

The backend has CORS enabled for all origins (`*`). In production, restrict to specific frontend URLs:

```python
allow_origins=[
    "https://yourdomain.com",
    "https://app.yourdomain.com"
]
```

## Requirements

- Python 3.9+
- FastAPI
- PyPDF2 (for PDF text extraction)
- python-multipart (for form data handling)
- Groq API Key (for LLM)
- SerpAPI Key (for video search)

## Environment Variables

```env
GROQ_API_KEY=your_groq_api_key
SERPAPI_API_KEY=your_serpapi_key
```

## Running the Backend

### Local Development

```bash
cd /path/to/backend
python -m uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
```

### Production (Vercel)

```bash
vercel
```

The backend uses Python runtime on Vercel with the `vercel.json` configuration.
