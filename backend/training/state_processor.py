import cv2
import numpy as np
import torch


class StateProcessor:

    def __init__(
        self,
        state_encoder,
        device="cpu"
    ):

        self.state_encoder = state_encoder
        self.device = device


    def process(self, state):

        patch = state["patch"]

        patch = patch.astype(np.float32)

        if patch.max() > 1:
            patch /= 255.0

        patch = np.transpose(
            patch,
            (2, 0, 1)
        )

        patch = torch.FloatTensor(
            patch
        ).unsqueeze(0).to(
            self.device
        )

        spatial_info = torch.FloatTensor([

            [
                state["x_norm"],
                state["y_norm"],
                state["w_norm"],
                state["h_norm"],
                state["step_ratio"]

            ]

        ]).to(self.device)

        with torch.no_grad():

            encoded_state = self.state_encoder(

                patch,
                spatial_info

            )

        encoded_state = encoded_state.squeeze(
            0
        ).cpu().numpy()

        return encoded_state