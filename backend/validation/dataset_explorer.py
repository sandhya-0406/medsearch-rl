from collections import Counter


def explore_dataset(dataset):

    total_samples = len(dataset)

    domain_counts = Counter()

    class_counts = Counter()

    total_boxes = 0

    MRI_LABELS = {
    1: "Meningioma",
    2: "Glioma",
    3: "Pituitary"
    }

    print("Scanning dataset...")

    for idx in range(total_samples):

        sample = dataset[idx]

        domain = sample["domain"]

        domain_counts[domain] += 1

        labels = sample["labels"]

        total_boxes += len(labels)

        for label in labels:

            if domain == "MRI":
                label = MRI_LABELS.get(label, label)

            class_counts[str(label)] += 1

        if idx % 1000 == 0:

            print(
                f"{idx}/{total_samples}"
            )

    print("\n" + "=" * 50)
    print("DATASET SUMMARY")
    print("=" * 50)

    print(f"Total Samples: {total_samples}")

    print("\nDomain Counts")

    for domain, count in domain_counts.items():

        print(
            f"{domain}: {count}"
        )

    print("\nAverage Boxes Per Image")

    print(
        round(
            total_boxes / total_samples,
            3
        )
    )

    print("\nClass Distribution")

    for cls, count in class_counts.most_common():

        print(
            f"{cls}: {count}"
        )