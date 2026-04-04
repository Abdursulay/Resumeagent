from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage

# IMPORT CONFIG HERE
from config import Config

from tools.resume_ops import compare_jds_tool
from tools.video_search import find_youtube_videos_tool

# Initialize Groq LLM
# Note: meta-llama/llama-4-scout-17b-16e-instruct is used for tool calling capabilities
llm = ChatGroq(
    api_key=Config.GROQ_API_KEY,
    model_name=Config.MODEL_NAME,
    temperature=0.1,
)

# Bind the tools
tools = [compare_jds_tool, find_youtube_videos_tool]
llm_with_tools = llm.bind_tools(tools)

def career_node(state):
    """
    Decides the next step: Analyze Resume OR Search for Videos.
    """
    return {"messages": [llm_with_tools.invoke(state["messages"])]}
