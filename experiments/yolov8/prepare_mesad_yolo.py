import sys
from pathlib import Path
import cv2
import shutil

project_root = Path(__file__).resolve().parents[2]
sys.path.append(str(project_root))

TRAIN_IMG_DIR = Path("data/mesad/train/images")
TRAIN_ANN_DIR = Path("data/mesad/train/annotations")

VAL_IMG_DIR = Path("data/mesad/val/images")
VAL_ANN_DIR = Path("data/mesad/val/annotations")

SAVE_ROOT = Path("data/mesad_yolo")
from backend.datasets.surgical_classes import CLASS_MAP

train_img_save = SAVE_ROOT / "images/train"
val_img_save = SAVE_ROOT / "images/val"

train_lbl_save = SAVE_ROOT / "labels/train"
val_lbl_save = SAVE_ROOT / "labels/val"

for d in [
    train_img_save,
    val_img_save,
    train_lbl_save,
    val_lbl_save
]:
    d.mkdir(parents=True, exist_ok=True)

def convert_dataset(
    img_dir,
    ann_dir,
    save_img_dir,
    save_lbl_dir
):

    image_paths = list(img_dir.glob("*.jpg"))

    for img_path in image_paths:

        stem = img_path.stem

        bbox_file = ann_dir / f"{stem}.bboxes.tsv"
        label_file = ann_dir / f"{stem}.bboxes.labels.tsv"

        if not bbox_file.exists():
            continue

        img = cv2.imread(str(img_path))
        h, w = img.shape[:2]

        with open(bbox_file) as f:
            boxes = [
                line.strip()
                for line in f
                if line.strip()
            ]

        with open(label_file) as f:
            labels = [
                line.strip()
                for line in f
                if line.strip()
            ]

        yolo_lines = []

        for box, label in zip(boxes, labels):

            xmin, ymin, xmax, ymax = map(
                float,
                box.split()
            )

            x_center = ((xmin + xmax) / 2) / w
            y_center = ((ymin + ymax) / 2) / h

            bw = (xmax - xmin) / w
            bh = (ymax - ymin) / h

            class_id = CLASS_MAP[label]

            yolo_lines.append(
                f"{class_id} {x_center:.6f} {y_center:.6f} {bw:.6f} {bh:.6f}"
            )

        shutil.copy2(
            img_path,
            save_img_dir / img_path.name
        )

        with open(
            save_lbl_dir / f"{stem}.txt",
            "w"
        ) as f:

            f.write("\n".join(yolo_lines))


print("Converting train set...")

convert_dataset(
    TRAIN_IMG_DIR,
    TRAIN_ANN_DIR,
    train_img_save,
    train_lbl_save
)

print("Converting validation set...")

convert_dataset(
    VAL_IMG_DIR,
    VAL_ANN_DIR,
    val_img_save,
    val_lbl_save
)

print("MESAD YOLO conversion complete!")