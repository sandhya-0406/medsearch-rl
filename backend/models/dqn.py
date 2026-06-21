# backend/models/dqn.py

import torch
import torch.nn as nn


class DQN(nn.Module):
    """
    Input:
        state vector (517)

    Output:
        Q-values for 7 actions
    """

    def __init__(self, state_dim=517, num_actions=7):
        super().__init__()

        self.network = nn.Sequential(
            nn.Linear(state_dim, 512),
            nn.ReLU(),

            nn.Linear(512, 256),
            nn.ReLU(),

            nn.Linear(256, 128),
            nn.ReLU(),

            nn.Linear(128, num_actions)
        )

    def forward(self, state):
        return self.network(state)