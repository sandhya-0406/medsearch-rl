import torch


def collate_fn(batch):

    images = []
    targets = []

    for sample in batch:

        image = torch.tensor(
            sample["image"],
            dtype=torch.float32
        ).permute(2, 0, 1)

        boxes = torch.tensor(
            sample["boxes"],
            dtype=torch.float32
        )

        labels = torch.tensor(
            sample["labels"],
            dtype=torch.int64
        )

        target = {
            "boxes": boxes,
            "labels": labels
        }

        images.append(image)
        targets.append(target)

    return images, targets