from collections import deque
import random
import numpy as np


class ReplayBuffer:

    def __init__(self, capacity=100000):

        self.buffer = deque(maxlen=capacity)

    def push(
            self,
            state,
            action,
            reward,
            next_state,
            done
    ):

        self.buffer.append(
            (
                state,
                action,
                reward,
                next_state,
                done
            )
        )

    def sample(self, batch_size):

        batch = random.sample(
            self.buffer,
            batch_size
        )

        states, actions, rewards, next_states, dones = zip(*batch)

        return (
            np.array(states, dtype=np.float32),
            np.array(actions),
            np.array(rewards, dtype=np.float32),
            np.array(next_states, dtype=np.float32),
            np.array(dones, dtype=np.float32)
        )

    def __len__(self):

        return len(self.buffer)