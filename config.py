import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MODEL_NAME = "meta-llama/llama-4-scout-17b-16e-instruct"
    HUGGINGFACEHUB_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")