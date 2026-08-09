import cv2
import numpy as np
import torch
import torch.nn.functional as F

from backend.core.model_manager import model_manager
from backend.utils.labels import CLASS_NAMES


class ClassificationService:

    INPUT_SIZE = (224, 224)

    def __init__(self, model_manager_instance=None):

        self.model_manager = (
            model_manager_instance
            if model_manager_instance is not None
            else model_manager
        )

    # ---------------------------------------------------------
    # PREPARE ROI
    # ---------------------------------------------------------

    def _prepare_roi(self, roi):

        if roi is None:
            raise ValueError(
                "ROI is empty."
            )

        if roi.size == 0:
            raise ValueError(
                "ROI has zero pixels."
            )

        # Grayscale -> RGB
        if roi.ndim == 2:

            roi = np.stack(
                [roi, roi, roi],
                axis=-1
            )

        # RGBA -> RGB
        elif (
            roi.ndim == 3
            and roi.shape[2] == 4
        ):

            roi = cv2.cvtColor(
                roi,
                cv2.COLOR_BGRA2BGR
            )

        roi = cv2.resize(
            roi,
            self.INPUT_SIZE
        )

        roi = roi.astype(
            np.float32
        )

        if roi.max() > 1.0:

            roi /= 255.0

        roi = np.transpose(
            roi,
            (2, 0, 1)
        )

        tensor = torch.tensor(
            roi,
            dtype=torch.float32
        ).unsqueeze(0)

        return tensor

    # ---------------------------------------------------------
    # CLASSIFY
    # ---------------------------------------------------------

    def classify(
        self,
        roi,
        domain
    ):

        domain = domain.upper()

        if domain not in CLASS_NAMES:

            raise ValueError(
                f"Unsupported domain: {domain}"
            )

        classifier = (
            self.model_manager
            .get_classifier(domain)
        )

        if classifier is None:

            raise RuntimeError(
                f"{domain} classifier is not loaded."
            )

        tensor = self._prepare_roi(
            roi
        )

        device = next(
            classifier.parameters()
        ).device

        tensor = tensor.to(
            device
        )

        classifier.eval()

        with torch.no_grad():

            logits = classifier(
                tensor
            )

            probabilities = F.softmax(
                logits,
                dim=1
            )

        top_k = min(
            5,
            probabilities.shape[1]
        )

        top_probabilities, top_indices = torch.topk(
            probabilities,
            k=top_k,
            dim=1
        )

        top_probabilities = (
            top_probabilities[0]
            .cpu()
            .tolist()
        )

        top_indices = (
            top_indices[0]
            .cpu()
            .tolist()
        )

        labels = CLASS_NAMES[
            domain
        ]

        top_predictions = []

        for index, probability in zip(
            top_indices,
            top_probabilities
        ):

            class_name = (
                labels[index]
                if index < len(labels)
                else f"Class {index}"
            )

            top_predictions.append({

                "class_id": int(index),

                "class_name": class_name,

                "confidence": round(
                    float(probability),
                    4
                )

            })

        best = top_predictions[0]

        return {

            "class_id": best["class_id"],

            "class_name": best["class_name"],

            "confidence": best["confidence"],

            "top_5": top_predictions

        }


classification_service = ClassificationService()