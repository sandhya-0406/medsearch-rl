import os

import torch


class CheckpointManager:

    """
    Handles model checkpoints.

    Saves

    • Model
    • Optimizer
    • Scheduler
    • Epoch
    • History

    """

    def __init__(

            self,

            checkpoint_dir="checkpoints"

    ):

        self.checkpoint_dir = checkpoint_dir

        os.makedirs(

            checkpoint_dir,

            exist_ok=True

        )

        ###########################################################

    def save(

            self,

            filename,

            model,

            optimizer,

            scheduler,

            epoch,

            history,

            best_metric

    ):

        path = os.path.join(

            self.checkpoint_dir,

            filename

        )

        checkpoint = {

            "epoch": epoch,

            "model_state_dict":
                model.state_dict(),

            "optimizer_state_dict":
                optimizer.state_dict(),

            "scheduler_state_dict":

                scheduler.state_dict()

                if scheduler is not None

                else None,

            "history":
                history.state_dict(),

            "best_metric":
                best_metric

        }

        torch.save(

            checkpoint,

            path

        )

        print(

            f"Checkpoint saved → {path}"

        )
    def load(

            self,

            filename,

            model,

            optimizer=None,

            scheduler=None

    ):

        path = os.path.join(

            self.checkpoint_dir,

            filename

        )

        checkpoint = torch.load(

            path,

            map_location="cpu"

        )

        model.load_state_dict(

            checkpoint["model_state_dict"]

        )

        if optimizer is not None:

            optimizer.load_state_dict(

                checkpoint["optimizer_state_dict"]

            )

        if (

            scheduler is not None

            and

            checkpoint["scheduler_state_dict"] is not None

        ):

            scheduler.load_state_dict(

                checkpoint["scheduler_state_dict"]

            )

        return checkpoint