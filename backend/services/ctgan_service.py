import pandas as pd
import pickle
import os
from sdv.single_table import CTGANSynthesizer
from sdv.metadata import SingleTableMetadata
from utils.file_manager import get_model_path, get_output_path

class CTGANService:
    def __init__(self):
        self.model = None
        self.metadata = None
        self.model_path = get_model_path()

    def train_model(self, csv_path: str, epochs: int, drop_duplicates: bool, drop_nulls: bool):
        # 1. Load Data
        df = pd.read_csv(csv_path)

        # 2. Preprocessing
        if drop_duplicates:
            df = df.drop_duplicates()
        
        if drop_nulls:
            df = df.dropna()

        # 3. Detect Metadata
        metadata = SingleTableMetadata()
        metadata.detect_from_dataframe(df)

        # 4. Initialize and Train CTGAN
        # verbose=True to see progress in logs
        synthesizer = CTGANSynthesizer(metadata, epochs=epochs, verbose=True)
        synthesizer.fit(df)

        # 5. Save Model
        self.model = synthesizer
        synthesizer.save(self.model_path)
        
        return {"message": "Model trained successfully", "model_path": self.model_path}

    def load_model(self):
        if os.path.exists(self.model_path):
            self.model = CTGANSynthesizer.load(self.model_path)
            return True
        return False

    def generate_data(self, num_rows: int):
        # Ensure model is loaded
        if self.model is None:
            if not self.load_model():
                raise Exception("Model not found. Please train first.")

        # Generate synthetic data
        synthetic_data = self.model.sample(num_rows=num_rows)
        
        # Save to CSV
        output_path = get_output_path()
        synthetic_data.to_csv(output_path, index=False)

        return {
            "message": "Synthetic dataset generated",
            "rows": len(synthetic_data),
            "output_path": output_path
        }

ctgan_service = CTGANService()
