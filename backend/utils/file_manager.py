import os

# Base paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
UPLOAD_DIR = os.path.join(DATA_DIR, "uploads")
MODEL_DIR = os.path.join(DATA_DIR, "models")
OUTPUT_DIR = os.path.join(DATA_DIR, "outputs")

# Ensure directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_upload_path(filename: str) -> str:
    return os.path.join(UPLOAD_DIR, filename)

def get_model_path(filename: str = "ctgan_model.pkl") -> str:
    return os.path.join(MODEL_DIR, filename)

def get_output_path(filename: str = "synthetic_dataset.csv") -> str:
    return os.path.join(OUTPUT_DIR, filename)

def list_uploads():
    return [f for f in os.listdir(UPLOAD_DIR) if f.endswith('.csv')]
