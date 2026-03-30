import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.3"
    HUGGINGFACEHUB_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")