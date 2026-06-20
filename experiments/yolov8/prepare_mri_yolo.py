import sys
from pathlib import Path
import cv2
from sklearn.model_selection import train_test_split

project_root = Path(__file__).resolve().parents[2]
sys.path.append(str(project_root))


from backend.datasets.mri_loader import (
    get_all_mat_files,
    load_sample
)


SAVE_ROOT = Path("data/brain_yolo")

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


mat_files = get_all_mat_files("data/figshare")

train_files, val_files = train_test_split(
    mat_files,
    test_size=0.2,
    random_state=42,
    shuffle=True
)


def convert_box(box, w, h):

    xmin, ymin, xmax, ymax = box

    x_center = (xmin + xmax) / 2
    y_center = (ymin + ymax) / 2

    bw = xmax - xmin
    bh = ymax - ymin

    return (
        x_center / w,
        y_center / h,
        bw / w,
        bh / h
    )

def prepare_image(image):

    image = image.astype("float32")

    image -= image.min()

    if image.max() > 0:
        image /= image.max()

    image = (255 * image).astype("uint8")

    image = cv2.cvtColor(
        image,
        cv2.COLOR_GRAY2BGR
    )

    return image

def save_samples(file_list, image_dir, label_dir):

    for idx, mat_path in enumerate(file_list):

        sample = load_sample(mat_path)

        image = sample["image"]
        boxes = sample["boxes"]
        labels = sample["labels"]

        h, w = image.shape

        # grayscale -> RGB
        image = prepare_image(image)

        image_name = f"mri_{idx}.jpg"

        cv2.imwrite(
            str(image_dir / image_name),
            image
        )

        txt_file = label_dir / f"mri_{idx}.txt"

        with open(txt_file, "w") as f:

            for box, label in zip(boxes, labels):

                x, y, bw, bh = convert_box(
                    box,
                    w,
                    h
                )

                class_id = label - 1

                f.write(
                    f"{class_id} {x:.6f} {y:.6f} {bw:.6f} {bh:.6f}\n"
                )


print("Saving train samples...")
save_samples(
    train_files,
    train_img_dir,
    train_lbl_dir
)

print("Saving validation samples...")
save_samples(
    val_files,
    val_img_dir,
    val_lbl_dir
)

print("Finished!")