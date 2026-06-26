import os

import matplotlib.pyplot as plt
import numpy as np

from sklearn.metrics import ConfusionMatrixDisplay


class TrainingVisualizer:

    """
    Visualization utilities for the classifier.

    Can plot

    • Loss
    • Accuracy
    • Precision
    • Recall
    • F1
    • Learning Rate
    • Confusion Matrix

    """

    def __init__(

            self,

            save_dir="classification_results"

    ):

        self.save_dir = save_dir

        os.makedirs(

            save_dir,

            exist_ok=True

        )

    #######

    def plot_loss(

            self,

            history

    ):

        plt.figure(figsize=(8,5))

        plt.plot(

            history["train_loss"],

            label="Train"

        )

        plt.plot(

            history["val_loss"],

            label="Validation"

        )

        plt.xlabel("Epoch")

        plt.ylabel("Loss")

        plt.title("Training Loss")

        plt.legend()

        plt.grid(True)

        plt.tight_layout()

        plt.savefig(

            os.path.join(

                self.save_dir,

                "loss.png"

            )

        )

        plt.close()

    #######

    def plot_accuracy(

            self,

            history

    ):

        plt.figure(figsize=(8,5))

        plt.plot(

            history["accuracy"]

        )

        plt.xlabel("Epoch")

        plt.ylabel("Accuracy")

        plt.title("Validation Accuracy")

        plt.grid(True)

        plt.tight_layout()

        plt.savefig(

            os.path.join(

                self.save_dir,

                "accuracy.png"

            )

        )

        plt.close()

    #######

    def plot_precision(

            self,

            history

    ):

        plt.figure(figsize=(8,5))

        plt.plot(

            history["precision"]

        )

        plt.xlabel("Epoch")

        plt.ylabel("Precision")

        plt.grid(True)

        plt.tight_layout()

        plt.savefig(

            os.path.join(

                self.save_dir,

                "precision.png"

            )

        )

        plt.close()

    #######

    def plot_recall(

            self,

            history

    ):

        plt.figure(figsize=(8,5))

        plt.plot(

            history["recall"]

        )

        plt.xlabel("Epoch")

        plt.ylabel("Recall")

        plt.grid(True)

        plt.tight_layout()

        plt.savefig(

            os.path.join(

                self.save_dir,

                "recall.png"

            )

        )

        plt.close()

    #######

    def plot_f1(

            self,

            history

    ):

        plt.figure(figsize=(8,5))

        plt.plot(

            history["f1"]

        )

        plt.xlabel("Epoch")

        plt.ylabel("F1")

        plt.grid(True)

        plt.tight_layout()

        plt.savefig(

            os.path.join(

                self.save_dir,

                "f1.png"

            )

        )

        plt.close()

    #######

    def plot_learning_rate(

            self,

            history

    ):

        plt.figure(figsize=(8,5))

        plt.plot(

            history["learning_rate"]

        )

        plt.xlabel("Epoch")

        plt.ylabel("Learning Rate")

        plt.grid(True)

        plt.tight_layout()

        plt.savefig(

            os.path.join(

                self.save_dir,

                "learning_rate.png"

            )

        )

        plt.close()

    #######

    def plot_confusion_matrix(

            self,

            confusion_matrix,

            class_names

    ):

        fig, ax = plt.subplots(

            figsize=(8,8)

        )

        disp = ConfusionMatrixDisplay(

            confusion_matrix,

            display_labels=class_names

        )

        disp.plot(

            cmap="Blues",

            ax=ax,

            colorbar=False

        )

        plt.tight_layout()

        plt.savefig(

            os.path.join(

                self.save_dir,

                "confusion_matrix.png"

            )

        )

        plt.close()

    ###########################################################

    def plot_dashboard(

            self,

            history

    ):

        fig, axes = plt.subplots(

            3,

            2,

            figsize=(14,12)

        )

        axes = axes.flatten()

        plots = [

            ("train_loss","val_loss","Loss"),

            ("accuracy",None,"Accuracy"),

            ("precision",None,"Precision"),

            ("recall",None,"Recall"),

            ("f1",None,"F1 Score"),

            ("learning_rate",None,"Learning Rate")

        ]

        for ax,(a,b,title) in zip(

                axes,

                plots

        ):

            ax.plot(

                history[a],

                label=a

            )

            if b is not None:

                ax.plot(

                    history[b],

                    label=b

                )

            ax.set_title(title)

            ax.grid(True)

            ax.legend()

        plt.tight_layout()

        plt.savefig(

            os.path.join(

                self.save_dir,

                "training_dashboard.png"

            )

        )

        plt.close()


    ###########################################################

    def plot_all(

            self,

            history

    ):

        self.plot_dashboard(history)

        self.plot_loss(history)

        self.plot_accuracy(history)

        self.plot_precision(history)

        self.plot_recall(history)

        self.plot_f1(history)

        self.plot_learning_rate(history)