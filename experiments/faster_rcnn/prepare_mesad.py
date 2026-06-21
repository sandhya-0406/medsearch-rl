import pickle
import shutil
from pathlib import Path
import sys


project_root = Path(__file__).resolve().parents[2]
sys.path.append(str(project_root))

import cv2
from tqdm import tqdm

from backend.datasets.mesad_loader import MESADLoader
from backend.preprocessing.pipeline import preprocess_sample

DATASET_PATH = "data/mesad"

OUTPUT_DIR = Path(
    "data/mesad_frcnn"
)

IMAGE_DIR = OUTPUT_DIR / "images"

IMAGE_DIR.mkdir(
    parents=True,
    exist_ok=True
)

loader = MESADLoader(
    DATASET_PATH
)

annotations = []

for i in tqdm(range(len(loader))):

    sample = loader.load_sample(i)

    sample = preprocess_sample(sample)

    image_name = f"{i:06d}.jpg"

    image = sample["image"]

    image = (image * 255).astype("uint8")

    image_path = IMAGE_DIR / image_name

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
    "mesad_frcnn",
    "zip",
    OUTPUT_DIR
)

print("Done!")