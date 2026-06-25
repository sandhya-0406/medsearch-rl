import torch
import torch.nn.functional as F


class Trainer:

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
            state_patches,
            state_spatials,
            actions,
            rewards,
            next_patches,
            next_spatials,
            dones
        ) = self.replay_buffer.sample(
            self.batch_size
        )

        device = self.agent.device

        state_patches = state_patches.to(device)
        state_spatials = state_spatials.to(device)

        next_patches = next_patches.to(device)
        next_spatials = next_spatials.to(device)

        actions = actions.to(device)
        rewards = rewards.to(device)
        dones = dones.to(device)

        current_q = self.agent.q_network(
            state_patches,
            state_spatials
        )

        current_q = current_q.gather(
            1,
            actions.unsqueeze(1)
        ).squeeze(1)

        with torch.no_grad():

            next_actions = self.agent.q_network(
                next_patches,
                next_spatials
            ).argmax(
                dim=1,
                keepdim=True
            )

            next_q = self.agent.target_network(
                next_patches,
                next_spatials
            ).gather(
                1,
                next_actions
            ).squeeze(1)

            target_q = rewards + (
                1 - dones
            ) * self.agent.gamma * next_q

        loss = F.smooth_l1_loss(
            current_q,
            target_q
        )

        self.agent.optimizer.zero_grad()

        loss.backward()

        torch.nn.utils.clip_grad_norm_(
            self.agent.q_network.parameters(),
            10
        )

        self.agent.optimizer.step()

        return loss.item()