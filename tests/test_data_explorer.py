import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
project_root = Path.cwd()
sys.path.append(str(project_root))
from backend.datasets.unified_dataset import UnifiedDataset

dataset = UnifiedDataset(
    mri_path=PROJECT_ROOT / "data" / "figshare",
    esad_path=PROJECT_ROOT / "data" / "esad",
    mesad_path=PROJECT_ROOT / "data" / "mesad"
)
from backend.validation.dataset_explorer import explore_dataset

explore_dataset(dataset)