import numpy as np
import torch


class StateProcessor:

    def __init__(
            self,
            device=None
    ):

        self.device = (
            device
            if device is not None
            else (
                "cuda"
                if torch.cuda.is_available()
                else "cpu"
            )
        )

    def process(
            self,
            state
    ):

        patch = state["patch"]

        # print("RAW PATCH:", patch.shape)

        patch = patch.astype(
            np.float32
        )

        if patch.max() > 1:

            patch /= 255.

        patch = np.transpose(
            patch,
            (2, 0, 1)
        )


        # print("TRANSPOSED:", patch.shape)

        patch = torch.FloatTensor(
            patch
        ).to(
            self.device
        )

        action_history = state[
            "action_history"
        ]

        action_one_hot = np.zeros(
            (10, 6)
        )

        for i, action in enumerate(
                action_history
        ):

            action_one_hot[
                i,
                action
            ] = 1

        action_features = action_one_hot.flatten()

        spatial_features = np.concatenate(

            [

                np.array(

                    [

                        state["x_norm"],
                        state["y_norm"],
                        state["w_norm"],
                        state["h_norm"],
                        state["step_ratio"]

                    ]

                ),

                action_features

            ]

        )

        spatial_features = torch.FloatTensor(
            spatial_features
        ).to(
            self.device
        )

        return patch, spatial_features