import sys
from pathlib import Path
from ultralytics import YOLO

project_root = Path(__file__).resolve().parents[2]
sys.path.append(str(project_root))

model = YOLO("yolov8n.pt")

model.train(
    data="experiments/yolov8/brain_dataset.yaml",
    epochs=50,
    imgsz=512,
    batch=16,
    project="results/yolov8",
    name="brain"
)