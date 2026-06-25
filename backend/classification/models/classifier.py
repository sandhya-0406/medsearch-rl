import torch
import torch.nn as nn

from backend.classification.models.blocks import (
    ConvBlock,
    ResidualBlock,
    DownsampleBlock,
    ClassificationHead
)

from backend.classification.models.attention import (
    CBAM
)


class MedicalClassifier(nn.Module):

    """
    MedSearch-RL Medical Classification Network

    Supports

    • Brain MRI

    • ESAD

    • MESAD

    Only num_classes changes.
    """

    def __init__(

            self,

            num_classes

    ):

        super().__init__()

        # Stem

        self.stem = nn.Sequential(

            ConvBlock(

                3,

                32

            ),

            ConvBlock(

                32,

                32

            )

        )

        # Stage 1

        self.stage1 = nn.Sequential(

            ResidualBlock(

                32

            ),

            CBAM(

                32

            )

        )

        # Stage 2

        self.stage2 = nn.Sequential(

            DownsampleBlock(

                32,

                64

            ),

            ResidualBlock(

                64

            ),

            CBAM(

                64

            )

        )

        # Stage 3

        self.stage3 = nn.Sequential(

            DownsampleBlock(

                64,

                128

            ),

            ResidualBlock(

                128

            ),

            CBAM(

                128

            )

        )

        # Stage 4

        self.stage4 = nn.Sequential(

            DownsampleBlock(

                128,

                256

            ),

            ResidualBlock(

                256

            ),

            CBAM(

                256

            )

        )

        # Global Pool

        self.pool = nn.AdaptiveAvgPool2d(

            1

        )

        # Feature Layer

        self.features = nn.Sequential(

            nn.Flatten(),

            nn.Linear(

                256,

                512

            ),

            nn.ReLU(

                inplace=True

            ),

            nn.Dropout(

                0.30

            )

        )

        # Classification Head

        self.classifier = ClassificationHead(

            in_features=512,

            num_classes=num_classes

        )

        # Weight Initialization

        self.initialize_weights()

    def initialize_weights(

            self

    ):

        for m in self.modules():

            if isinstance(

                    m,

                    nn.Conv2d

            ):

                nn.init.kaiming_normal_(

                    m.weight,

                    mode="fan_out",

                    nonlinearity="relu"

                )

            elif isinstance(

                    m,

                    nn.BatchNorm2d

            ):

                nn.init.constant_(

                    m.weight,

                    1

                )

                nn.init.constant_(

                    m.bias,

                    0

                )

            elif isinstance(

                    m,

                    nn.Linear

            ):

                nn.init.xavier_uniform_(

                    m.weight

                )

                nn.init.constant_(

                    m.bias,

                    0

                )

    def forward(

            self,

            x,

            return_features=False

    ):

        x = self.stem(

            x

        )

        x = self.stage1(

            x

        )

        x = self.stage2(

            x

        )

        x = self.stage3(

            x

        )

        x = self.stage4(

            x

        )

        x = self.pool(

            x

        )

        features = self.features(

            x

        )

        logits = self.classifier(

            features

        )

        if return_features:

            return logits, features

        return logits

    def extract_features(

            self,

            x

    ):

        _, features = self.forward(

            x,

            return_features=True

        )

        return features
