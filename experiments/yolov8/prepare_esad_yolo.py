import random
import shutil
from pathlib import Path
from sklearn.model_selection import train_test_split

SOURCE_DIRS = [
    Path("data/esad/set1"),
    Path("data/esad/set2")
]

SAVE_ROOT = Path("data/esad_yolo")

train_img_dir = SAVE_ROOT / "images/train"
val_img_dir = SAVE_ROOT / "images/val"

train_lbl_dir = SAVE_ROOT / "labels/train"
val_lbl_dir = SAVE_ROOT / "labels/val"

for d in [
    train_img_dir,
    val_img_dir,
    train_lbl_dir,
    val_lbl_dir
]:
    d.mkdir(parents=True, exist_ok=True)

# Collect all images
all_images = []

for folder in SOURCE_DIRS:
    all_images.extend(folder.glob("*.jpg"))

print("Total images:", len(all_images))

# 80-20 split
train_imgs, val_imgs = train_test_split(
    all_images,
    test_size=0.2,
    random_state=42,
    shuffle=True
)

def copy_samples(image_list, img_dest, lbl_dest):

    for img_path in image_list:

        stem = img_path.stem

        txt_path = img_path.with_suffix(".txt")

        # copy image
        shutil.copy2(
            img_path,
            img_dest / img_path.name
        )

        # copy label if exists
        if txt_path.exists():

            shutil.copy2(
                txt_path,
                lbl_dest / txt_path.name
            )

        else:
            # create empty txt file
            open(
                lbl_dest / f"{stem}.txt",
                "w"
            ).close()


copy_samples(
    train_imgs,
    train_img_dir,
    train_lbl_dir
)

copy_samples(
    val_imgs,
    val_img_dir,
    val_lbl_dir
)

print("Done!")