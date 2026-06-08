import random
import matplotlib.pyplot as plt
import matplotlib.patches as patches


def draw_sample(sample):

    image = sample["image"]
    boxes = sample["boxes"]
    labels = sample["labels"]

    fig, ax = plt.subplots(figsize=(8, 8))

    ax.imshow(image)

    for bbox, label in zip(boxes, labels):

        xmin, ymin, xmax, ymax = bbox

        rect = patches.Rectangle(
            (xmin, ymin),
            xmax - xmin,
            ymax - ymin,
            fill=False
        )

        ax.add_patch(rect)

        ax.text(
            xmin,
            ymin - 5,
            str(label)
        )

    plt.title(sample["domain"])
    plt.axis("off")
    plt.show()

def verify_random_samples(
    dataset,
    n=10
):

    indices = random.sample(
        range(len(dataset)),
        n
    )

    for idx in indices:

        sample = dataset[idx]

        print(
            f"\nSample {idx}"
        )

        print(
            f"Domain: {sample['domain']}"
        )

        draw_sample(sample)