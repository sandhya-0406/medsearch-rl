import numpy as np
from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]

sys.path.append(str(PROJECT_ROOT))
from backend.agents.dqn_agent import DQNAgent


agent = DQNAgent()

state = np.random.randn(
    517
)

action = agent.select_action(
    state
)

print("Action =", action)

q_values = agent.predict_q_values(
    state
)

print()

print("Q-values")

print(q_values)