import sys
from pathlib import Path

project_root = Path(__file__).resolve().parents[2]
sys.path.append(str(project_root))

annotation_dir = Path("data/mesad/train/annotations")

classes = set()

for file in annotation_dir.glob("*.bboxes.labels.tsv"):

    with open(file, "r") as f:

        for line in f:

            label = line.strip()

            if label:
                classes.add(label)

classes = sorted(classes)

print("Number of classes:", len(classes))

for cls in classes:
    print(cls)
