import pandas as pd

class TrainingHistory:

    """
    Stores all training history.

    Keeps track of

    - Train Loss
    - Validation Loss
    - Accuracy
    - Precision
    - Recall
    - F1 Score
    - Learning Rate

    Used by

    • Trainer
    • Dashboard
    • Visualization
    """

    def __init__(self):

        self.reset()

    def reset(self):

        self.history = {

            "train_loss": [],

            "val_loss": [],

            "accuracy": [],

            "precision": [],

            "recall": [],

            "f1": [],

            "learning_rate": []

        }

    def update(

            self,

            train_loss,

            val_loss,

            metrics,

            learning_rate

    ):

        self.history["train_loss"].append(

            float(train_loss)

        )

        self.history["val_loss"].append(

            float(val_loss)

        )

        self.history["accuracy"].append(

            metrics["accuracy"]

        )

        self.history["precision"].append(

            metrics["precision"]

        )

        self.history["recall"].append(

            metrics["recall"]

        )

        self.history["f1"].append(

            metrics["f1"]

        )

        self.history["learning_rate"].append(

            learning_rate

        )

    def latest(self):

        if len(

                self.history["train_loss"]

        ) == 0:

            return None

        latest = {}

        for key in self.history:

            latest[key] = self.history[key][-1]

        return latest

    def best_accuracy(self):

        if len(

                self.history["accuracy"]

        ) == 0:

            return 0

        return max(

            self.history["accuracy"]

        )

    def best_f1(self):

        if len(

                self.history["f1"]

        ) == 0:

            return 0

        return max(

            self.history["f1"]

        )

    def best_validation_loss(self):

        if len(

                self.history["val_loss"]

        ) == 0:

            return None

        return min(

            self.history["val_loss"]

        )
    
    def save_csv(

            self,

            path

    ):

        pd.DataFrame(

            self.history

        ).to_csv(

            path,

            index=False

        )
    def state_dict(self):

        return self.history

    def load_state_dict(

            self,

            history

    ):

        self.history = history