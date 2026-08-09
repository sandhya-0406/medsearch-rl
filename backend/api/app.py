from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.core.model_manager import model_manager

from backend.api.routes.predict import (
    router as predict_router
)

from backend.api.routes.status import (
    router as status_router
)


@asynccontextmanager
async def lifespan(app: FastAPI):

    print()
    print("=" * 60)
    print("MedSearch-RL Backend")
    print("=" * 60)

    print("\nLoading models...")

    model_manager.load_all_models()

    print("\nModel status:")

    print(
        model_manager.status()
    )

    print()
    print("=" * 60)
    print("Backend ready")
    print("=" * 60)

    yield

    print(
        "\nShutting down MedSearch-RL backend..."
    )


app = FastAPI(
    title="MedSearch-RL API",
    description=(
        "Multi-domain Deep Reinforcement Learning "
        "framework for medical object localization "
        "and classification."
    ),
    version="1.0.0",
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


app.include_router(
    predict_router,
    prefix="/api/v1"
)

app.include_router(
    status_router,
    prefix="/api/v1"
)


@app.get("/")
def root():

    return {
        "name": "MedSearch-RL",
        "status": "online",
        "version": "1.0.0"
    }