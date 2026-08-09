import cv2
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
project_root = Path.cwd()
sys.path.append(str(project_root))
from backend.core.model_manager import (
    model_manager
)

from backend.services.predict_service import (
    predict_service
)


# =========================================================
# LOAD MODELS
# =========================================================

print()
print("=" * 70)
print("LOADING MEDICAL MODELS")
print("=" * 70)

model_manager.load_all_models()

print()

print(
    "Loaded agents:",
    list(model_manager.agents.keys())
)

print(
    "Loaded classifiers:",
    list(model_manager.classifiers.keys())
)


# =========================================================
# TEST IMAGE
# =========================================================

IMAGE_PATH = (
    r"E:\sandyyyy\Mini project\MedSearch-RL\data\brain_yolo\images\train\mri_5.jpg"
)


# =========================================================
# LOAD IMAGE
# =========================================================

image = cv2.imread(
    IMAGE_PATH
)

if image is None:

    raise FileNotFoundError(
        f"Could not load image:\n{IMAGE_PATH}"
    )


print()
print("=" * 70)
print("MEDSEARCH-RL COMPLETE PIPELINE TEST")
print("=" * 70)

print(
    "Image:",
    IMAGE_PATH
)

print(
    "Shape:",
    image.shape
)


# =========================================================
# PREDICT
# =========================================================

print()
print("Running complete pipeline...")
print()


result = predict_service.predict(
    image
)


# =========================================================
# DOMAIN
# =========================================================

print("=" * 70)
print("DOMAIN")
print("=" * 70)

print(
    "Domain:",
    result["domain"]["name"]
)

print(
    "Confidence:",
    result["domain"]["confidence"]
)

print(
    "Scores:",
    result["domain"]["scores"]
)


# =========================================================
# LOCALIZATION
# =========================================================

print()
print("=" * 70)
print("LOCALIZATION")
print("=" * 70)

print(
    "Bounding Box:",
    result[
        "localization"
    ]["bbox"]
)

print(
    "Steps:",
    result[
        "localization"
    ]["steps"]
)

print(
    "Processing Time:",
    result[
        "localization"
    ]["processing_time"]
)


# =========================================================
# CLASSIFICATION
# =========================================================

print()
print("=" * 70)
print("CLASSIFICATION")
print("=" * 70)

print(
    "Class:",
    result[
        "classification"
    ]["class_name"]
)

print(
    "Confidence:",
    result[
        "classification"
    ]["confidence"]
)

print(
    "Top 5:",
    result[
        "classification"
    ]["top_5"]
)


# =========================================================
# TOTAL
# =========================================================

print()
print("=" * 70)
print("TOTAL")
print("=" * 70)

print(
    "Total Processing Time:",
    result[
        "processing_time"
    ]
)

print("=" * 70)