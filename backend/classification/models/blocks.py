import torch
import torch.nn as nn

# Conv → BN → ReLU

class ConvBlock(nn.Module):

    def __init__(

            self,

            in_channels,

            out_channels,

            kernel_size=3,

            stride=1,

            padding=1

    ):

        super().__init__()

        self.block = nn.Sequential(

            nn.Conv2d(

                in_channels,

                out_channels,

                kernel_size=kernel_size,

                stride=stride,

                padding=padding,

                bias=False

            ),

            nn.BatchNorm2d(

                out_channels

            ),

            nn.ReLU(

                inplace=True

            )

        )

    def forward(

            self,

            x

    ):

        return self.block(

            x

        )

# Residual Block

class ResidualBlock(nn.Module):

    def __init__(

            self,

            channels

    ):

        super().__init__()

        self.conv1 = ConvBlock(

            channels,

            channels

        )

        self.conv2 = nn.Sequential(

            nn.Conv2d(

                channels,

                channels,

                kernel_size=3,

                padding=1,

                bias=False

            ),

            nn.BatchNorm2d(

                channels

            )

        )

        self.relu = nn.ReLU(

            inplace=True

        )

    def forward(

            self,

            x

    ):

        identity = x

        out = self.conv1(

            x

        )

        out = self.conv2(

            out

        )

        out += identity

        out = self.relu(

            out

        )

        return out

# Downsampling Block

class DownsampleBlock(nn.Module):

    def __init__(

            self,

            in_channels,

            out_channels

    ):

        super().__init__()

        self.block = nn.Sequential(

            ConvBlock(

                in_channels,

                out_channels,

                stride=2

            ),

            ResidualBlock(

                out_channels

            )

        )

    def forward(

            self,

            x

    ):

        return self.block(

            x

        )

# Classification Head

class ClassificationHead(nn.Module):

    def __init__(

            self,

            in_features,

            num_classes,

            dropout=0.30

    ):

        super().__init__()

        self.head = nn.Sequential(

            nn.Linear(

                in_features,

                512

            ),

            nn.ReLU(

                inplace=True

            ),

            nn.Dropout(

                dropout

            ),

            nn.Linear(

                512,

                256

            ),

            nn.ReLU(

                inplace=True

            ),

            nn.Dropout(

                dropout

            ),

            nn.Linear(

                256,

                num_classes

            )

        )

    def forward(

            self,

            x

    ):

        return self.head(

            x

        )