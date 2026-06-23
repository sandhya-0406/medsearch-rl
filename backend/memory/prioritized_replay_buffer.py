import numpy as np


class PrioritizedReplayBuffer:

    def __init__(
            self,
            capacity=50000,
            alpha=0.6
    ):

        self.capacity = capacity
        self.alpha = alpha

        self.buffer = []
        self.priorities = []

        self.position = 0


    def push(
            self,
            state,
            action,
            reward,
            next_state,
            done
    ):

        max_priority = (
            max(self.priorities)
            if self.buffer
            else 1.0
        )

        transition = (
            state,
            action,
            reward,
            next_state,
            done
        )

        if len(self.buffer) < self.capacity:

            self.buffer.append(
                transition
            )

            self.priorities.append(
                max_priority
            )

        else:

            self.buffer[
                self.position
            ] = transition

            self.priorities[
                self.position
            ] = max_priority

            self.position = (

                self.position + 1

            ) % self.capacity


    def sample(
            self,
            batch_size,
            beta=0.4
    ):

        priorities = np.array(
            self.priorities,
            dtype=np.float32
        )

        probs = priorities ** self.alpha

        probs /= probs.sum()

        indices = np.random.choice(

            len(self.buffer),

            batch_size,

            p=probs

        )

        samples = [

            self.buffer[idx]

            for idx in indices

        ]

        weights = (

            len(self.buffer)

            * probs[indices]

        ) ** (-beta)

        weights /= weights.max()

        states, actions, rewards, next_states, dones = zip(
            *samples
        )

        return (

            states,
            actions,
            rewards,
            next_states,
            dones,
            indices,
            weights

        )


    def update_priorities(
            self,
            indices,
            td_errors
    ):

        for idx, error in zip(
                indices,
                td_errors
        ):

            self.priorities[idx] = (

                abs(error) + 1e-5

            )


    def __len__(self):

        return len(
            self.buffer
        )