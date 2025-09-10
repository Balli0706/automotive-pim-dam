from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
import asyncio
import os
import json
from datetime import datetime
import uuid

# AI/ML imports
from openai import AsyncOpenAI
import anthropic
from PIL import Image, ImageDraw, ImageFont
import io
import base64

app = FastAPI(
    title="Automotive PIM + DAM AI Services",
    description="AI-powered microservices for data processing, cleaning, and generation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure based on your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI clients
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
anthropic_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Pydantic models
class DataCleaningRequest(BaseModel):
    data: List[Dict[str, Any]]
    rules: Optional[Dict[str, Any]] = Field(default_factory=dict)
    auto_approve: bool = False

class DataCleaningResponse(BaseModel):
    status: str
    original_count: int
    cleaned_count: int
    errors_found: int
    suggestions: List[Dict[str, Any]]
    cleaned_data: List[Dict[str, Any]]

class LayoutGenerationRequest(BaseModel):
    brand_board_id: str
    product_ids: List[str]
    layout_type: str  # "flyer", "brochure", "datasheet"
    language: str = "de"
    prompt: Optional[str] = None

class LayoutGenerationResponse(BaseModel):
    status: str
    generation_id: str
    preview_url: Optional[str] = None
    download_urls: Dict[str, str] = Field(default_factory=dict)

class ExportRequest(BaseModel):
    export_type: str  # "tecdoc", "aces_pies", "magento", "custom"
    product_ids: List[str]
    destination: Dict[str, Any]
    format: str = "xml"
    prompt: Optional[str] = None

class ExportResponse(BaseModel):
    status: str
    export_id: str
    file_url: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "openai": bool(os.getenv("OPENAI_API_KEY")),
            "anthropic": bool(os.getenv("ANTHROPIC_API_KEY"))
        }
    }

# Data cleaning endpoints
@app.post("/v1/data/clean", response_model=DataCleaningResponse)
async def clean_data(request: DataCleaningRequest):
    """
    AI-powered data cleaning and validation
    """
    try:
        # Convert to pandas DataFrame for easier processing
        df = pd.DataFrame(request.data)
        original_count = len(df)
        
        # Initialize error tracking
        errors_found = 0
        suggestions = []
        
        # Basic data cleaning rules
        cleaned_df = df.copy()
        
        # 1. Standardize units (mm -> Millimeter, kg -> Kilogramm, etc.)
        unit_mappings = {
            'mm': 'Millimeter',
            'cm': 'Zentimeter',
            'm': 'Meter',
            'kg': 'Kilogramm',
            'g': 'Gramm',
            'l': 'Liter',
            'ml': 'Milliliter'
        }
        
        for column in cleaned_df.columns:
            if cleaned_df[column].dtype == 'object':  # String columns
                for short_unit, full_unit in unit_mappings.items():
                    mask = cleaned_df[column].astype(str).str.contains(f'\\b{short_unit}\\b', na=False, regex=True)
                    if mask.any():
                        cleaned_df.loc[mask, column] = cleaned_df.loc[mask, column].astype(str).str.replace(
                            f'\\b{short_unit}\\b', full_unit, regex=True
                        )
                        suggestions.append({
                            "type": "unit_standardization",
                            "column": column,
                            "change": f"Standardized '{short_unit}' to '{full_unit}'",
                            "affected_rows": int(mask.sum())
                        })
        
        # 2. Fix common typos and inconsistencies
        typo_fixes = {
            'lenght': 'length',
            'widht': 'width',
            'heigt': 'height',
            'weigth': 'weight',
            'colour': 'color',
            'aluminium': 'aluminum'
        }
        
        for column in cleaned_df.columns:
            if cleaned_df[column].dtype == 'object':
                for typo, correct in typo_fixes.items():
                    mask = cleaned_df[column].astype(str).str.contains(typo, na=False, case=False)
                    if mask.any():
                        cleaned_df.loc[mask, column] = cleaned_df.loc[mask, column].astype(str).str.replace(
                            typo, correct, case=False, regex=False
                        )
                        suggestions.append({
                            "type": "typo_correction",
                            "column": column,
                            "change": f"Fixed typo '{typo}' to '{correct}'",
                            "affected_rows": int(mask.sum())
                        })
        
        # 3. Validate and clean numeric fields
        numeric_columns = cleaned_df.select_dtypes(include=[np.number]).columns
        for column in numeric_columns:
            # Remove negative values where they don't make sense
            if column in ['weight', 'length', 'width', 'height', 'price']:
                negative_mask = cleaned_df[column] < 0
                if negative_mask.any():
                    cleaned_df.loc[negative_mask, column] = abs(cleaned_df.loc[negative_mask, column])
                    suggestions.append({
                        "type": "negative_value_fix",
                        "column": column,
                        "change": "Converted negative values to positive",
                        "affected_rows": int(negative_mask.sum())
                    })
        
        # 4. Remove duplicates
        initial_count = len(cleaned_df)
        cleaned_df = cleaned_df.drop_duplicates()
        final_count = len(cleaned_df)
        
        if initial_count != final_count:
            suggestions.append({
                "type": "duplicate_removal",
                "column": "all",
                "change": f"Removed {initial_count - final_count} duplicate rows",
                "affected_rows": initial_count - final_count
            })
        
        # Count total errors found
        errors_found = len(suggestions)
        
        return DataCleaningResponse(
            status="completed",
            original_count=original_count,
            cleaned_count=len(cleaned_df),
            errors_found=errors_found,
            suggestions=suggestions,
            cleaned_data=cleaned_df.to_dict('records')
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data cleaning failed: {str(e)}")

@app.post("/v1/layout/generate", response_model=LayoutGenerationResponse)
async def generate_layout(request: LayoutGenerationRequest, background_tasks: BackgroundTasks):
    """
    Generate marketing layouts using AI
    """
    try:
        generation_id = str(uuid.uuid4())
        
        # Simulate layout generation process
        background_tasks.add_task(process_layout_generation, generation_id, request)
        
        return LayoutGenerationResponse(
            status="processing",
            generation_id=generation_id,
            preview_url=None,
            download_urls={}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Layout generation failed: {str(e)}")

async def process_layout_generation(generation_id: str, request: LayoutGenerationRequest):
    """
    Background task to process layout generation
    """
    try:
        # This would integrate with actual design AI services
        # For now, create a simple mock layout
        
        # Create a simple image layout
        img = Image.new('RGB', (800, 600), color='white')
        draw = ImageDraw.Draw(img)
        
        # Add title
        try:
            font = ImageFont.truetype("arial.ttf", 40)
        except:
            font = ImageFont.load_default()
        
        draw.text((50, 50), "Automotive Product", fill='black', font=font)
        draw.text((50, 120), f"Generated Layout ID: {generation_id}", fill='gray')
        draw.text((50, 180), f"Type: {request.layout_type}", fill='gray')
        draw.text((50, 240), f"Language: {request.language}", fill='gray')
        
        # Save the image (in production, this would be saved to MinIO/S3)
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        # In production, upload to storage and return actual URLs
        print(f"Layout generation completed for {generation_id}")
        
    except Exception as e:
        print(f"Layout generation failed for {generation_id}: {str(e)}")

@app.post("/v1/export/prompt", response_model=ExportResponse)
async def prompt_based_export(request: ExportRequest, background_tasks: BackgroundTasks):
    """
    AI-guided data export based on natural language prompts
    """
    try:
        export_id = str(uuid.uuid4())
        
        # Process export in background
        background_tasks.add_task(process_export, export_id, request)
        
        return ExportResponse(
            status="processing",
            export_id=export_id,
            file_url=None,
            metadata={
                "export_type": request.export_type,
                "product_count": len(request.product_ids),
                "format": request.format
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

async def process_export(export_id: str, request: ExportRequest):
    """
    Background task to process data export
    """
    try:
        # Mock export processing
        if request.export_type == "tecdoc":
            # Generate TecDoc-compatible XML
            export_data = generate_tecdoc_xml(request.product_ids)
        elif request.export_type == "aces_pies":
            # Generate ACES/PIES format
            export_data = generate_aces_pies(request.product_ids)
        elif request.export_type == "magento":
            # Generate Magento CSV
            export_data = generate_magento_csv(request.product_ids)
        else:
            # Use AI to interpret custom prompt
            export_data = await generate_custom_export(request.prompt, request.product_ids)
        
        # In production, save to file storage and update database
        print(f"Export completed for {export_id}: {len(export_data)} bytes")
        
    except Exception as e:
        print(f"Export failed for {export_id}: {str(e)}")

def generate_tecdoc_xml(product_ids: List[str]) -> str:
    """Generate TecDoc-compatible XML"""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<TecDoc>
    <Products>
        <!-- {len(product_ids)} products would be exported here -->
    </Products>
</TecDoc>"""

def generate_aces_pies(product_ids: List[str]) -> str:
    """Generate ACES/PIES format"""
    return f"ACES/PIES format for {len(product_ids)} products"

def generate_magento_csv(product_ids: List[str]) -> str:
    """Generate Magento CSV"""
    return f"sku,name,price\\nSample data for {len(product_ids)} products"

async def generate_custom_export(prompt: str, product_ids: List[str]) -> str:
    """Use AI to generate custom export format based on prompt"""
    try:
        # Use Claude or OpenAI to interpret the prompt and generate appropriate export
        response = await anthropic_client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1000,
            messages=[{
                "role": "user",
                "content": f"Generate export data for {len(product_ids)} automotive products based on this prompt: {prompt}"
            }]
        )
        return response.content[0].text
    except Exception as e:
        return f"Custom export generation failed: {str(e)}"

# Model status endpoint
@app.get("/v1/models/status")
async def get_model_status():
    """Get status of AI models and services"""
    return {
        "openai": {
            "available": bool(os.getenv("OPENAI_API_KEY")),
            "models": ["gpt-4", "gpt-3.5-turbo", "dall-e-3"]
        },
        "anthropic": {
            "available": bool(os.getenv("ANTHROPIC_API_KEY")),
            "models": ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"]
        },
        "image_generation": {
            "available": True,
            "engines": ["PIL", "stable-diffusion"]
        }
    }

# WebSocket endpoint for real-time updates (optional)
from fastapi import WebSocket, WebSocketDisconnect

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle real-time AI processing updates
            await manager.broadcast({"message": f"Received: {data}"})
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )