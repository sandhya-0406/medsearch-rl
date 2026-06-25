import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
project_root = Path.cwd()
sys.path.append(str(project_root))

from torch.utils.data import DataLoader

from backend.classification.datasets.unified_classification_dataset import (

    UnifiedClassificationDataset

)


dataset = UnifiedClassificationDataset(

    dataset_type="mri",

    mri_path="data/figshare"

)

print()

print(

    dataset.class_names

)

print(

    len(dataset)

)

loader = DataLoader(

    dataset,

    batch_size=8,

    shuffle=True

)

images, labels = next(

    iter(loader)

)

print(images.shape)

print(labels)