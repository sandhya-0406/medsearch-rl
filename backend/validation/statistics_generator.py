from collections import Counter


MRI_LABELS = {
    1: "Meningioma",
    2: "Glioma",
    3: "Pituitary"
}


def generate_statistics(dataset):

    total_samples = len(dataset)

    print(f"Scanning {total_samples} samples...")

    domain_counts = Counter()
    class_counts = Counter()

    bbox_widths = []
    bbox_heights = []
    bbox_areas = []

    total_boxes = 0

    for idx in range(total_samples):

        if idx % 1000 == 0:
            print(f"{idx}/{total_samples}")

        sample = dataset[idx]

        domain = sample["domain"]
        domain_counts[domain] += 1

        # Class statistics
        for label in sample["labels"]:

            if domain == "MRI":
                label = MRI_LABELS.get(label, label)

            class_counts[str(label)] += 1

        # Bounding box statistics
        for bbox in sample["boxes"]:

            xmin, ymin, xmax, ymax = bbox

            width = xmax - xmin
            height = ymax - ymin
            area = width * height

            bbox_widths.append(width)
            bbox_heights.append(height)
            bbox_areas.append(area)

            total_boxes += 1

    print("\n" + "=" * 60)
    print("DATASET STATISTICS")
    print("=" * 60)

    # Domain counts
    print("\nDOMAIN COUNTS")
    print("-" * 60)

    for domain, count in domain_counts.items():

        percentage = (count / total_samples) * 100

        print(
            f"{domain}: {count} "
            f"({percentage:.2f}%)"
        )

    # Bounding box statistics
    print("\nBOUNDING BOX STATISTICS")
    print("-" * 60)

    print(f"Min Width : {min(bbox_widths):.2f}")
    print(f"Max Width : {max(bbox_widths):.2f}")
    print(f"Avg Width : {sum(bbox_widths)/len(bbox_widths):.2f}")

    print()

    print(f"Min Height: {min(bbox_heights):.2f}")
    print(f"Max Height: {max(bbox_heights):.2f}")
    print(f"Avg Height: {sum(bbox_heights)/len(bbox_heights):.2f}")

    print()

    print(f"Min Area  : {min(bbox_areas):.2f}")
    print(f"Max Area  : {max(bbox_areas):.2f}")
    print(f"Avg Area  : {sum(bbox_areas)/len(bbox_areas):.2f}")

    # Boxes per image
    print("\nGENERAL STATISTICS")
    print("-" * 60)

    print(
        f"Average Boxes/Image: "
        f"{total_boxes / total_samples:.2f}"
    )

    print(
        f"Total Bounding Boxes: "
        f"{total_boxes}"
    )

    # Top classes
    print("\nTOP 15 CLASSES")
    print("-" * 60)

    for cls, count in class_counts.most_common(15):

        print(f"{cls}: {count}")

    print("\nRAREST 15 CLASSES")
    print("-" * 60)

    for cls, count in sorted(
        class_counts.items(),
        key=lambda x: x[1]
    )[:15]:

        print(f"{cls}: {count}")

    # Return statistics for future RL design
    return {
        "total_samples": total_samples,
        "domain_counts": dict(domain_counts),
        "class_counts": dict(class_counts),
        "total_boxes": total_boxes,
        "avg_boxes_per_image": (
            total_boxes / total_samples
        ),
        "bbox_width_stats": {
            "min": min(bbox_widths),
            "max": max(bbox_widths),
            "avg": sum(bbox_widths) / len(bbox_widths)
        },
        "bbox_height_stats": {
            "min": min(bbox_heights),
            "max": max(bbox_heights),
            "avg": sum(bbox_heights) / len(bbox_heights)
        },
        "bbox_area_stats": {
            "min": min(bbox_areas),
            "max": max(bbox_areas),
            "avg": sum(bbox_areas) / len(bbox_areas)
        }
    }