import os
from google.cloud import aiplatform, bigquery, storage
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
PROJECT_NAME = 'MLB Prospect Predictor'
PROJECT_ID = 'mlb-prospect-predictor-001'
REGION = 'us-west1'
BUCKET_NAME = f'{PROJECT_ID}-mlb-prospects'

def init_vertex_ai():
    """Initialize Vertex AI client"""
    aiplatform.init(
        project=PROJECT_ID,
        location=REGION,
    )

def init_bigquery():
    """Initialize BigQuery client"""
    return bigquery.Client(project=PROJECT_ID)

def init_storage():
    """Initialize Cloud Storage client"""
    return storage.Client(project=PROJECT_ID)

def verify_setup():
    """Verify all cloud services are properly configured"""
    try:
        print(f"Checking configuration for project: {PROJECT_ID}")
        bq_client = init_bigquery()
        storage_client = init_storage()
        init_vertex_ai()
        print("✅ Google Cloud setup verified")
        return True
    except Exception as e:
        print(f"❌ Setup error: {str(e)}")
        return False

if __name__ == "__main__":
    verify_setup()