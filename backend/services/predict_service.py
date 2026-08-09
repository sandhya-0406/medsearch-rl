import time

import cv2
import numpy as np

from backend.services.domain_service import (
    domain_service
)

from backend.services.localization_service import (
    LocalizationService
)

from backend.services.classification_service import (
    ClassificationService
)

from backend.core.model_manager import (
    model_manager
)


class PredictService:
    """
    Complete MedSearch-RL inference pipeline.

    Flow:

        Image
          ↓
        Domain Classifier
          ↓
        Expert RL Agent
          ↓
        Localization
          ↓
        ROI Extraction
          ↓
        Expert Medical Classifier
          ↓
        Final Prediction
    """

    def __init__(
        self,
        model_manager_instance=None
    ):

        self.model_manager = (
            model_manager_instance
            if model_manager_instance is not None
            else model_manager
        )

        # Dedicated trained domain classifier
        self.domain_service = domain_service

        # RL localization
        self.localization_service = (
            LocalizationService(
                model_manager=self.model_manager
            )
        )

        # Medical classification
        self.classification_service = (
            ClassificationService(
                model_manager_instance=self.model_manager
            )
        )

    # =========================================================
    # IMAGE VALIDATION
    # =========================================================

    def _validate_image(
        self,
        image
    ):

        if image is None:

            raise ValueError(
                "Image could not be loaded."
            )

        if not isinstance(
            image,
            np.ndarray
        ):

            raise TypeError(
                "Image must be a numpy array."
            )

        if image.size == 0:

            raise ValueError(
                "Image is empty."
            )

        if image.ndim not in (
            2,
            3
        ):

            raise ValueError(
                "Unsupported image dimensions."
            )

    # =========================================================
    # IMAGE PREPARATION
    # =========================================================

    def _prepare_image(
        self,
        image
    ):

        self._validate_image(
            image
        )

        # -----------------------------------------------------
        # Grayscale → 3 channel
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
        # RGBA → RGB/BGR-compatible 3 channel
        # -----------------------------------------------------

        elif (
            image.ndim == 3
            and image.shape[2] == 4
        ):

            image = cv2.cvtColor(
                image,
                cv2.COLOR_BGRA2BGR
            )

        return image

    # =========================================================
    # ROI EXTRACTION
    # =========================================================

    def _crop_roi(
        self,
        image,
        bbox
    ):

        x = int(
            bbox["x"]
        )

        y = int(
            bbox["y"]
        )

        width = int(
            bbox["width"]
        )

        height = int(
            bbox["height"]
        )

        image_height, image_width = (
            image.shape[:2]
        )

        # -----------------------------------------------------
        # Clamp coordinates
        # -----------------------------------------------------

        x1 = max(
            0,
            min(
                x,
                image_width - 1
            )
        )

        y1 = max(
            0,
            min(
                y,
                image_height - 1
            )
        )

        x2 = max(
            x1 + 1,
            min(
                x + width,
                image_width
            )
        )

        y2 = max(
            y1 + 1,
            min(
                y + height,
                image_height
            )
        )

        roi = image[
            y1:y2,
            x1:x2
        ]

        if roi.size == 0:

            raise RuntimeError(
                "RL localization produced "
                "an empty ROI."
            )

        return roi

    # =========================================================
    # MAIN PREDICTION
    # =========================================================

    def predict(
        self,
        image
    ):

        start_time = (
            time.perf_counter()
        )

        # -----------------------------------------------------
        # 1. PREPARE
        # -----------------------------------------------------

        image = self._prepare_image(
            image
        )

        # -----------------------------------------------------
        # 2. AUTOMATIC DOMAIN IDENTIFICATION
        # -----------------------------------------------------

        domain_result = (
            self.domain_service.predict(
                image
            )
        )

        domain = domain_result[
            "domain"
        ]

        # -----------------------------------------------------
        # 3. RL LOCALIZATION
        # -----------------------------------------------------

        localization = (
            self.localization_service.localize(
                image,
                domain
            )
        )

        bbox = localization[
            "bbox"
        ]

        # -----------------------------------------------------
        # 4. EXTRACT ROI
        # -----------------------------------------------------

        roi = self._crop_roi(
            image,
            bbox
        )

        # -----------------------------------------------------
        # 5. MEDICAL CLASSIFICATION
        # -----------------------------------------------------

        classification = (
            self.classification_service.classify(
                roi,
                domain
            )
        )

        # -----------------------------------------------------
        # 6. TOTAL TIME
        # -----------------------------------------------------

        processing_time = (
            time.perf_counter()
            - start_time
        )

        # -----------------------------------------------------
        # 7. RESPONSE
        # -----------------------------------------------------

        return {

            "success": True,

            "processing_time": round(
                processing_time,
                4
            ),

            "domain": {

                "name": domain,

                "confidence": (
                    domain_result[
                        "confidence"
                    ]
                ),

                "scores": (
                    domain_result[
                        "scores"
                    ]
                )

            },

            "localization": {

                "bbox": bbox,

                "trajectory": (
                    localization[
                        "trajectory"
                    ]
                ),

                "actions": (
                    localization[
                        "actions"
                    ]
                ),

                "windows": (
                    localization[
                        "windows"
                    ]
                ),

                "steps": (
                    localization[
                        "steps"
                    ]
                ),

                "processing_time": (
                    localization[
                        "processing_time"
                    ]
                )

            },

            "classification": {

                "class_id": (
                    classification[
                        "class_id"
                    ]
                ),

                "class_name": (
                    classification[
                        "class_name"
                    ]
                ),

                "confidence": (
                    classification[
                        "confidence"
                    ]
                ),

                "top_5": (
                    classification[
                        "top_5"
                    ]
                )

            }

        }


# =============================================================
# SINGLETON
# =============================================================

predict_service = PredictService(
    model_manager_instance=model_manager
)