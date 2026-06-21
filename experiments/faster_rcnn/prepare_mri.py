import pickle
import sys
import cv2
from pathlib import Path

import shutil

project_root = Path(__file__).resolve().parents[2]
sys.path.append(str(project_root))

from backend.datasets.mri_loader import (
    get_all_mat_files,
    load_sample
)

from backend.preprocessing.pipeline import preprocess_sample

OUTPUT_DIR = Path(
    "data/mri_frcnn"
)

IMAGE_DIR = OUTPUT_DIR / "images"

IMAGE_DIR.mkdir(
    parents=True,
    exist_ok=True
)

annotations = []

mat_files = get_all_mat_files(
    "data/figshare"
)

for i, mat_file in enumerate(mat_files):

    sample = load_sample(mat_file)

    sample = preprocess_sample(sample)

    image_name = f"{i:06d}.png"

    image_path = IMAGE_DIR / image_name

    image = sample["image"]

    cv2.imwrite(
        str(image_path),
        cv2.cvtColor(
            image,
            cv2.COLOR_RGB2BGR
        )
    )

    annotations.append(
        {
            "image_name": image_name,
            "boxes": sample["boxes"],
            "labels": sample["labels"]
        }
    )

with open(
    OUTPUT_DIR / "annotations.pkl",
    "wb"
) as f:

    pickle.dump(
        annotations,
        f
    )

shutil.make_archive(
    "mri_frcnn",
    "zip",
    OUTPUT_DIR
)