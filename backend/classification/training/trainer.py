import time

import torch
import torch.nn as nn
from torch.amp import autocast, GradScaler

from tqdm import tqdm

from backend.classification.training.metrics import (
    ClassificationMetrics
)

from backend.classification.utils.history import (
    TrainingHistory
)

from backend.classification.utils.checkpoint import (
    CheckpointManager
)


class Trainer:

    """
    Generic Medical Classification Trainer

    Supports

    ✓ MRI
    ✓ ESAD
    ✓ MESAD

    Features

    ✓ AMP
    ✓ Gradient Clipping
    ✓ Scheduler
    ✓ Checkpoints
    ✓ History
    ✓ Metrics
    ✓ Early Stopping
    """

    def __init__(

            self,

            model,

            optimizer,

            criterion,

            scheduler=None,

            device=None,

            checkpoint_dir="checkpoints",

            gradient_clip=1.0,

            mixed_precision=True,

            early_stopping=10,

            save_best="f1"

    ):
        # Device

        if device is None:

            device = torch.device(

                "cuda"

                if torch.cuda.is_available()

                else "cpu"

            )

        self.device = device

        self.model = model.to(

            self.device

        )

        self.optimizer = optimizer

        self.criterion = criterion

        self.scheduler = scheduler

        self.gradient_clip = gradient_clip

        self.mixed_precision = (

            mixed_precision

            and

            torch.cuda.is_available()

        )

        self.scaler = GradScaler(

            enabled=self.mixed_precision

        )

        self.history = TrainingHistory()

        self.checkpoint = CheckpointManager(

            checkpoint_dir

        )

        self.early_stopping = early_stopping

        self.save_best = save_best

        self.best_metric = None

        self.best_epoch = 0

        self.wait = 0

    # Learning Rate
  
    def get_learning_rate(

            self

    ):

        return self.optimizer.param_groups[0]["lr"]

    # Metric Selection

    def current_metric(

            self,

            metrics,

            val_loss

    ):

        """
        Determines which metric
        is used to save checkpoints.
        """

        if self.save_best == "loss":

            return -val_loss

        elif self.save_best == "accuracy":

            return metrics["accuracy"]

        elif self.save_best == "precision":

            return metrics["precision"]

        elif self.save_best == "recall":

            return metrics["recall"]

        elif self.save_best == "f1":

            return metrics["f1"]

        raise ValueError(

            f"Unknown metric: {self.save_best}"

        )

    # Gradient Clipping
 
    def clip_gradients(

            self

    ):

        if self.gradient_clip is None:

            return

        torch.nn.utils.clip_grad_norm_(

            self.model.parameters(),

            self.gradient_clip

        )
    # Epoch Header
 
    def print_epoch_header(

            self,

            epoch,

            epochs

    ):

        print()

        print("=" * 70)

        print(

            f"Epoch {epoch}/{epochs}"

        )

        print("=" * 70)

        print(

            f"Learning Rate : "

            f"{self.get_learning_rate():.6f}"

        )

        print()

    # Epoch Summary

    def print_epoch_summary(

            self,

            train_loss,

            val_loss,

            metrics,

            elapsed

    ):

        print()

        print("-" * 70)

        print(

            f"Train Loss : "

            f"{train_loss:.4f}"

        )

        print(

            f"Val Loss   : "

            f"{val_loss:.4f}"

        )

        print()

        print(

            f"Accuracy   : "

            f"{metrics['accuracy']:.4f}"

        )

        print(

            f"Precision  : "

            f"{metrics['precision']:.4f}"

        )

        print(

            f"Recall     : "

            f"{metrics['recall']:.4f}"

        )

        print(

            f"F1 Score   : "

            f"{metrics['f1']:.4f}"

        )

        print()

        print(

            f"Elapsed    : "

            f"{elapsed:.2f} sec"

        )

        print("-" * 70)

    # Early Stopping Check

    def should_stop(

            self,

            current

    ):

        if self.best_metric is None:

            self.best_metric = current

            return False

        if current > self.best_metric:

            self.best_metric = current

            self.wait = 0

            return False

        self.wait += 1

        return self.wait >= self.early_stopping
    
    # Train One Epoch

    def train_one_epoch(

            self,

            train_loader,

            epoch,

            epochs

    ):

        self.model.train()

        running_loss = 0.0

        progress_bar = tqdm(

            train_loader,

            desc=f"Training [{epoch}/{epochs}]",

            leave=False

        )

        for images, labels in progress_bar:

            images = images.to(

                self.device,

                non_blocking=True

            )

            labels = labels.to(

                self.device,

                non_blocking=True

            )

            # Forward

            self.optimizer.zero_grad(

                set_to_none=True

            )

            with autocast(

                enabled=self.mixed_precision

            ):

                outputs = self.model(

                    images

                )

                loss = self.criterion(

                    outputs,

                    labels

                )

            # Backward

            self.scaler.scale(

                loss

            ).backward()

            # Gradient Clipping

            self.scaler.unscale_(

                self.optimizer

            )

            self.clip_gradients()
            
            # Optimizer Step

            self.scaler.step(

                self.optimizer

            )

            self.scaler.update()

            # Statistics
            
            running_loss += loss.item()

            avg_loss = running_loss / (

                progress_bar.n + 1

            )

            progress_bar.set_postfix(

                loss=f"{avg_loss:.4f}"

            )

        progress_bar.close()

        epoch_loss = running_loss / len(

            train_loader

        )

        return epoch_loss

    # Validation

    @torch.no_grad()

    def validate(

            self,

            val_loader

    ):

        self.model.eval()

        running_loss = 0.0

        metrics = ClassificationMetrics(

            val_loader.dataset.dataset.num_classes

        )

        progress_bar = tqdm(

            val_loader,

            desc="Validation",

            leave=False

        )

        for images, labels in progress_bar:

            images = images.to(

                self.device,

                non_blocking=True

            )

            labels = labels.to(

                self.device,

                non_blocking=True

            )

            
            # Forward
            

            with autocast(

                enabled=self.mixed_precision

            ):

                outputs = self.model(

                    images

                )

                loss = self.criterion(

                    outputs,

                    labels

                )

            
            # Statistics
            

            running_loss += loss.item()

            metrics.update(

                outputs,

                labels

            )

            avg_loss = running_loss / (

                progress_bar.n + 1

            )

            progress_bar.set_postfix(

                loss=f"{avg_loss:.4f}"

            )

        progress_bar.close()

        val_loss = running_loss / len(

            val_loader

        )

        results = metrics.summary()

        return val_loss, results
    
    # Fit

    def fit(

            self,

            train_loader,

            val_loader,

            epochs

    ):

        for epoch in range(

                1,

                epochs + 1

        ):

            self.print_epoch_header(

                epoch,

                epochs

            )

            start_time = time.time()
           
            # Train
            
            train_loss = self.train_one_epoch(

                train_loader,

                epoch,

                epochs

            )
    
            # Validation

            val_loss, metrics = self.validate(

                val_loader

            )
     
            # Scheduler
   
            if self.scheduler is not None:

                if self.scheduler.__class__.__name__ == "ReduceLROnPlateau":

                    self.scheduler.step(val_loss)

                else:

                    self.scheduler.step()
      
            # History
    
            self.history.update(

                train_loss=train_loss,

                val_loss=val_loss,

                metrics=metrics,

                learning_rate=self.get_learning_rate()

            )

            
            # Time
            

            elapsed = time.time() - start_time

            self.print_epoch_summary(

                train_loss,

                val_loss,

                metrics,

                elapsed

            )

            # Save Last Checkpoint
            
            self.checkpoint.save(

                filename="last_classifier.pth",

                model=self.model,

                optimizer=self.optimizer,

                scheduler=self.scheduler,

                epoch=epoch,

                history=self.history,

                best_metric=self.best_metric

            )

            
            # Best Checkpoint
            

            current = self.current_metric(

                metrics,

                val_loss

            )

            improved = (

                self.best_metric is None

                or

                current > self.best_metric

            )

            if improved:

                self.best_metric = current

                self.best_epoch = epoch

                self.wait = 0

                print()

                print(

                    "★ New Best Model Saved"

                )

                self.checkpoint.save(

                    filename="best_classifier.pth",

                    model=self.model,

                    optimizer=self.optimizer,

                    scheduler=self.scheduler,

                    epoch=epoch,

                    history=self.history,

                    best_metric=self.best_metric

                )

            else:

                self.wait += 1

                print()

                print(

                    f"No improvement "

                    f"({self.wait}/{self.early_stopping})"

                )

            # Early Stopping
            if self.wait >= self.early_stopping:

                print()

                print(

                    "Early stopping triggered."

                )

                print(

                    f"Best Epoch : "

                    f"{self.best_epoch}"

                )

                break
        # Training Complete

        print()

        print("=" * 70)

        print("Training Finished")

        print("=" * 70)

        print(

            f"Best Epoch : {self.best_epoch}"

        )

        print(

            f"Best {self.save_best} : "

            f"{self.best_metric:.4f}"

        )

        print("=" * 70)

        return self.history