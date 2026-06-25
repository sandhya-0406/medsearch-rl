import torch
import torch.nn as nn
import torch.optim as optim

# Optimizer Factory

def build_optimizer(

        model,

        config

):

    name = config.optimizer.lower()

    if name == "adam":

        return optim.Adam(

            model.parameters(),

            lr=config.learning_rate,

            weight_decay=config.weight_decay

        )

    elif name == "adamw":

        return optim.AdamW(

            model.parameters(),

            lr=config.learning_rate,

            weight_decay=config.weight_decay

        )

    elif name == "sgd":

        return optim.SGD(

            model.parameters(),

            lr=config.learning_rate,

            momentum=0.9,

            weight_decay=config.weight_decay

        )

    raise ValueError(

        f"Unknown optimizer: {name}"

    )

# Scheduler Factory

def build_scheduler(

        optimizer,

        config

):

    if config.scheduler is None:

        return None

    name = config.scheduler.lower()

    if name == "cosine":

        return optim.lr_scheduler.CosineAnnealingLR(

            optimizer,

            T_max=config.epochs,

            eta_min=config.eta_min

        )

    elif name == "step":

        return optim.lr_scheduler.StepLR(

            optimizer,

            step_size=10,

            gamma=0.1

        )

    elif name == "multistep":

        return optim.lr_scheduler.MultiStepLR(

            optimizer,

            milestones=[20,40],

            gamma=0.1

        )

    elif name == "plateau":

        return optim.lr_scheduler.ReduceLROnPlateau(

            optimizer,

            mode="min",

            factor=0.1,

            patience=5

        )

    raise ValueError(

        f"Unknown scheduler: {name}"

    )

# Loss Factory

def build_loss(

        config,

        class_weights=None

):

    if class_weights is not None:

        class_weights = class_weights.to(

            config.device

        )

    return nn.CrossEntropyLoss(

        weight=class_weights

    )

# Model Summary

def count_parameters(

        model

):

    return sum(

        p.numel()

        for p in model.parameters()

        if p.requires_grad

    )



#
# Print Experiment
#


def print_experiment(

        model,

        config

):

    print()

    print("="*70)

    print("Classification Experiment")

    print("="*70)

    print(f"Dataset        : {config.dataset}")

    print(f"Device         : {config.device}")

    print(f"Epochs         : {config.epochs}")

    print(f"Batch Size     : {config.batch_size}")

    print(f"Learning Rate  : {config.learning_rate}")

    print(f"Optimizer      : {config.optimizer}")

    print(f"Scheduler      : {config.scheduler}")

    print(f"Image Size     : {config.image_size}")

    print(f"Mixed Precision: {config.mixed_precision}")

    print()

    print(

        "Trainable Parameters:",

        f"{count_parameters(model):,}"

    )

    print("="*70)