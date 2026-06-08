import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

# print(PROJECT_ROOT)
# print(PROJECT_ROOT / "data" / "esad")
# print((PROJECT_ROOT / "data" / "esad" / "obj.names").exists())

project_root = Path.cwd()
sys.path.append(str(project_root))

from backend.datasets.mri_loader import load_sample
from backend.validation.validator import validate_random_samples
from backend.datasets.unified_dataset import UnifiedDataset

dataset = UnifiedDataset(
    mri_path=PROJECT_ROOT / "data" / "figshare",
    esad_path=PROJECT_ROOT / "data" / "esad",
    mesad_path=PROJECT_ROOT / "data" / "mesad"
)



# sample = dataset[0]

# print(sample["domain"])
# print(sample["image"].shape)
# print(sample["image"].dtype)
# print(sample["image"].min())
# print(sample["image"].max())
sample = dataset[0]

print(sample.keys())
print(sample["domain"])
print(sample["labels"])

# validate_random_samples(dataset, 1000)