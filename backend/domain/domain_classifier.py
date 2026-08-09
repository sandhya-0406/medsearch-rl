import torch
import torch.nn as nn


class DomainClassifier(nn.Module):
    """
    Lightweight 3-class domain classifier.

    Classes:
        0 -> MRI
        1 -> ESAD
        2 -> MESAD
    """

    def __init__(self, num_classes=3):

        super().__init__()

        self.features = nn.Sequential(

            # 224 x 224
            nn.Conv2d(
                3, 32,
                kernel_size=3,
                padding=1
            ),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),

            # 112 x 112
            nn.Conv2d(
                32, 64,
                kernel_size=3,
                padding=1
            ),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),

            # 56 x 56
            nn.Conv2d(
                64, 128,
                kernel_size=3,
                padding=1
            ),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),

            # 28 x 28
            nn.Conv2d(
                128, 256,
                kernel_size=3,
                padding=1
            ),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),

            # 14 x 14
            nn.Conv2d(
                256, 256,
                kernel_size=3,
                padding=1
            ),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),

            nn.AdaptiveAvgPool2d(1)

        )

        self.classifier = nn.Sequential(

            nn.Flatten(),

            nn.Linear(
                256,
                128
            ),

            nn.ReLU(inplace=True),

            nn.Dropout(0.2),

            nn.Linear(
                128,
                num_classes
            )

        )

    def forward(self, x):

        x = self.features(x)

        return self.classifier(x)