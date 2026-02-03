from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import shutil
import os
import pandas as pd

from utils.file_manager import get_upload_path, get_model_path, get_output_path
from services.ctgan_service import ctgan_service

app = FastAPI(title="Synthetic Data Generator API")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class TrainRequest(BaseModel):
    epochs: int = 200
    dropDuplicates: bool = False
    dropNulls: bool = False

class GenerateRequest(BaseModel):
    numRows: int = 100

# Global state to track last uploaded file
# In a real app, this should be per-user or session-based (passed via ID)
# For this simple requirement, we'll store the filename of the last upload.
last_uploaded_file = None

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    global last_uploaded_file
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    file_location = get_upload_path(file.filename)
    
    with open(file_location, "wb+") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    last_uploaded_file = file_location
    
    # Get basic stats
    try:
        df = pd.read_csv(file_location)
        rows, cols = df.shape
        columns = df.columns.tolist()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV file: {str(e)}")

    return {
        "message": "File uploaded successfully",
        "filename": file.filename,
        "columns": columns,
        "rows": rows
    }

@app.post("/api/train")
async def train_model(request: TrainRequest):
    global last_uploaded_file
    
    # Robustness: If variable lost (restart), check directory
    if not last_uploaded_file or not os.path.exists(last_uploaded_file):
        from utils.file_manager import list_uploads, get_upload_path
        uploads = list_uploads()
        if uploads:
            # Pick the most recent one or just the first one
            last_uploaded_file = get_upload_path(uploads[-1])
            
    if not last_uploaded_file or not os.path.exists(last_uploaded_file):
        raise HTTPException(status_code=400, detail="No dataset uploaded. Please upload a CSV first.")
    
    try:
        result = ctgan_service.train_model(
            csv_path=last_uploaded_file,
            epochs=request.epochs,
            drop_duplicates=request.dropDuplicates,
            drop_nulls=request.dropNulls
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

@app.post("/api/generate")
async def generate_data(request: GenerateRequest):
    try:
        result = ctgan_service.generate_data(num_rows=request.numRows)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@app.get("/api/download/synthetic")
async def download_synthetic():
    file_path = get_output_path()
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Synthetic dataset not found. Please generate first.")
    return FileResponse(file_path, filename="synthetic_dataset.csv", media_type='text/csv')

@app.get("/api/download/model")
async def download_model():
    file_path = get_model_path()
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Model not found. Please train first.")
    return FileResponse(file_path, filename="ctgan_model.pkl", media_type='application/octet-stream')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
