import os
import sys
from pathlib import Path

# Add the project root to sys.path so Vercel can find 'workflows', 'agents', etc.
project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.append(str(project_root))

from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from pydantic import BaseModel
from workflows.matching_flow import app as graph_app
from langchain_core.messages import HumanMessage, ToolMessage
import re
import ast
import PyPDF2
import io

# Initialize FastAPI
app = FastAPI()

@app.get("/")
def home():
    return {"message": "Career Coach AI is running!"}

def parse_response(final_response: str, messages: list) -> dict:
    # ... (same as before)
    score_match = re.search(r'(\d+)%', final_response)
    score = int(score_match.group(1)) if score_match else 0
    reason = final_response.strip()
    videos = []
    for msg in messages:
        if isinstance(msg, ToolMessage):
            try:
                video_data = ast.literal_eval(msg.content)
                if isinstance(video_data, list):
                    videos = [
                        {
                            "title": v.get("title", ""),
                            "video": v.get("link", ""),
                            "thumbnail": v.get("thumbnail", "")
                        }
                        for v in video_data if isinstance(v, dict) and v.get("link")
                    ]
                    if videos:
                        break
            except (ValueError, SyntaxError):
                pass
    if not videos:
        video_pattern = r'\*\s*([^\n]+?):\s*(https://www\.youtube\.com/watch\?v=[^\s]+)'
        matches = re.findall(video_pattern, final_response)
        for title, link in matches:
            videos.append({
                "title": title.strip(),
                "video": link,
                "thumbnail": ""
            })
    return {
        "match_score": score,
        "reason": reason,
        "learning_plan": videos
    }

@app.post("/analyze")
async def analyze_career(cv: UploadFile = File(...), job_description: str = Form(...)):
    """
    Endpoint that handles PDF upload and triggers the Agent Workflow.
    """
    try:
        # 1. Read the PDF content
        pdf_content = await cv.read()
        
        # 2. Extract text from PDF using PyPDF2
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
        resume_text = ""
        for page in pdf_reader.pages:
            resume_text += page.extract_text() or ""
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the PDF.")

        # 3. Create the initial prompt for the agent
        initial_prompt = (
            f"Here is a Job Description: {job_description} \n\n"
            f"Here is a Resume: {resume_text} \n\n"
            "Step 1: Compare them and calculate a percentage match score. "
            "Step 2: If the score is under 100%, identify the TOP missing skill. "
            "Step 3: Use the video tool to find 3 specific YouTube videos for that missing skill. "
            "Step 4: Final output should be the Score, the Reasoning, and the Video Links."
        )
        
        inputs = {"messages": [HumanMessage(content=initial_prompt)]}
        
        # 4. Run the graph
        result = graph_app.invoke(inputs)
        final_response = result["messages"][-1].content
        structured_response = parse_response(final_response, result["messages"])
        
        return structured_response

    except Exception as e:
        import traceback
        print(f"[ERROR] Backend failure:\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))
