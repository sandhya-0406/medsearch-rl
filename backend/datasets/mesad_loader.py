from pathlib import Path
import cv2


class MESADLoader:

    def __init__(self, dataset_path):

        self.dataset_path = Path(dataset_path)

        self.image_files = sorted(
            list(
                (self.dataset_path / "train" / "images").rglob("*.jpg")
            ) +
            list(
                (self.dataset_path / "val" / "images").rglob("*.jpg")
            )
        )
    def load_annotation(self, bbox_path):

        label_path = str(bbox_path).replace(
            ".bboxes.tsv",
            ".bboxes.labels.tsv"
        )

        boxes = []
        labels = []

        with open(bbox_path, "r") as f:

            for line in f:

                parts = line.strip().split()

                if len(parts) != 4:
                    continue

                xmin, ymin, xmax, ymax = map(
                    int,
                    parts
                )

                boxes.append(
                    [xmin, ymin, xmax, ymax]
                )

        with open(label_path, "r") as f:

            for line in f:

                label = line.strip()

                if label:
                    labels.append(label)

        return boxes, labels
    
    def load_sample(self, index):

        image_path = self.image_files[index]

        image = cv2.imread(
            str(image_path)
        )

        image = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB
        )

        annotation_dir = (
            image_path.parent.parent /
            "annotations"
        )

        bbox_path = (
            annotation_dir /
            f"{image_path.stem}.bboxes.tsv"
        )

        boxes, labels = self.load_annotation(
            bbox_path
        )

        return {
            "image": image,
            "boxes": boxes,
            "labels": labels,
            "domain": "MESAD"
        }
    
    def __len__(self):
        return len(self.image_files)
    