import os
import sys
from pathlib import Path

import torch
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
from backend.classification.training.train_classifier import (
    build_dataset,
    build_dataloaders
)
from backend.classification.models import MedicalClassifier
from backend.classification.utils.visualization import TrainingVisualizer


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
        targets = targets.to(device)

        outputs = model(images)

        preds = outputs.argmax(dim=1)

        predictions.extend(preds.cpu().numpy())
        labels.extend(targets.cpu().numpy())

    return labels, predictions


def main():

    # Use the same dataset name as training
    config = Config(dataset="mri")

    dataset = build_dataset(config)

    # Recreate the exact same split
    _, _, test_loader = build_dataloaders(
        dataset,
        config
    )

    print(f"Test Samples: {len(test_loader.dataset)}")

    model = load_model(
        config,
        dataset.num_classes
    )

    labels, predictions = evaluate(
        model,
        test_loader,
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

    cm = confusion_matrix(labels, predictions)

    print("\n" + "=" * 60)
    print("Test Results")
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