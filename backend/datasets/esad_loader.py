from pathlib import Path
import cv2

class ESADLoader:

    def __init__(self,dataset_path):
        self.dataset_path = Path(dataset_path)

        with open(
            self.dataset_path / "obj.names",
            "r"
        ) as f:
            
            self.class_names = [
                line.strip()
                for line in f
                if line.strip()
            ]

        self.image_files = list(
            self.dataset_path.rglob("*.jpg")
        )

    def load_labels(self, txt_path):

        boxes = []
        labels = []

        if txt_path.stat().st_size == 0:
            return boxes, labels

        with open(txt_path, "r") as f:

            for line in f:

                parts = line.strip().split()

                class_id = int(parts[0])

                cx = float(parts[1])
                cy = float(parts[2])
                w = float(parts[3])
                h = float(parts[4])

                boxes.append(
                    [cx, cy, w, h]
                )

                labels.append(
                    self.class_names[class_id]
                )

        return boxes, labels
    
    def yolo_to_bbox(
        self,
        box,
        image_width,
        image_height
    ):

        cx, cy, w, h = box

        cx *= image_width
        cy *= image_height

        w *= image_width
        h *= image_height

        xmin = int(cx - w / 2)
        ymin = int(cy - h / 2)

        xmax = int(cx + w / 2)
        ymax = int(cy + h / 2)

        return [
            xmin,
            ymin,
            xmax,
            ymax
        ]
    
    def load_sample(self, index):

        image_path = self.image_files[index]

        txt_path = image_path.with_suffix(".txt")

        image = cv2.imread(
            str(image_path)
        )

        image = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB
        )

        height, width = image.shape[:2]

        raw_boxes, labels = self.load_labels(
            txt_path
        )

        boxes = []

        for box in raw_boxes:

            boxes.append(
                self.yolo_to_bbox(
                    box,
                    width,
                    height
                )
            )

        return {
            "image": image,
            "boxes": boxes,
            "labels": labels,
            "domain": "ESAD"
        }
    
    def __len__(self):
        return len(self.image_files)
    