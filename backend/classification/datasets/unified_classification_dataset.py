from backend.datasets.unified_dataset import UnifiedDataset

from backend.classification.datasets.classification_dataset import (
    ClassificationDataset
)

from backend.classification.datasets.labels import (
    MRI_CLASSES,
    SURGICAL_CLASSES
)


class UnifiedClassificationDataset(

    ClassificationDataset

):

    """
    Generic Classification Dataset

    dataset_type

        "mri"

        "esad"

        "mesad"

    """

    def __init__(

            self,

            dataset_type,

            mri_path=None,

            esad_path=None,

            mesad_path=None,

            image_size=224,

            padding=0.20,

            train=True

    ):

        self.dataset_type = dataset_type.lower()

        if self.dataset_type == "figshare":
            self.dataset_type = "mri"

        if self.dataset_type == "mri":

            self.dataset = UnifiedDataset(
                mri_path=mri_path
            )

        elif self.dataset_type == "esad":

            self.dataset = UnifiedDataset(
                esad_path=esad_path
            )

        elif self.dataset_type == "mesad":

            self.dataset = UnifiedDataset(
                mesad_path=mesad_path
            )

        else:

            raise ValueError(
                f"Unknown dataset type: {self.dataset_type}"
            )

        if self.dataset_type == "mri":

            self.class_names = MRI_CLASSES

            self.label_map = {

                1:0,

                2:1,

                3:2

            }

        else:

            self.class_names = SURGICAL_CLASSES

            self.label_map = None

        super().__init__(

            image_size=image_size,

            padding=padding,

            train=train

        )

    ############################################################

    def load_samples(self):

        print()

        print(

            f"Building {self.dataset_type.upper()} Classification Dataset..."

        )

        self.samples = []

        ########################################################

        for sample in self.dataset:

            domain = sample["domain"].lower()

            if domain != self.dataset_type:

                continue

            image = sample["image"]

            boxes = sample["boxes"]

            labels = sample["labels"]

            if len(boxes) == 0:

                continue

            ####################################################

            for box, label in zip(

                    boxes,

                    labels

            ):

                label = int(label)

                if self.dataset_type == "mri":

                    label = self.label_map[label]

                self.samples.append(

                    {

                        "image": image,

                        "bbox": [

                            int(box[0]),

                            int(box[1]),

                            int(box[2]),

                            int(box[3])

                        ],

                        "label": label

                    }

                )

        print(

            f"Loaded {len(self.samples)} objects."

        )

    ############################################################

    @property

    def num_classes(self):

        return len(

            self.class_names

        )