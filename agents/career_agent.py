from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.messages import SystemMessage

# IMPORT CONFIG HERE
from config import Config

from tools.resume_ops import compare_jds_tool
from tools.video_search import find_youtube_videos_tool

# Initialize Hugging Face Endpoint
# Note: For tool calling, ensure the model supports it (e.g. Mistral-7B-Instruct-v0.3)
hf_llm = HuggingFaceEndpoint(
    repo_id=Config.MODEL_NAME,
    huggingfacehub_api_token=Config.HUGGINGFACEHUB_API_TOKEN,
    temperature=0.1,
)

# Initialize ChatHuggingFace for message-based interaction and tool binding
llm = ChatHuggingFace(llm=hf_llm)

# Bind the tools
tools = [compare_jds_tool, find_youtube_videos_tool]
llm_with_tools = llm.bind_tools(tools)

def career_node(state):
    """
    Decides the next step: Analyze Resume OR Search for Videos.
    """
    return {"messages": [llm_with_tools.invoke(state["messages"])]}
