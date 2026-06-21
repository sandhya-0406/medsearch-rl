import torch
import torch.nn as nn


class CNNFeatureExtractor(nn.Module):
    """
    Input:
        (batch_size, 3, 128, 128)

    Output:
        (batch_size, 512)
    """

    def __init__(self):
        super().__init__()

        self.conv_layers = nn.Sequential(

            # (3,128,128) -> (32,31,31)
            nn.Conv2d(
                in_channels=3,
                out_channels=32,
                kernel_size=8,
                stride=4
            ),
            nn.ReLU(),

            # (32,31,31) -> (64,14,14)
            nn.Conv2d(
                in_channels=32,
                out_channels=64,
                kernel_size=4,
                stride=2
            ),
            nn.ReLU(),

            # (64,14,14) -> (64,12,12)
            nn.Conv2d(
                in_channels=64,
                out_channels=64,
                kernel_size=3,
                stride=1
            ),
            nn.ReLU(),

            nn.Flatten()
        )

        # Determine flatten size automatically
        with torch.no_grad():
            dummy = torch.zeros(1, 3, 128, 128)
            n_features = self.conv_layers(dummy).shape[1]

        self.fc = nn.Sequential(
            nn.Linear(n_features, 512),
            nn.ReLU()
        )

    def forward(self, x):

        x = self.conv_layers(x)
        x = self.fc(x)

        return x


class StateEncoder(nn.Module):
    """
    Combines:

    CNN features      -> 512
    x_norm            -> 1
    y_norm            -> 1
    w_norm            -> 1
    h_norm            -> 1
    step_ratio        -> 1

    Total = 517
    """

    def __init__(self):
        super().__init__()

        self.feature_extractor = CNNFeatureExtractor()

    def forward(
        self,
        image_patch,
        spatial_info
    ):
        """
        Parameters
        ----------
        image_patch :
            shape = (batch_size,3,128,128)

        spatial_info :
            shape = (batch_size,5)

            [
                x_norm,
                y_norm,
                w_norm,
                h_norm,
                step_ratio
            ]
        """

        visual_features = self.feature_extractor(image_patch)

        state_vector = torch.cat(
            [visual_features, spatial_info],
            dim=1
        )

        return state_vector
    
# if __name__ == "__main__":

#     encoder = StateEncoder()

#     image_patch = torch.randn(1, 3, 128, 128)

#     spatial_info = torch.tensor(
#         [[0.25, 0.50, 0.40, 0.40, 0.10]],
#         dtype=torch.float32
#     )

#     state = encoder(
#         image_patch,
#         spatial_info
#     )

#     print("State shape:", state.shape)