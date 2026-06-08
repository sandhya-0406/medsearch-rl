import numpy as np


def validate_image(image):
    """
    Validate image properties.
    """

    assert isinstance(image, np.ndarray), \
        "Image is not a numpy array."

    assert image.shape == (512, 512, 3), \
        f"Invalid shape: {image.shape}"

    assert image.dtype == np.float32, \
        f"Invalid dtype: {image.dtype}"

    assert image.min() >= 0.0, \
        f"Minimum pixel value below 0: {image.min()}"

    assert image.max() <= 1.0, \
        f"Maximum pixel value above 1: {image.max()}"

    return True

def validate_random_samples(dataset, n=100):

    import random

    indices = random.sample(
        range(len(dataset)),
        n
    )

    for idx in indices:

        sample = dataset[idx]

        validate_sample(sample)

    print(f" {n} random samples passed")

def validate_bboxes(bboxes, image_shape):
    """
    Validate bounding boxes.
    """

    h, w = image_shape[:2]

    for bbox in bboxes:

        xmin, ymin, xmax, ymax = bbox

        assert xmin < xmax, \
            f"Invalid bbox: {bbox}"

        assert ymin < ymax, \
            f"Invalid bbox: {bbox}"

        assert xmin >= 0
        assert ymin >= 0

        assert xmax <= w, \
            f"BBox exceeds width: {bbox}"

        assert ymax <= h, \
            f"BBox exceeds height: {bbox}"

    return True

def validate_labels(labels, boxes):

    assert labels is not None, \
        "Labels are None."

    assert boxes is not None, \
        "Boxes are None."

    assert len(labels) == len(boxes), \
        f"Label-box mismatch: {len(labels)} labels vs {len(boxes)} boxes"

    return True

def validate_sample(sample):

    assert "image" in sample
    assert "boxes" in sample
    assert "labels" in sample

    image = sample["image"]
    boxes = sample["boxes"]
    labels = sample["labels"]

    validate_image(image)
    validate_bboxes(boxes, image.shape)
    validate_labels(labels, boxes)

    return True

def validate_dataset(dataset):

    total = len(dataset)

    for idx in range(total):

        sample = dataset[idx]

        try:
            validate_sample(sample)

        except Exception as e:

            print(f"\nFailed at sample {idx}")
            print(f"Domain: {sample['domain']}")
            print(f"Labels: {sample['labels']}")
            print(f"Boxes: {sample['boxes']}")

            raise e

    print(f"✓ Dataset passed validation ({total} samples)")