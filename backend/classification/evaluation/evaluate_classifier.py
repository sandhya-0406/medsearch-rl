import os
import sys
from pathlib import Path

import torch
from torch.utils.data import DataLoader
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

PROJECT_ROOT = Path(__file__).resolve().parents[3]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.classification.config import Config
from backend.classification.datasets.unified_classification_dataset import (
    UnifiedClassificationDataset
)
from backend.classification.models import MedicalClassifier
from backend.classification.utils.visualization import TrainingVisualizer


def build_dataset(config):

    return UnifiedClassificationDataset(
        dataset_type=config.dataset,
        mri_path=config.mri_path,
        esad_path=config.esad_path,
        mesad_path=config.mesad_path,
        image_size=config.image_size,
        padding=config.padding,
        train=False
    )


def build_loader(dataset, config):

    return DataLoader(
        dataset,
        batch_size=config.batch_size,
        shuffle=False,
        num_workers=config.num_workers,
        pin_memory=config.pin_memory
    )


def load_model(config, num_classes):

    model = MedicalClassifier(
        num_classes=num_classes
    ).to(config.device)

    checkpoint = torch.load(
        os.path.join(
            config.checkpoint_dir,
            "best_classifier.pth"
        ),
        map_location=config.device
    )

    model.load_state_dict(
        checkpoint["model_state_dict"]
    )

    model.eval()

    return model


@torch.no_grad()
def evaluate(model, loader, device):

    predictions = []
    labels = []

    for images, targets in loader:

        images = images.to(device)

        outputs = model(images)

        preds = outputs.argmax(dim=1).cpu()

        predictions.extend(preds.numpy())
        labels.extend(targets.numpy())

    return labels, predictions


def main():

    config = Config(dataset="figshare")

    dataset = build_dataset(config)

    loader = build_loader(dataset, config)

    model = load_model(
        config,
        dataset.num_classes
    )

    labels, predictions = evaluate(
        model,
        loader,
        config.device
    )

    accuracy = accuracy_score(labels, predictions)
    precision = precision_score(
        labels,
        predictions,
        average="weighted"
    )
    recall = recall_score(
        labels,
        predictions,
        average="weighted"
    )
    f1 = f1_score(
        labels,
        predictions,
        average="weighted"
    )

    cm = confusion_matrix(
        labels,
        predictions
    )

    print("\n" + "=" * 60)
    print("Evaluation Results")
    print("=" * 60)

    print(f"Accuracy : {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1 Score : {f1:.4f}")

    print("\nClassification Report\n")
    print(
        classification_report(
            labels,
            predictions,
            target_names=dataset.class_names
        )
    )

    visualizer = TrainingVisualizer(
        config.result_dir
    )

    visualizer.plot_confusion_matrix(
        cm,
        dataset.class_names
    )

    print("\nConfusion matrix saved.")
    print("=" * 60)


if __name__ == "__main__":
    main()