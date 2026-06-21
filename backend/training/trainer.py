import torch
import torch.nn.functional as F


class DQNTrainer:

    def __init__(
            self,
            agent,
            replay_buffer,
            batch_size=64
    ):

        self.agent = agent
        self.replay_buffer = replay_buffer
        self.batch_size = batch_size

    def train_step(self):

        if len(self.replay_buffer) < self.batch_size:
            return None

        (
            states,
            actions,
            rewards,
            next_states,
            dones
        ) = self.replay_buffer.sample(
            self.batch_size
        )

        device = self.agent.device

        states = torch.FloatTensor(states).to(device)
        next_states = torch.FloatTensor(next_states).to(device)

        actions = torch.LongTensor(actions).to(device)
        rewards = torch.FloatTensor(rewards).to(device)
        dones = torch.FloatTensor(dones).to(device)

        current_q_values = self.agent.q_network(
            states
        )

        current_q_values = current_q_values.gather(
            1,
            actions.unsqueeze(1)
        ).squeeze(1)

        with torch.no_grad():

            next_q_values = self.agent.target_network(
                next_states
            )

            max_next_q_values = next_q_values.max(
                dim=1
            )[0]

            target_q_values = rewards + \
                              self.agent.gamma * \
                              max_next_q_values * \
                              (1 - dones)

        loss = F.mse_loss(
            current_q_values,
            target_q_values
        )

        self.agent.optimizer.zero_grad()

        loss.backward()

        self.agent.optimizer.step()

        return loss.item()