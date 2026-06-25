from backend.classification.datasets.classification_dataset import (
    ClassificationDataset
)

from backend.datasets.unified_dataset import UnifiedDataset


class MRIClassificationDataset(ClassificationDataset):

    """
    Brain MRI Classification Dataset

    Returns

        image, label

    Labels

        0 -> Meningioma
        1 -> Glioma
        2 -> Pituitary
    """

    LABEL_MAP = {

        1: 0,      # Meningioma

        2: 1,      # Glioma

        3: 2       # Pituitary

    }

    CLASS_NAMES = [

        "Meningioma",

        "Glioma",

        "Pituitary"

    ]

    def __init__(

            self,

            dataset_path="data/figshare",

            image_size=224,

            padding=0.20,

            train=True

    ):

        self.dataset = UnifiedDataset(

            mri_path=dataset_path,

            esad_path=None,

            mesad_path=None

        )

        super().__init__(

            image_size=image_size,

            padding=padding,

            train=train

        )

    ###########################################################
    # Build Samples
    ###########################################################

    def load_samples(self):

        print()

        print("Building MRI Classification Dataset...")

        self.samples = []

        for sample in self.dataset:

            image = sample["image"]

            boxes = sample["boxes"]

            labels = sample["labels"]

            if len(boxes) == 0:

                continue

            for box, label in zip(

                    boxes,

                    labels

            ):

                label = int(label)

                if label not in self.LABEL_MAP:

                    continue

                self.samples.append(

                    {

                        "image": image,

                        "bbox": [

                            int(box[0]),

                            int(box[1]),

                            int(box[2]),

                            int(box[3])

                        ],

                        "label": self.LABEL_MAP[label]

                    }

                )

        print(

            f"Loaded {len(self.samples)} MRI samples."

        )

    ###########################################################
    # Utility
    ###########################################################

    @property
    def num_classes(self):

        return len(

            self.CLASS_NAMES

        )