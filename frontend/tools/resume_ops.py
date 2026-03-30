from langchain.tools import tool

@tool
def compare_jds_tool(resume_text: str, job_description: str):
    """
    Compares a resume against a job description.
    Returns a formatted string with the resume content and job description for analysis.

    """
    return f"RESUME_CONTENT: {resume_text}\n\nTARGET_JOB: {job_description}"