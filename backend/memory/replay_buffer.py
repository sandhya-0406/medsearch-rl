from collections import deque
import random
import torch


class ReplayBuffer:

    def __init__(
            self,
            capacity=100000
    ):

        self.buffer = deque(
            maxlen=capacity
        )

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

    def sample(
            self,
            batch_size
    ):

        batch = random.sample(
            self.buffer,
            batch_size
        )

        states, actions, rewards, next_states, dones = zip(*batch)

        state_patches = torch.stack(

            [

                s[0]

                for s in states

            ]

        )

        state_spatials = torch.stack(

            [

                s[1]

                for s in states

            ]

        )

        next_patches = torch.stack(

            [

                s[0]

                for s in next_states

            ]

        )

        next_spatials = torch.stack(

            [

                s[1]

                for s in next_states

            ]

        )

        return (

            state_patches,

            state_spatials,

            torch.LongTensor(actions),

            torch.FloatTensor(rewards),

            next_patches,

            next_spatials,

            torch.FloatTensor(dones)

        )

    def __len__(self):

        return len(
            self.buffer
        )