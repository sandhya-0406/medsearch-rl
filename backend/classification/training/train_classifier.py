import random
import numpy as np
import torch
from torch.utils.data import (
    DataLoader,
    Subset
)
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[3]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.classification.config import Config

from backend.classification.datasets.unified_classification_dataset import (
    UnifiedClassificationDataset
)

from backend.classification.models import (
    MedicalClassifier
)

from backend.classification.utils.factories import (

    build_optimizer,

    build_scheduler,

    build_loss,

    print_experiment

)

from backend.classification.training.trainer import (
    Trainer
)

from backend.classification.utils.visualization import (
    TrainingVisualizer
)

from backend.classification.utils.config_utils import save_config

# Reproducibility

def set_seed(seed):

    random.seed(seed)

    np.random.seed(seed)

    torch.manual_seed(seed)

    if torch.cuda.is_available():

        torch.cuda.manual_seed_all(seed)

    torch.backends.cudnn.deterministic = True

    torch.backends.cudnn.benchmark = False

# Dataset
def build_dataset(config):

    return UnifiedClassificationDataset(
        dataset_type=config.dataset,
        mri_path=config.mri_path,
        esad_path=config.esad_path,
        mesad_path=config.mesad_path,
        image_size=config.image_size,
        padding=config.padding,
        train=True
    )

# def build_datasets(config):

#     train_dataset = UnifiedClassificationDataset(

#         dataset_type=config.dataset,

#         mri_path=config.mri_path,

#         esad_path=config.esad_path,

#         mesad_path=config.mesad_path,

#         image_size=config.image_size,

#         padding=config.padding,

#         train=True

#     )

#     val_dataset = UnifiedClassificationDataset(

#         dataset_type=config.dataset,

#         mri_path=config.mri_path,

#         esad_path=config.esad_path,

#         mesad_path=config.mesad_path,

#         image_size=config.image_size,

#         padding=config.padding,

#         train=False

#     )

#     return train_dataset, val_dataset

# Train / Validation Split

def build_dataloaders(

        train_dataset,

        val_dataset,

        config

):

    total = len(train_dataset)

    train_size = int(
        total * config.train_split
    )

    val_size = int(
        total * config.val_split
    )

    test_size = total - train_size - val_size

    generator = torch.Generator().manual_seed(
        config.seed
    )

    indices = torch.randperm(
        total,
        generator=generator
    ).tolist()

    train_indices = indices[:train_size]

    val_indices = indices[
        train_size:
        train_size + val_size
    ]

    test_indices = indices[
        train_size + val_size:
    ]

    ####################################################

    train_subset = Subset(

        train_dataset,

        train_indices

    )

    val_subset = Subset(

        val_dataset,

        val_indices

    )

    test_subset = Subset(

        val_dataset,

        test_indices

    )

    ####################################################

    train_loader = DataLoader(

        train_subset,

        batch_size=config.batch_size,

        shuffle=True,

        num_workers=config.num_workers,

        pin_memory=config.pin_memory

    )

    val_loader = DataLoader(

        val_subset,

        batch_size=config.batch_size,

        shuffle=False,

        num_workers=config.num_workers,

        pin_memory=config.pin_memory

    )

    test_loader = DataLoader(

        test_subset,

        batch_size=config.batch_size,

        shuffle=False,

        num_workers=config.num_workers,

        pin_memory=config.pin_memory

    )

    return (

        train_loader,

        val_loader,

        test_loader

    )

# Compute Class Weights

def compute_class_weights(train_subset, num_classes):

    counts = torch.zeros(num_classes)

    for idx in train_subset.indices:
        label = train_subset.dataset.samples[idx]["label"]
        counts[label] += 1

    weights = 1.0 / (counts + 1e-6)
    weights = weights / weights.sum() * num_classes

    return weights

#
# Build Model
#

def build_model(dataset):

    model = MedicalClassifier(

        num_classes=dataset.num_classes

    )

    return model


#
# Main Training
#

def train(config):

    
    # Seed
    

    set_seed(

        config.seed

    )

    
    # Dataset
    

    dataset = build_dataset(config)

    train_loader, val_loader, test_loader = build_dataloaders(
    dataset,
    config
    )

    
    # Model
    

    model = build_model(dataset)

    model = model.to(config.device)

    
    # Optimizer
    

    optimizer = build_optimizer(

        model,

        config

    )

    
    # Scheduler
    

    scheduler = build_scheduler(

        optimizer,

        config

    )

    
    # Class Weights
    

    class_weights = compute_class_weights(
    train_loader.dataset,
    dataset.num_classes
    )

    
    # Loss
    

    criterion = build_loss(

        config,

        class_weights

    )

    
    # Trainer
    

    trainer = Trainer(

        model=model,

        optimizer=optimizer,

        criterion=criterion,

        scheduler=scheduler,

        device=config.device,

        checkpoint_dir=config.checkpoint_dir,

        gradient_clip=config.gradient_clip,

        mixed_precision=config.mixed_precision,

        early_stopping=config.early_stopping,

        save_best=config.save_best

    )

    save_config(

    config,

    f"{config.checkpoint_dir}/experiment_config.json"

)
    
    
    # Experiment Summary
    

    print_experiment(

        model,

        config

    )

    print()

    print(

        f"Training Samples   : "

        f"{len(train_loader.dataset)}"

    )

    print(

        f"Validation Samples : "

        f"{len(val_loader.dataset)}"

    )

    print(

        f"Test Samples       : "

        f"{len(test_loader.dataset)}"

    )

    print()

    print(

        f"Classes            : "

        f"{dataset.num_classes}"

    )

    print()

    
    # Train
    

    history = trainer.fit(

        train_loader=train_loader,

        val_loader=val_loader,

        epochs=config.epochs

    )

    
    # Visualization
    

    visualizer = TrainingVisualizer(

        config.result_dir

    )

    visualizer.plot_all(

        history.state_dict()

    )

    history.save_csv(

    f"{config.result_dir}/history.csv"

    )

    print()

    print("=" * 70)

    print("Training Complete!")

    print("=" * 70)

    print()

    return trainer


#
# Main
#

def main():

    # Select Dataset
    
    config = Config(dataset="mri")

    # config = ESADConfig()

    # config = MESADConfig()

    train(

        config

    )

if __name__ == "__main__":

    main()