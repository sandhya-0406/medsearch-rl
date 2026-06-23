import torch
import torch.nn as nn


class VisualDQN(nn.Module):

    def __init__(
            self,
            num_actions=6,
            spatial_dim=65
    ):

        super().__init__()

        #
        # CNN
        #

        self.conv_layers = nn.Sequential(

            nn.Conv2d(
                3,
                32,
                kernel_size=8,
                stride=4
            ),
            nn.ReLU(),

            nn.Conv2d(
                32,
                64,
                kernel_size=4,
                stride=2
            ),
            nn.ReLU(),

            nn.Conv2d(
                64,
                64,
                kernel_size=3,
                stride=1
            ),
            nn.ReLU(),

            nn.Flatten()

        )

        with torch.no_grad():

            dummy = torch.zeros(
                1,
                3,
                128,
                128
            )

            n_features = self.conv_layers(
                dummy
            ).shape[1]

            # print("VisualDQN loaded")
            # print("n_features =", n_features)
            # print(__file__)

        self.feature_fc = nn.Sequential(

            nn.Linear(
                n_features,
                512
            ),

            nn.ReLU()

        )

        #
        # Q-network
        #

        self.q_network = nn.Sequential(

            nn.Linear(
                512 + spatial_dim,
                512
            ),
            nn.ReLU(),

            nn.Linear(
                512,
                256
            ),
            nn.ReLU(),

            nn.Linear(
                256,
                128
            ),
            nn.ReLU(),

            nn.Linear(
                128,
                num_actions
            )

        )

    def forward(
            self,
            image_patch,
            spatial_features
    ):

        visual_features = self.conv_layers(
            image_patch
        )

        visual_features = self.feature_fc(
            visual_features
        )

        state_vector = torch.cat(

            [
                visual_features,
                spatial_features
            ],

            dim=1

        )

        q_values = self.q_network(
            state_vector
        )

        return q_values