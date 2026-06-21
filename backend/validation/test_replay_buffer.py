import numpy as np
from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]

sys.path.append(str(PROJECT_ROOT))
from backend.memory.replay_buffer import ReplayBuffer


buffer = ReplayBuffer()

for i in range(100):

    state = np.random.randn(517)

    action = np.random.randint(0, 7)

    reward = np.random.randn()

    next_state = np.random.randn(517)

    done = np.random.choice(
        [0, 1]
    )

    buffer.push(
        state,
        action,
        reward,
        next_state,
        done
    )

print("Buffer size =", len(buffer))

batch = buffer.sample(64)

print("States shape:", batch[0].shape)
print("Actions shape:", batch[1].shape)
print("Rewards shape:", batch[2].shape)
print("Next states shape:", batch[3].shape)
print("Dones shape:", batch[4].shape)