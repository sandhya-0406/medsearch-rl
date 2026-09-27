import os
import sys
import time
from pathlib import Path

import torch
from torch.utils.data import DataLoader, Subset

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)


# ============================================================
# PROJECT ROOT
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


# ============================================================
# PROJECT IMPORTS
# ============================================================

from backend.classification.config import Config

from backend.classification.training.train_classifier import (
    build_datasets,
    build_dataloaders
)

from backend.classification.models import MedicalClassifier

from backend.classification.utils.visualization import (
    TrainingVisualizer
)


# ============================================================
# SETTINGS
# ============================================================

# Number of test images to evaluate.
# 1000 is enough for a quick development evaluation.
EVAL_SAMPLES = 1000

# Fixed seed so the same 1000 images are selected every time.
EVAL_SEED = 42

# Batch size for evaluation.
# Larger batch = faster inference if your RAM/VRAM allows it.
CPU_BATCH_SIZE = 32
GPU_BATCH_SIZE = 64


# ============================================================
# LOAD MODEL
# ============================================================

def load_model(config, num_classes):

    print("\n" + "-" * 70)
    print("Loading ESAD classifier")
    print("-" * 70)

    model = MedicalClassifier(
        num_classes=num_classes
    ).to(config.device)

    checkpoint_path = os.path.join(
        config.checkpoint_dir,
        "esad_classifier.pth"
    )

    print(
        f"Checkpoint path:\n{checkpoint_path}"
    )

    # --------------------------------------------------------
    # Check checkpoint
    # --------------------------------------------------------

    if not os.path.isfile(checkpoint_path):

        raise FileNotFoundError(
            "\nESAD classifier checkpoint was not found.\n\n"
            f"Expected location:\n{checkpoint_path}\n\n"
            "Make sure esad_classifier.pth is inside "
            "weights/classifiers/"
        )

    # --------------------------------------------------------
    # Load checkpoint
    # --------------------------------------------------------

    checkpoint = torch.load(
        checkpoint_path,
        map_location=config.device
    )

    # --------------------------------------------------------
    # Load model weights
    # --------------------------------------------------------

    if "model_state_dict" not in checkpoint:

        raise KeyError(
            "\nThe checkpoint does not contain "
            "'model_state_dict'.\n"
            "Check how esad_classifier.pth was saved."
        )

    model.load_state_dict(
        checkpoint["model_state_dict"]
    )

    model.eval()

    print("Model loaded successfully.")

    # --------------------------------------------------------
    # Display checkpoint information if available
    # --------------------------------------------------------

    if isinstance(checkpoint, dict):

        if "epoch" in checkpoint:
            print(
                f"Checkpoint Epoch : {checkpoint['epoch']}"
            )

        if "val_loss" in checkpoint:
            print(
                f"Checkpoint Val Loss : "
                f"{checkpoint['val_loss']:.4f}"
            )

    return model


# ============================================================
# STRATIFIED TEST SAMPLE
# ============================================================

def create_stratified_test_subset(
    test_subset,
    num_classes,
    target_size,
    seed
):
    """
    Select a fixed number of samples from the existing test set
    while approximately preserving the class distribution.

    IMPORTANT:
    The original train/validation/test split is NOT changed.

    We only select a smaller subset from the already-created
    test set.
    """

    total_test_samples = len(test_subset)

    if total_test_samples == 0:

        raise ValueError(
            "The test dataset contains zero samples."
        )

    # If requested size is larger than the test set,
    # simply use the complete test set.
    target_size = min(
        target_size,
        total_test_samples
    )

    # --------------------------------------------------------
    # test_subset is a torch.utils.data.Subset
    # --------------------------------------------------------

    original_dataset = test_subset.dataset

    # --------------------------------------------------------
    # Collect test positions by class
    # --------------------------------------------------------

    class_indices = {
        class_id: []
        for class_id in range(num_classes)
    }

    for test_position, original_index in enumerate(
        test_subset.indices
    ):

        sample = original_dataset.samples[
            original_index
        ]

        label = int(sample["label"])

        if label in class_indices:

            class_indices[label].append(
                test_position
            )

    # --------------------------------------------------------
    # Remove empty classes
    # --------------------------------------------------------

    non_empty_classes = [
        class_id
        for class_id, indices in class_indices.items()
        if len(indices) > 0
    ]

    if len(non_empty_classes) == 0:

        raise ValueError(
            "No valid classes were found in the test set."
        )

    # --------------------------------------------------------
    # Calculate proportional number of samples per class
    # --------------------------------------------------------

    total_available = sum(
        len(class_indices[c])
        for c in non_empty_classes
    )

    allocations = {}

    fractional_remainders = []

    allocated = 0

    for class_id in non_empty_classes:

        count = len(
            class_indices[class_id]
        )

        exact_count = (
            count / total_available
        ) * target_size

        base_count = int(exact_count)

        # Keep at least one sample from every
        # class that exists in the test set.
        base_count = max(
            1,
            base_count
        )

        # Never request more samples than available.
        base_count = min(
            base_count,
            count
        )

        allocations[class_id] = base_count

        allocated += base_count

        fractional_remainders.append(
            (
                exact_count - int(exact_count),
                class_id
            )
        )

    # --------------------------------------------------------
    # Adjust allocation to exactly target_size
    # --------------------------------------------------------

    # Add samples if we are below target size.
    fractional_remainders.sort(
        reverse=True
    )

    while allocated < target_size:

        added = False

        for _, class_id in fractional_remainders:

            if allocations[class_id] < len(
                class_indices[class_id]
            ):

                allocations[class_id] += 1

                allocated += 1

                added = True

                if allocated >= target_size:
                    break

        if not added:
            break

    # Remove samples if initial minimum-one-per-class
    # allocation pushed us above target size.
    while allocated > target_size:

        removed = False

        for _, class_id in reversed(
            fractional_remainders
        ):

            if allocations[class_id] > 1:

                allocations[class_id] -= 1

                allocated -= 1

                removed = True

                if allocated <= target_size:
                    break

        if not removed:
            break

    # --------------------------------------------------------
    # Randomly select samples from each class
    # --------------------------------------------------------

    generator = torch.Generator().manual_seed(
        seed
    )

    selected_positions = []

    for class_id in non_empty_classes:

        indices = class_indices[class_id]

        requested = allocations[class_id]

        permutation = torch.randperm(
            len(indices),
            generator=generator
        ).tolist()

        selected = [
            indices[i]
            for i in permutation[:requested]
        ]

        selected_positions.extend(
            selected
        )

    # --------------------------------------------------------
    # Shuffle final selected test samples
    # --------------------------------------------------------

    shuffle_order = torch.randperm(
        len(selected_positions),
        generator=generator
    ).tolist()

    selected_positions = [
        selected_positions[i]
        for i in shuffle_order
    ]

    return Subset(
        test_subset,
        selected_positions
    )


# ============================================================
# EVALUATE MODEL
# ============================================================

@torch.inference_mode()
def evaluate(
    model,
    loader,
    device
):

    predictions = []
    labels = []

    total_images = len(
        loader.dataset
    )

    processed = 0

    start_time = time.time()

    print("\nEvaluating...")
    print(
        f"Images to evaluate: {total_images}"
    )

    for batch_number, (
        images,
        targets
    ) in enumerate(loader, start=1):

        images = images.to(
            device,
            non_blocking=True
        )

        targets = targets.to(
            device,
            non_blocking=True
        )

        # ----------------------------------------------------
        # Forward pass
        # ----------------------------------------------------

        outputs = model(images)

        preds = outputs.argmax(
            dim=1
        )

        # ----------------------------------------------------
        # Store results
        # ----------------------------------------------------

        predictions.extend(
            preds.cpu().numpy()
        )

        labels.extend(
            targets.cpu().numpy()
        )

        processed += images.size(0)

        # ----------------------------------------------------
        # Progress display
        # ----------------------------------------------------

        if (
            batch_number == 1
            or batch_number % 10 == 0
            or processed >= total_images
        ):

            elapsed = time.time() - start_time

            if elapsed > 0:

                speed = (
                    processed / elapsed
                )

            else:

                speed = 0

            print(
                f"Processed: "
                f"{processed}/{total_images} "
                f"| Speed: "
                f"{speed:.1f} images/sec "
                f"| Time: "
                f"{elapsed:.1f}s"
            )

    total_time = time.time() - start_time

    return (
        labels,
        predictions,
        total_time
    )


# ============================================================
# MAIN
# ============================================================

def main():

    overall_start = time.time()

    print("\n")
    print("=" * 70)
    print("ESAD CLASSIFIER - QUICK TEST EVALUATION")
    print("=" * 70)

    print(
        f"\nEvaluation sample size : {EVAL_SAMPLES}"
    )

    print(
        f"Evaluation seed        : {EVAL_SEED}"
    )


    # ========================================================
    # CONFIGURATION
    # ========================================================

    config = Config(
        dataset="esad"
    )

    print(
        f"\nDataset : {config.dataset}"
    )

    print(
        f"Device  : {config.device}"
    )

    print(
        f"Checkpoint directory : "
        f"{config.checkpoint_dir}"
    )

    print(
        f"Result directory : "
        f"{config.result_dir}"
    )


    # ========================================================
    # BUILD DATASETS
    # ========================================================

    print("\n" + "-" * 70)
    print("Building ESAD dataset")
    print("-" * 70)

    dataset_start = time.time()

    train_dataset, val_dataset = build_datasets(
        config
    )

    dataset_time = time.time() - dataset_start

    print(
        f"\nDataset preparation time: "
        f"{dataset_time:.2f} seconds"
    )

    print(
        f"Train dataset samples : "
        f"{len(train_dataset)}"
    )

    print(
        f"Validation dataset samples : "
        f"{len(val_dataset)}"
    )

    print(
        f"Number of classes : "
        f"{train_dataset.num_classes}"
    )

    print(
        f"Classes : "
        f"{train_dataset.class_names}"
    )


    # ========================================================
    # RECREATE ORIGINAL SPLIT
    # ========================================================

    print("\n" + "-" * 70)
    print("Recreating train / validation / test split")
    print("-" * 70)

    (
        train_loader,
        val_loader,
        test_loader
    ) = build_dataloaders(
        train_dataset,
        val_dataset,
        config
    )

    print(
        f"\nOriginal training samples   : "
        f"{len(train_loader.dataset)}"
    )

    print(
        f"Original validation samples : "
        f"{len(val_loader.dataset)}"
    )

    print(
        f"Original test samples       : "
        f"{len(test_loader.dataset)}"
    )


    # ========================================================
    # CREATE SMALL STRATIFIED TEST SET
    # ========================================================

    print("\n" + "-" * 70)
    print(
        "Creating stratified evaluation subset"
    )
    print("-" * 70)

    small_test_subset = create_stratified_test_subset(
        test_subset=test_loader.dataset,
        num_classes=train_dataset.num_classes,
        target_size=EVAL_SAMPLES,
        seed=EVAL_SEED
    )

    print(
        f"\nOriginal test set : "
        f"{len(test_loader.dataset)} images"
    )

    print(
        f"Quick evaluation  : "
        f"{len(small_test_subset)} images"
    )

    print(
        "\nThe evaluation subset is stratified "
        "across the ESAD classes."
    )


    # ========================================================
    # BATCH SIZE
    # ========================================================

    if torch.cuda.is_available():

        eval_batch_size = GPU_BATCH_SIZE

    else:

        eval_batch_size = CPU_BATCH_SIZE

    print(
        f"\nEvaluation batch size : "
        f"{eval_batch_size}"
    )


    # ========================================================
    # DATALOADER
    # ========================================================

    # --------------------------------------------------------
    # Conservative worker count for Windows/VS Code.
    # --------------------------------------------------------

    cpu_count = os.cpu_count() or 2

    if torch.cuda.is_available():

        num_workers = min(
            4,
            max(0, cpu_count // 2)
        )

    else:

        # For CPU evaluation on Windows,
        # 0 workers avoids multiprocessing overhead.
        num_workers = 0

    pin_memory = (
        torch.cuda.is_available()
    )

    small_test_loader = DataLoader(
        small_test_subset,
        batch_size=eval_batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=pin_memory
    )

    print(
        f"DataLoader workers : "
        f"{num_workers}"
    )


    # ========================================================
    # LOAD MODEL
    # ========================================================

    model = load_model(
        config,
        train_dataset.num_classes
    )


    # ========================================================
    # EVALUATE
    # ========================================================

    labels, predictions, evaluation_time = evaluate(
        model,
        small_test_loader,
        config.device
    )


    # ========================================================
    # METRICS
    # ========================================================

    accuracy = accuracy_score(
        labels,
        predictions
    )

    precision = precision_score(
        labels,
        predictions,
        average="weighted",
        zero_division=0
    )

    recall = recall_score(
        labels,
        predictions,
        average="weighted",
        zero_division=0
    )

    f1 = f1_score(
        labels,
        predictions,
        average="weighted",
        zero_division=0
    )


    # ========================================================
    # CONFUSION MATRIX
    # ========================================================

    cm = confusion_matrix(
        labels,
        predictions
    )


    # ========================================================
    # RESULTS
    # ========================================================

    print("\n")
    print("=" * 70)
    print("ESAD QUICK EVALUATION RESULTS")
    print("=" * 70)

    print(
        f"\nImages evaluated : "
        f"{len(labels)}"
    )

    print(
        f"Evaluation time  : "
        f"{evaluation_time:.2f} seconds"
    )

    print(
        f"\nAccuracy : "
        f"{accuracy:.4f}"
    )

    print(
        f"Precision: "
        f"{precision:.4f}"
    )

    print(
        f"Recall   : "
        f"{recall:.4f}"
    )

    print(
        f"F1 Score : "
        f"{f1:.4f}"
    )


    # ========================================================
    # CLASSIFICATION REPORT
    # ========================================================

    print("\n" + "-" * 70)
    print("CLASSIFICATION REPORT")
    print("-" * 70)

    print(
        classification_report(
            labels,
            predictions,
            target_names=train_dataset.class_names,
            zero_division=0
        )
    )


    # ========================================================
    # CONFUSION MATRIX
    # ========================================================

    print("\n" + "-" * 70)
    print("CONFUSION MATRIX")
    print("-" * 70)

    print(cm)


    # ========================================================
    # SAVE CONFUSION MATRIX FIGURE
    # ========================================================

    visualizer = TrainingVisualizer(
        config.result_dir
    )

    visualizer.plot_confusion_matrix(
        cm,
        train_dataset.class_names
    )

    print(
        "\nConfusion matrix saved to:"
    )

    print(
        config.result_dir
    )


    # ========================================================
    # TOTAL TIME
    # ========================================================

    total_time = (
        time.time()
        - overall_start
    )

    print("\n" + "=" * 70)
    print("EVALUATION COMPLETE")
    print("=" * 70)

    print(
        f"\nTotal execution time : "
        f"{total_time / 60:.2f} minutes"
    )

    if total_time < 30 * 60:

        print(
            "Status: Completed within "
            "the 30-minute target."
        )

    else:

        print(
            "Warning: Execution exceeded "
            "the 30-minute target."
        )

    print("=" * 70)


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()