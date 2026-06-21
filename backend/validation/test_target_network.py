from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]

sys.path.append(str(PROJECT_ROOT))
from backend.agents.dqn_agent import DQNAgent


agent = DQNAgent()

agent.update_target_network()

print(
    "Target network updated successfully."
)