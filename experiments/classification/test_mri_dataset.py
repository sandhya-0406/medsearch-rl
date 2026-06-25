import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
project_root = Path.cwd()
sys.path.append(str(project_root))

from torch.utils.data import DataLoader

from backend.classification.datasets.mri_dataset import (
    MRIClassificationDataset
)

dataset = MRIClassificationDataset(

    dataset_path="data/figshare",

    train=True

)

print()

print("Classes :", dataset.CLASS_NAMES)

print("Number of Samples :", len(dataset))

loader = DataLoader(

    dataset,

    batch_size=8,

    shuffle=True

)

images, labels = next(iter(loader))

print()

print(images.shape)

print(labels)