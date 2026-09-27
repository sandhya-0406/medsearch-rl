from pathlib import Path
import pickle

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
    Unified classification dataset for:

    - Brain MRI
    - ESAD
    - MESAD

    Uses an existing classification cache when available.
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

        # --------------------------------------------------------
        # Normalize dataset name
        # --------------------------------------------------------

        if self.dataset_type == "figshare":

            self.dataset_type = "mri"

        # --------------------------------------------------------
        # Determine cache directory
        # --------------------------------------------------------

        if self.dataset_type == "mri":

            cache_path = mri_path

        elif self.dataset_type == "esad":

            cache_path = esad_path

        elif self.dataset_type == "mesad":

            cache_path = mesad_path

        else:

            raise ValueError(
                f"Unknown dataset type: {self.dataset_type}"
            )

        self.cache_dir = Path(
            cache_path
        )

        self.cache_file = (
            self.cache_dir /
            f"classification_{self.dataset_type}.pkl"
        )

        # --------------------------------------------------------
        # Underlying unified dataset
        # --------------------------------------------------------

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

        # --------------------------------------------------------
        # Classes
        # --------------------------------------------------------

        if self.dataset_type == "mri":

            self.class_names = MRI_CLASSES

            self.label_map = {

                1: 0,
                2: 1,
                3: 2

            }

        else:

            self.class_names = SURGICAL_CLASSES

            self.label_map = None

        # --------------------------------------------------------
        # Base dataset initialization
        # --------------------------------------------------------

        super().__init__(
            image_size=image_size,
            padding=padding,
            train=train
        )

    # ============================================================
    # Load classification samples
    # ============================================================

    def load_samples(self):

        # --------------------------------------------------------
        # Existing cache
        # --------------------------------------------------------

        if self.cache_file.exists():

            print()
            print(
                f"Loading classification cache "
                f"({self.dataset_type.upper()})..."
            )

            with open(self.cache_file, "rb") as f:
                self.samples = pickle.load(f)

            valid_samples = [
                sample for sample in self.samples
                if sample.get("image") is not None
                or (
                    sample.get("image_path") is not None
                    and str(sample["image_path"]).strip() != ""
                )
            ]

            if len(valid_samples) != len(self.samples):
                print(
                    "Detected stale classification cache entries with missing image paths. "
                    "Rebuilding the cache..."
                )
                self.samples = []
            else:
                print(
                    f"Loaded {len(self.samples)} samples."
                )
                return

        # --------------------------------------------------------
        # Build cache
        # --------------------------------------------------------

        print()
        print(
            f"Building "
            f"{self.dataset_type.upper()} "
            f"Classification Dataset..."
        )

        self.samples = []

        # ========================================================
        # MESAD — annotation-only cache building
        # ========================================================

        if self.dataset_type == "mesad":

            loader = self.dataset.mesad_loader

            total = len(loader.image_files)

            for i, image_path in enumerate(loader.image_files):

                if i % 1000 == 0:

                    print(
                        f"Processed "
                        f"{i}/{total} images"
                    )

                annotation_dir = (
                    image_path.parent.parent /
                    "annotations"
                )

                bbox_path = (
                    annotation_dir /
                    f"{image_path.stem}.bboxes.tsv"
                )

                # Read ONLY annotations
                boxes, labels = loader.load_annotation(
                    bbox_path
                )

                if len(boxes) == 0:
                    continue

                for box, label in zip(
                    boxes,
                    labels
                ):

                    self.samples.append({

                        "image_path": str(image_path),

                        "bbox": [
                            int(box[0]),
                            int(box[1]),
                            int(box[2]),
                            int(box[3])
                        ],

                        "label": int(label)

                    })

        # ========================================================
        # Other datasets
        # ========================================================

        else:

            for i in range(len(self.dataset)):

                if i % 1000 == 0:

                    print(
                        f"Processed "
                        f"{i}/{len(self.dataset)} images"
                    )

                try:
                    sample = self.dataset[i]
                    domain = sample["domain"].lower()
                    image_path = sample.get("image_path")
                    boxes = sample["boxes"]
                    labels = sample["labels"]
                except Exception as exc:
                    print(
                        f"Skipping unreadable dataset sample at index {i}: "
                        f"{type(exc).__name__}: {exc}"
                    )
                    continue

                if domain != self.dataset_type:
                    continue

                if len(boxes) == 0:
                    continue

                for box, label in zip(
                    boxes,
                    labels
                ):

                    try:
                        label = int(label)

                        if self.dataset_type == "mri":
                            label = self.label_map[label]

                        self.samples.append({
                            "image": sample.get("image"),
                            "image_path": image_path,
                            "bbox": [
                                int(box[0]),
                                int(box[1]),
                                int(box[2]),
                                int(box[3])
                            ],
                            "label": label
                        })
                    except Exception as exc:
                        print(
                            f"Skipping invalid annotation at index {i}: "
                            f"{type(exc).__name__}: {exc}"
                        )
                        continue

        # --------------------------------------------------------
        # Save cache
        # --------------------------------------------------------

        self.cache_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        with open(
            self.cache_file,
            "wb"
        ) as f:

            pickle.dump(
                self.samples,
                f
            )

        print()
        print(
            "Saved classification cache:"
        )

        print(
            self.cache_file
        )

    # ============================================================
    # Number of classes
    # ============================================================

    @property
    def num_classes(self):

        return len(
            self.class_names
        )