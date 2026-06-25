import torch


class ClassificationMetrics:

    """
    Computes classification metrics over one epoch.

    Metrics

    - Accuracy
    - Precision (macro)
    - Recall (macro)
    - F1 Score (macro)
    """

    def __init__(
            self,
            num_classes
    ):

        self.num_classes = num_classes

        self.reset()

    def reset(self):

        self.total = 0

        self.correct = 0

        self.confusion_matrix = torch.zeros(

            self.num_classes,

            self.num_classes,

            dtype=torch.int64

        )

    def get_confusion_matrix(self):

        return self.confusion_matrix.numpy()

    def update(

            self,

            predictions,

            targets

    ):

        predictions = torch.argmax(

            predictions,

            dim=1

        )

        self.correct += (

            predictions == targets

        ).sum().item()

        self.total += len(

            targets

        )

        for t, p in zip(

                targets,

                predictions

        ):

            self.confusion_matrix[

                int(t),

                int(p)

            ] += 1


    @property

    def accuracy(self):

        if self.total == 0:

            return 0

        return self.correct / self.total

    def precision(self):

        cm = self.confusion_matrix.float()

        tp = torch.diag(cm)

        fp = cm.sum(0) - tp

        precision = tp / (

            tp + fp + 1e-8

        )

        return precision.mean().item()

    def recall(self):

        cm = self.confusion_matrix.float()

        tp = torch.diag(cm)

        fn = cm.sum(1) - tp

        recall = tp / (

            tp + fn + 1e-8

        )

        return recall.mean().item()

    def f1(self):

        p = self.precision()

        r = self.recall()

        return (

            2 * p * r

        ) / (

            p + r + 1e-8

        )

    def summary(self):

        return {

            "accuracy": self.accuracy,

            "precision": self.precision(),

            "recall": self.recall(),

            "f1": self.f1()

        }