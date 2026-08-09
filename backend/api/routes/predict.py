import time

import cv2
import numpy as np

from fastapi import (
    APIRouter,
    File,
    HTTPException,
    UploadFile
)

from backend.services.predict_service import (
    predict_service
)


router = APIRouter(
    prefix="/predict",
    tags=["Prediction"]
)


@router.post("")
async def predict(
    file: UploadFile = File(...)
):
    """
    Run the complete MedSearch-RL pipeline.

    Flow:

        Image
          ↓
        Domain Detection
          ↓
        RL Localization
          ↓
        ROI Extraction
          ↓
        Classification
          ↓
        JSON
    """

    start_time = time.perf_counter()

    # ---------------------------------------------------------
    # Validate file type
    # ---------------------------------------------------------

    if not file.content_type:

        raise HTTPException(
            status_code=400,
            detail="Unable to determine uploaded file type."
        )

    allowed_types = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/bmp"
    }

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported image format. "
                "Use JPG, PNG, WEBP, or BMP."
            )
        )

    # ---------------------------------------------------------
    # Read uploaded file
    # ---------------------------------------------------------

    try:

        contents = await file.read()

    except Exception as exc:

        raise HTTPException(
            status_code=400,
            detail=f"Could not read uploaded file: {exc}"
        )

    if not contents:

        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    # ---------------------------------------------------------
    # Decode image
    # ---------------------------------------------------------

    image_array = np.frombuffer(
        contents,
        dtype=np.uint8
    )

    image = cv2.imdecode(
        image_array,
        cv2.IMREAD_UNCHANGED
    )

    if image is None:

        raise HTTPException(
            status_code=400,
            detail=(
                "The uploaded file could not be decoded "
                "as an image."
            )
        )

    # ---------------------------------------------------------
    # Run prediction
    # ---------------------------------------------------------

    try:

        result = predict_service.predict(
            image
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    except RuntimeError as exc:

        raise HTTPException(
            status_code=503,
            detail=str(exc)
        )

    except Exception as exc:

        # Keep the actual exception in the server console,
        # but don't expose internal implementation details
        # to the frontend.

        print(
            "Prediction error:",
            repr(exc)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "An error occurred while processing "
                "the image."
            )
        )

    # ---------------------------------------------------------
    # Add request metadata
    # ---------------------------------------------------------

    result["file"] = {

        "filename": file.filename,

        "content_type": file.content_type

    }

    result["request_time"] = round(
        time.perf_counter() - start_time,
        4
    )

    return result