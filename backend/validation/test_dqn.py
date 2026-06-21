import torch
from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]

sys.path.append(str(PROJECT_ROOT))
from backend.models.dqn import DQN


model = DQN()

dummy_state = torch.randn(
    1,
    517
)

output = model(
    dummy_state
)

print(output.shape)

print(output)