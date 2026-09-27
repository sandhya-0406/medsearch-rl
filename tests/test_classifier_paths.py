from pathlib import Path

from backend.classification.config import Config


def test_classifier_checkpoint_dir_points_to_backend_weights():
    config = Config()
    checkpoint_dir = Path(config.checkpoint_dir)

    assert checkpoint_dir.exists(), f"Expected checkpoint dir to exist: {checkpoint_dir}"
    assert checkpoint_dir.is_dir(), f"Expected checkpoint dir to be a directory: {checkpoint_dir}"
    assert checkpoint_dir.name == "classifiers"
