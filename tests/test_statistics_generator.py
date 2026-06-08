import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
project_root = Path.cwd()
sys.path.append(str(project_root))

from backend.validation.annotation_verifier import verify_random_samples
from backend.datasets.unified_dataset import UnifiedDataset
from backend.validation.statistics_generator import (
    generate_statistics
)

dataset = UnifiedDataset(
    mri_path=PROJECT_ROOT / "data" / "figshare",
    esad_path=PROJECT_ROOT / "data" / "esad",
    mesad_path=PROJECT_ROOT / "data" / "mesad"
)



generate_statistics(dataset)