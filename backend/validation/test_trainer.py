import numpy as np
from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]

sys.path.append(str(PROJECT_ROOT))
from backend.agents.dqn_agent import DQNAgent
from backend.memory.replay_buffer import ReplayBuffer
from backend.training.trainer import DQNTrainer


agent = DQNAgent()

buffer = ReplayBuffer()

trainer = DQNTrainer(
    agent,
    buffer
)


for i in range(200):

    state = np.random.randn(517)

    action = np.random.randint(
        0,
        7
    )

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


loss = trainer.train_step()

print("Loss =", loss)