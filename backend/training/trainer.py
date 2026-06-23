# backend/training/trainer.py

import torch
import torch.nn.functional as F


class DQNTrainer:

    def __init__(
            self,
            agent,
            replay_buffer,
            batch_size=64,
            beta=0.4
    ):

        self.agent = agent
        self.replay_buffer = replay_buffer
        self.batch_size = batch_size
        self.beta = beta

    def train_step(self):

        if len(self.replay_buffer) < self.batch_size:
            return None

        (
            states,
            actions,
            rewards,
            next_states,
            dones,
            indices,
            weights

        ) = self.replay_buffer.sample(
            self.batch_size,
            self.beta
        )

        device = self.agent.device

        #
        # unpack states
        #

        state_patches = torch.stack(
            [s[0] for s in states],
            dim=0
        ).to(device)

        state_spatials = torch.stack(
            [s[1] for s in states],
            dim=0
        ).to(device)

        next_patches = torch.stack(
            [s[0] for s in next_states],
            dim=0
        ).to(device)

        next_spatials = torch.stack(
            [s[1] for s in next_states],
            dim=0
        ).to(device)

        actions = torch.LongTensor(
            actions
        ).to(device)

        rewards = torch.FloatTensor(
            rewards
        ).to(device)

        dones = torch.FloatTensor(
            dones
        ).to(device)

        weights = torch.FloatTensor(
            weights
        ).to(device)


        #
        # current Q
        #

        current_q_values = self.agent.q_network(

            state_patches,
            state_spatials

        )

        current_q_values = current_q_values.gather(
            1,
            actions.unsqueeze(1)
        ).squeeze(1)

        #
        # Double DQN target
        #

        with torch.no_grad():

            next_actions = self.agent.q_network(

                next_patches,
                next_spatials

            ).argmax(
                dim=1,
                keepdim=True
            )

            next_q_values = self.agent.target_network(

                next_patches,
                next_spatials

            ).gather(
                1,
                next_actions
            ).squeeze(1)

            target_q_values = rewards + (

                1 - dones

            ) * self.agent.gamma * next_q_values

        #
        # TD error
        #

        td_errors = (

            target_q_values -
            current_q_values

        )

        #
        # weighted PER loss
        #

        loss = (

            weights *

            F.smooth_l1_loss(

                current_q_values,
                target_q_values,
                reduction="none"

            )

        ).mean()

        self.agent.optimizer.zero_grad()

        loss.backward()

        torch.nn.utils.clip_grad_norm_(

            self.agent.q_network.parameters(),
            10

        )

        self.agent.optimizer.step()

        #
        # update priorities
        #

        self.replay_buffer.update_priorities(

            indices,

            td_errors.detach()
                     .cpu()
                     .numpy()

        )

        return loss.item()