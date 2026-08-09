from pathlib import Path

# ==========================
# Base Paths
# ==========================

BASE_DIR = Path(__file__).resolve().parent.parent

WEIGHTS_DIR = BASE_DIR / "weights"

UPLOAD_DIR = BASE_DIR / "storage" / "uploads"

EXPORT_DIR = BASE_DIR / "storage" / "exports"

TEMP_DIR = BASE_DIR / "storage" / "temp"

LOG_DIR = BASE_DIR / "logs"


# ==========================
# Device
# ==========================

import torch

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# ==========================
# RL Agent Checkpoints
# ==========================

MODEL_PATHS = {
    "MRI": {
        "agent": WEIGHTS_DIR / "agents" / "mri_agent.pth",
        "classifier": WEIGHTS_DIR / "classifiers" / "mri_classifier.pth",
    },
    "ESAD": {
        "agent": WEIGHTS_DIR / "agents" / "esad_agent.pth",
        "classifier": WEIGHTS_DIR / "classifiers" / "esad_classifier.pth",
    },
    "MESAD": {
        "agent": WEIGHTS_DIR / "agents" / "mesad_agent.pth",
        "classifier": WEIGHTS_DIR / "classifiers" / "mesad_classifier.pth",
    },
}

NUM_CLASSES = {

    "MRI": 3,

    "ESAD": 21,

    "MESAD": 21

}