from fastapi import APIRouter

from backend.core.model_manager import (
    model_manager
)


router = APIRouter(
    prefix="/status",
    tags=["System"]
)


@router.get("")
def status():

    return {

        "success": True,

        "server": "online",

        "models": model_manager.status()

    }