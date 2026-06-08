import numpy as np
from backend.preprocessing.image_transforms import resize_sample
from backend.preprocessing.normalizer import normalize_sample


def preprocess_sample(sample):

    sample = resize_sample(sample)
    sample = normalize_sample(sample)
    image = sample["image"]

    # Convert grayscale MRI to RGB
    if image.ndim == 2:

        image = np.stack(
            [image, image, image],
            axis=-1
        )

    sample["image"] = image
    return sample