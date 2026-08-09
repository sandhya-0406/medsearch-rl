from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.router import api_router
from backend.core.startup import lifespan


app = FastAPI(
    title="MedSearch-RL Backend",
    description="Multi-Domain Medical AI Backend using Deep Reinforcement Learning",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "project": "MedSearch-RL",
        "status": "Running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }