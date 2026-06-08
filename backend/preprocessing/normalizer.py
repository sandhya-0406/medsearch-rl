import numpy as np

def normalize_image(image):

    image = image.astype(np.float32)

    # MRI-style intensity normalization
    if image.max() > 255:

        image_min = image.min()
        image_max = image.max()

        if image_max > image_min:

            image = (
                image - image_min
            ) / (
                image_max - image_min
            )

    # RGB images
    else:

        image = image / 255.0

    return image

def normalize_sample(sample):

    output = sample.copy()

    output["image"] = normalize_image(
        sample["image"]
    )

    return output