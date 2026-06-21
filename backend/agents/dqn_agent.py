# backend/agents/dqn_agent.py

import random
import torch
import torch.nn.functional as F

from backend.models.dqn import DQN


class DQNAgent:

    def __init__(
            self,
            state_dim=517,
            num_actions=7,
            lr=1e-4,
            gamma=0.99,
            epsilon=1.0,
            epsilon_min=0.05,
            epsilon_decay=0.995,
            device=None
    ):

        self.state_dim = state_dim
        self.num_actions = num_actions

        self.gamma = gamma

        self.epsilon = epsilon
        self.epsilon_min = epsilon_min
        self.epsilon_decay = epsilon_decay

        self.device = device if device else (
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        # Online network
        self.q_network = DQN(
            state_dim,
            num_actions
        ).to(self.device)

        # Target network
        self.target_network = DQN(
            state_dim,
            num_actions
        ).to(self.device)

        self.update_target_network()

        self.optimizer = torch.optim.Adam(
            self.q_network.parameters(),
            lr=lr
        )

    def select_action(self, state):

        # Exploration
        if random.random() < self.epsilon:
            return random.randint(
                0,
                self.num_actions - 1
            )

        # Exploitation
        state = torch.FloatTensor(state)\
            .unsqueeze(0)\
            .to(self.device)

        with torch.no_grad():
            q_values = self.q_network(state)

        action = torch.argmax(
            q_values,
            dim=1
        ).item()

        return action

    def decay_epsilon(self):

        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay

            if self.epsilon < self.epsilon_min:
                self.epsilon = self.epsilon_min

    def update_target_network(self):

        self.target_network.load_state_dict(
            self.q_network.state_dict()
        )

    def save_checkpoint(self, path):

        checkpoint = {

            "q_network": self.q_network.state_dict(),

            "target_network":
                self.target_network.state_dict(),

            "optimizer":
                self.optimizer.state_dict(),

            "epsilon":
                self.epsilon
        }

        torch.save(
            checkpoint,
            path
        )

    def load_checkpoint(self, path):

        checkpoint = torch.load(
            path,
            map_location=self.device
        )

        self.q_network.load_state_dict(
            checkpoint["q_network"]
        )

        self.target_network.load_state_dict(
            checkpoint["target_network"]
        )

        self.optimizer.load_state_dict(
            checkpoint["optimizer"]
        )

        self.epsilon = checkpoint["epsilon"]

    def predict_q_values(self, state):

        state = torch.FloatTensor(state)\
            .unsqueeze(0)\
            .to(self.device)

        with torch.no_grad():

            q_values = self.q_network(
                state
            )

        return q_values.squeeze(0).cpu()