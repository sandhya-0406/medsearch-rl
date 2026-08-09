from pathlib import Path

import cv2
import numpy as np
import torch
import torch.nn.functional as F

from backend.domain.domain_classifier import (
    DomainClassifier
)


class DomainService:
    """
    Dedicated 3-class domain router.

    Classes:
        0 -> MRI
        1 -> ESAD
        2 -> MESAD
    """

    CLASS_NAMES = [
        "MRI",
        "ESAD",
        "MESAD"
    ]

    IMAGE_SIZE = 224

    def __init__(
        self,
        checkpoint_path=None,
        device=None
    ):

        # -----------------------------------------------------
        # Device
        # -----------------------------------------------------

        if device is None:

            self.device = torch.device(
                "cuda"
                if torch.cuda.is_available()
                else "cpu"
            )

        else:

            self.device = torch.device(
                device
            )

        # -----------------------------------------------------
        # Checkpoint path
        # -----------------------------------------------------

        if checkpoint_path is None:

            project_root = (
                Path(__file__)
                .resolve()
                .parents[2]
            )

            checkpoint_path = (
                project_root
                / "backend"
                / "weights"
                / "domain"
                / "domain_classifier.pth"
            )

        self.checkpoint_path = Path(
            checkpoint_path
        )

        if not self.checkpoint_path.exists():

            raise FileNotFoundError(
                "Domain classifier checkpoint "
                f"not found:\n{self.checkpoint_path}"
            )

        # -----------------------------------------------------
        # Model
        # -----------------------------------------------------

        self.model = DomainClassifier(
            num_classes=3
        )

        checkpoint = torch.load(
            self.checkpoint_path,
            map_location=self.device,
            weights_only=False
        )

        # Your training script saved:
        #
        # {
        #     "model_state_dict": ...,
        #     "num_classes": 3,
        #     "class_names": ...,
        #     ...
        # }

        if "model_state_dict" in checkpoint:

            state_dict = (
                checkpoint[
                    "model_state_dict"
                ]
            )

        else:

            # Also support a raw state_dict
            state_dict = checkpoint

        self.model.load_state_dict(
            state_dict
        )

        self.model.to(
            self.device
        )

        self.model.eval()

        print(
            "Domain Classifier Loaded"
        )

        print(
            f"Path   : {self.checkpoint_path}"
        )

        print(
            f"Device : {self.device}"
        )

    # =========================================================
    # IMAGE PREPARATION
    # =========================================================

    def _prepare_image(
        self,
        image
    ):

        if image is None:

            raise ValueError(
                "Image is empty."
            )

        image = np.asarray(
            image
        )

        # -----------------------------------------------------
        # Grayscale -> RGB
        # -----------------------------------------------------

        if image.ndim == 2:

            image = np.stack(
                [
                    image,
                    image,
                    image
                ],
                axis=-1
            )

        # -----------------------------------------------------
        # BGRA -> RGB
        # -----------------------------------------------------

        elif (
            image.ndim == 3
            and image.shape[2] == 4
        ):

            image = cv2.cvtColor(
                image,
                cv2.COLOR_BGRA2RGB
            )

        # -----------------------------------------------------
        # BGR -> RGB
        #
        # cv2.imread / cv2.imdecode produces BGR.
        # -----------------------------------------------------

        elif (
            image.ndim == 3
            and image.shape[2] == 3
        ):

            image = cv2.cvtColor(
                image,
                cv2.COLOR_BGR2RGB
            )

        else:

            raise ValueError(
                f"Unsupported image shape: "
                f"{image.shape}"
            )

        # -----------------------------------------------------
        # Resize
        # -----------------------------------------------------

        image = cv2.resize(
            image,
            (
                self.IMAGE_SIZE,
                self.IMAGE_SIZE
            )
        )

        # -----------------------------------------------------
        # Match TRAINING preprocessing exactly
        #
        # Training used per-image min-max normalization:
        #
        #     (image - min) / (max - min)
        # -----------------------------------------------------

        image = image.astype(
            np.float32
        )

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

        # -----------------------------------------------------
        # HWC -> CHW
        # -----------------------------------------------------

        image = np.transpose(
            image,
            (2, 0, 1)
        )

        tensor = torch.tensor(
            image,
            dtype=torch.float32
        )

        tensor = tensor.unsqueeze(
            0
        )

        return tensor.to(
            self.device
        )

    # =========================================================
    # PREDICT
    # =========================================================

    def predict(
        self,
        image
    ):

        tensor = self._prepare_image(
            image
        )

        with torch.no_grad():

            logits = self.model(
                tensor
            )

            probabilities = F.softmax(
                logits,
                dim=1
            )

            confidence, prediction = (
                torch.max(
                    probabilities,
                    dim=1
                )
            )

        predicted_index = int(
            prediction.item()
        )

        predicted_domain = (
            self.CLASS_NAMES[
                predicted_index
            ]
        )

        confidence_value = float(
            confidence.item()
        )

        probability_values = (
            probabilities[0]
            .detach()
            .cpu()
            .tolist()
        )

        scores = {

            domain: round(
                float(
                    probability_values[index]
                ),
                4
            )

            for index, domain
            in enumerate(
                self.CLASS_NAMES
            )

        }

        return {

            "domain": predicted_domain,

            "confidence": round(
                confidence_value,
                4
            ),

            "scores": scores

        }


# =============================================================
# SINGLETON
# =============================================================

domain_service = DomainService()