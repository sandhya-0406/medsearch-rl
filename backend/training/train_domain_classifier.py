import random
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
project_root = Path.cwd()
sys.path.append(str(project_root))


import cv2
import h5py
import numpy as np
import torch
import torch.nn as nn

from PIL import Image
from torch.utils.data import (
    Dataset,
    DataLoader,
    random_split
)

from backend.domain.domain_classifier import (
    DomainClassifier
)


# ============================================================
# CONFIG
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_ROOT = PROJECT_ROOT / "data"

MRI_ROOT = DATA_ROOT / "figshare"
ESAD_ROOT = DATA_ROOT / "esad"
MESAD_ROOT = DATA_ROOT / "mesad"

WEIGHTS_DIR = (
    PROJECT_ROOT
    / "backend"
    / "weights"
    / "domain"
)

WEIGHTS_DIR.mkdir(
    parents=True,
    exist_ok=True
)

CHECKPOINT_PATH = (
    WEIGHTS_DIR
    / "domain_classifier.pth"
)

IMAGE_SIZE = 224

# Keep the dataset balanced.
# MRI has 3064 samples, so use at most 3064
# from each domain.
MAX_SAMPLES_PER_DOMAIN = 3064

BATCH_SIZE = 32

EPOCHS = 10

LEARNING_RATE = 1e-3

VAL_SPLIT = 0.20

SEED = 42


# ============================================================
# REPRODUCIBILITY
# ============================================================

random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)

if torch.cuda.is_available():

    torch.cuda.manual_seed_all(
        SEED
    )


# ============================================================
# DEVICE
# ============================================================

DEVICE = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)

print()
print("=" * 70)
print("MedSearch-RL Domain Classifier")
print("=" * 70)

print(
    "Device:",
    DEVICE
)

print(
    "Data root:",
    DATA_ROOT
)


# ============================================================
# IMAGE EXTENSIONS
# ============================================================

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp",
    ".tif",
    ".tiff"
}


# ============================================================
# DATASET
# ============================================================

class DomainDataset(Dataset):

    """
    Dataset for:

        MRI     -> 0
        ESAD    -> 1
        MESAD   -> 2
    """

    def __init__(
        self,
        samples
    ):

        self.samples = samples

    def __len__(self):

        return len(
            self.samples
        )

    def __getitem__(
        self,
        index
    ):

        path, label = (
            self.samples[index]
        )

        image = self._load_image(
            path,
            label
        )

        image = self._preprocess(
            image
        )

        return image, label

    # --------------------------------------------------------
    # LOAD
    # --------------------------------------------------------

    def _load_image(
        self,
        path,
        label
    ):

        # MRI
        if label == 0:

            with h5py.File(
                path,
                "r"
            ) as f:

                image = (
                    f["cjdata"]["image"][()]
                )

            image = np.asarray(
                image
            )

            # MRI is grayscale
            if image.ndim == 2:

                image = np.stack(
                    [
                        image,
                        image,
                        image
                    ],
                    axis=-1
                )

            return image

        # ESAD / MESAD
        image = cv2.imread(
            str(path),
            cv2.IMREAD_COLOR
        )

        if image is None:

            raise RuntimeError(
                f"Could not read image: {path}"
            )

        # OpenCV BGR -> RGB
        image = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB
        )

        return image

    # --------------------------------------------------------
    # PREPROCESS
    # --------------------------------------------------------

    def _preprocess(
        self,
        image
    ):

        image = np.asarray(
            image
        )

        if image.ndim == 2:

            image = np.stack(
                [
                    image,
                    image,
                    image
                ],
                axis=-1
            )

        image = cv2.resize(
            image,
            (
                IMAGE_SIZE,
                IMAGE_SIZE
            )
        )

        image = image.astype(
            np.float32
        )

        # Normalize
        image_min = image.min()
        image_max = image.max()

        if image_max > image_min:

            image = (
                image - image_min
            ) / (
                image_max - image_min
            )

        else:

            image = np.zeros_like(
                image
            )

        # HWC -> CHW
        image = np.transpose(
            image,
            (2, 0, 1)
        )

        return torch.tensor(
            image,
            dtype=torch.float32
        )


# ============================================================
# FIND FILES
# ============================================================

def find_mri_files():

    files = list(
        MRI_ROOT.rglob("*.mat")
    )

    files = [
        f
        for f in files
        if f.name != "cvind.mat"
    ]

    return sorted(
        files
    )


def find_image_files(
    root
):

    files = []

    for path in root.rglob("*"):

        if (
            path.is_file()
            and path.suffix.lower()
            in IMAGE_EXTENSIONS
        ):

            files.append(
                path
            )

    return sorted(
        files
    )


# ============================================================
# BUILD SAMPLE LIST
# ============================================================

def build_samples():

    print()
    print("Scanning datasets...")
    print()

    # --------------------------------------------------------
    # MRI
    # --------------------------------------------------------

    mri_files = find_mri_files()

    print(
        "MRI files found:",
        len(mri_files)
    )

    # --------------------------------------------------------
    # ESAD
    # --------------------------------------------------------

    esad_files = find_image_files(
        ESAD_ROOT
    )

    print(
        "ESAD images found:",
        len(esad_files)
    )

    # --------------------------------------------------------
    # MESAD
    # --------------------------------------------------------

    mesad_files = find_image_files(
        MESAD_ROOT
    )

    print(
        "MESAD images found:",
        len(mesad_files)
    )

    # --------------------------------------------------------
    # Balance
    # --------------------------------------------------------

    random.shuffle(
        mri_files
    )

    random.shuffle(
        esad_files
    )

    random.shuffle(
        mesad_files
    )

    n = min(
        len(mri_files),
        len(esad_files),
        len(mesad_files),
        MAX_SAMPLES_PER_DOMAIN
    )

    print()
    print(
        "Samples per domain:",
        n
    )

    mri_files = mri_files[:n]

    esad_files = esad_files[:n]

    mesad_files = mesad_files[:n]

    samples = []

    # MRI = 0
    samples.extend(
        [
            (path, 0)
            for path in mri_files
        ]
    )

    # ESAD = 1
    samples.extend(
        [
            (path, 1)
            for path in esad_files
        ]
    )

    # MESAD = 2
    samples.extend(
        [
            (path, 2)
            for path in mesad_files
        ]
    )

    random.shuffle(
        samples
    )

    return samples


# ============================================================
# TRAIN / VALIDATION SPLIT
# ============================================================

def create_loaders(
    samples
):

    dataset = DomainDataset(
        samples
    )

    val_size = int(
        len(dataset)
        * VAL_SPLIT
    )

    train_size = (
        len(dataset)
        - val_size
    )

    train_dataset, val_dataset = (
        random_split(
            dataset,
            [
                train_size,
                val_size
            ],
            generator=torch.Generator().manual_seed(
                SEED
            )
        )
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=0,
        pin_memory=(
            DEVICE.type == "cuda"
        )
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=0,
        pin_memory=(
            DEVICE.type == "cuda"
        )
    )

    return (
        train_loader,
        val_loader
    )


# ============================================================
# EVALUATION
# ============================================================

def evaluate(
    model,
    loader,
    criterion
):

    model.eval()

    total_loss = 0.0

    correct = 0

    total = 0

    with torch.no_grad():

        for images, labels in loader:

            images = images.to(
                DEVICE
            )

            labels = labels.to(
                DEVICE
            )

            logits = model(
                images
            )

            loss = criterion(
                logits,
                labels
            )

            total_loss += (
                loss.item()
                * images.size(0)
            )

            predictions = (
                logits.argmax(
                    dim=1
                )
            )

            correct += (
                predictions == labels
            ).sum().item()

            total += (
                labels.size(0)
            )

    return (
        total_loss / total,
        correct / total
    )


# ============================================================
# TRAIN
# ============================================================

def train():

    samples = build_samples()

    if not samples:

        raise RuntimeError(
            "No training samples found."
        )

    train_loader, val_loader = (
        create_loaders(
            samples
        )
    )

    print()
    print(
        "Total samples:",
        len(samples)
    )

    print(
        "Training batches:",
        len(train_loader)
    )

    print(
        "Validation batches:",
        len(val_loader)
    )

    # --------------------------------------------------------
    # Model
    # --------------------------------------------------------

    model = DomainClassifier(
        num_classes=3
    )

    model = model.to(
        DEVICE
    )

    criterion = nn.CrossEntropyLoss()

    optimizer = torch.optim.AdamW(
        model.parameters(),
        lr=LEARNING_RATE,
        weight_decay=1e-4
    )

    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
        optimizer,
        mode="max",
        factor=0.5,
        patience=2
    )

    best_accuracy = 0.0

    # --------------------------------------------------------
    # Epochs
    # --------------------------------------------------------

    for epoch in range(
        1,
        EPOCHS + 1
    ):

        model.train()

        running_loss = 0.0

        correct = 0

        total = 0

        for batch_idx, (
            images,
            labels
        ) in enumerate(
            train_loader
        ):

            images = images.to(
                DEVICE,
                non_blocking=True
            )

            labels = labels.to(
                DEVICE,
                non_blocking=True
            )

            optimizer.zero_grad(
                set_to_none=True
            )

            logits = model(
                images
            )

            loss = criterion(
                logits,
                labels
            )

            loss.backward()

            optimizer.step()

            running_loss += (
                loss.item()
                * images.size(0)
            )

            predictions = (
                logits.argmax(
                    dim=1
                )
            )

            correct += (
                predictions == labels
            ).sum().item()

            total += (
                labels.size(0)
            )

        train_loss = (
            running_loss / total
        )

        train_accuracy = (
            correct / total
        )

        val_loss, val_accuracy = evaluate(
            model,
            val_loader,
            criterion
        )

        scheduler.step(
            val_accuracy
        )

        print(
            f"Epoch {epoch:02d}/{EPOCHS} | "
            f"Train Loss: {train_loss:.4f} | "
            f"Train Acc: {train_accuracy:.4f} | "
            f"Val Loss: {val_loss:.4f} | "
            f"Val Acc: {val_accuracy:.4f}"
        )

        # ----------------------------------------------------
        # Save best
        # ----------------------------------------------------

        if val_accuracy > best_accuracy:

            best_accuracy = val_accuracy

            torch.save(
                {
                    "model_state_dict":
                        model.state_dict(),

                    "num_classes": 3,

                    "class_names": [
                        "MRI",
                        "ESAD",
                        "MESAD"
                    ],

                    "image_size":
                        IMAGE_SIZE,

                    "best_accuracy":
                        best_accuracy

                },
                CHECKPOINT_PATH
            )

            print(
                f"  ✓ Saved best model "
                f"({best_accuracy:.4f})"
            )

    print()
    print("=" * 70)
    print("Training complete")
    print("=" * 70)

    print(
        "Best validation accuracy:",
        f"{best_accuracy:.4f}"
    )

    print(
        "Saved to:",
        CHECKPOINT_PATH
    )


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    train()