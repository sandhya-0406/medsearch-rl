import cv2

from backend.preprocessing.bbox_utils import scale_bboxes


TARGET_SIZE = (512, 512)


def resize_sample(sample):

    image = sample["image"]

    original_height, original_width = image.shape[:2]

    resized_image = cv2.resize(
        image,
        TARGET_SIZE
    )

    boxes = scale_bboxes(
        sample["boxes"],
        original_width,
        original_height,
        TARGET_SIZE[0],
        TARGET_SIZE[1]
    )

    output = sample.copy()

    output["image"] = resized_image
    output["boxes"] = boxes

    return output