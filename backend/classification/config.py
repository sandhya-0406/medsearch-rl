from dataclasses import dataclass
import torch


@dataclass
class Config:

    
    # Dataset
    

    dataset: str = "mri"

    
    # Paths
    

    mri_path: str = "data/figshare"

    esad_path: str = "data/esad"

    mesad_path: str = "data/mesad"

    
    # Image
    

    image_size: int = 224

    padding: float = 0.20

    
    # Data
    

    train_split: float = 0.80

    val_split: float = 0.10

    test_split: float = 0.10

    batch_size: int = 16

    num_workers: int = 4

    shuffle: bool = True

    pin_memory: bool = True

    
    # Training
    

    epochs: int = 2

    learning_rate: float = 1e-3

    weight_decay: float = 1e-4

    gradient_clip: float = 1.0

    mixed_precision: bool = True

    early_stopping: int = 10

    
    # Optimizer
    

    optimizer: str = "adamw"

    
    # Scheduler
    

    scheduler: str = "cosine"

    eta_min: float = 1e-6

    
    # Checkpoints
    

    checkpoint_dir: str = "checkpoints"

    save_best: str = "f1"

    
    # Logging
    

    result_dir: str = "classification_results"

    verbose: bool = True

    
    # Inference
    

    confidence_threshold: float = 0.5

    top_k: int = 3

    
    # Misc

    seed: int = 42

    @property
    def device(self):

        return torch.device(

            "cuda"

            if torch.cuda.is_available()

            else "cpu"

        )