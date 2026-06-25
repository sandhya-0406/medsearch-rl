import torch
import torch.nn as nn

# Channel Attention

class ChannelAttention(nn.Module):

    def __init__(
            self,
            channels,
            reduction=16
    ):

        super().__init__()

        reduced = max(1, channels // reduction)

        self.avg_pool = nn.AdaptiveAvgPool2d(1)

        self.max_pool = nn.AdaptiveMaxPool2d(1)

        self.shared_mlp = nn.Sequential(

            nn.Conv2d(
                channels,
                reduced,
                kernel_size=1,
                bias=False
            ),

            nn.ReLU(inplace=True),

            nn.Conv2d(
                reduced,
                channels,
                kernel_size=1,
                bias=False
            )

        )

        self.sigmoid = nn.Sigmoid()

    def forward(
            self,
            x
    ):

        avg = self.shared_mlp(

            self.avg_pool(x)

        )

        mx = self.shared_mlp(

            self.max_pool(x)

        )

        attention = self.sigmoid(

            avg + mx

        )

        return x * attention

# Spatial Attention
class SpatialAttention(nn.Module):

    def __init__(
            self,
            kernel_size=7
    ):

        super().__init__()

        padding = kernel_size // 2

        self.conv = nn.Conv2d(

            2,

            1,

            kernel_size=kernel_size,

            padding=padding,

            bias=False

        )

        self.sigmoid = nn.Sigmoid()

    def forward(
            self,
            x
    ):

        avg = torch.mean(

            x,

            dim=1,

            keepdim=True

        )

        mx, _ = torch.max(

            x,

            dim=1,

            keepdim=True

        )

        features = torch.cat(

            [

                avg,

                mx

            ],

            dim=1

        )

        attention = self.sigmoid(

            self.conv(

                features

            )

        )

        return x * attention

# CBAM

class CBAM(nn.Module):

    def __init__(
            self,
            channels,
            reduction=16
    ):

        super().__init__()

        self.channel_attention = ChannelAttention(

            channels,

            reduction

        )

        self.spatial_attention = SpatialAttention()

    def forward(
            self,
            x
    ):

        x = self.channel_attention(

            x

        )

        x = self.spatial_attention(

            x

        )

        return x