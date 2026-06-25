import torch
import torch.nn as nn


class VisualDQN(nn.Module):

    def __init__(
            self,
            num_actions=6,
            spatial_dim=65
    ):

        super().__init__()

        ####################################################
        # CNN Feature Extractor
        ####################################################

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

        ####################################################
        # Visual Feature Embedding
        ####################################################

        self.feature_fc = nn.Sequential(

            nn.Linear(
                n_features,
                512
            ),

            nn.ReLU()

        )

        ####################################################
        # Shared Fully Connected Layers
        ####################################################

        self.shared = nn.Sequential(

            nn.Linear(
                512 + spatial_dim,
                512
            ),
            nn.ReLU(),

            nn.Linear(
                512,
                256
            ),
            nn.ReLU()

        )

        ####################################################
        # Value Stream
        ####################################################

        self.value_stream = nn.Sequential(

            nn.Linear(
                256,
                128
            ),
            nn.ReLU(),

            nn.Linear(
                128,
                1
            )

        )

        ####################################################
        # Advantage Stream
        ####################################################

        self.advantage_stream = nn.Sequential(

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

        ####################################################
        # CNN Features
        ####################################################

        visual_features = self.conv_layers(
            image_patch
        )

        visual_features = self.feature_fc(
            visual_features
        )

        ####################################################
        # Combine Visual + Spatial Features
        ####################################################

        state_vector = torch.cat(

            (
                visual_features,
                spatial_features
            ),

            dim=1

        )

        ####################################################
        # Shared Representation
        ####################################################

        shared_features = self.shared(
            state_vector
        )

        ####################################################
        # Dueling Streams
        ####################################################

        value = self.value_stream(
            shared_features
        )

        advantage = self.advantage_stream(
            shared_features
        )

        ####################################################
        # Combine Streams
        #
        # Q(s,a) = V(s) + A(s,a) - mean(A(s,*))
        ####################################################

        q_values = value + (
            advantage -
            advantage.mean(
                dim=1,
                keepdim=True
            )
        )

        return q_values