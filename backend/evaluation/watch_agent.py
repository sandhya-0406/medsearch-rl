import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
project_root = Path.cwd()
sys.path.append(str(project_root))

from backend.datasets.unified_dataset import UnifiedDataset
from backend.rl.environment.medsearch_env import MedSearchEnv

from backend.agents.dqn_agent import DQNAgent

from backend.models.cnn_feature_extractor import StateEncoder
from backend.training.state_processor import StateProcessor

dataset = UnifiedDataset(
    mri_path="data/mri",
    esad_path="data/esad",
    mesad_path="data/mesad"
)

env = MedSearchEnv(dataset)
agent = DQNAgent()

agent.load_checkpoint(
    "backend/checkpoints/best_unified_model.pth"
)

encoder = StateEncoder()

processor = StateProcessor(
    encoder
)

agent.epsilon = 0

raw_state = env.reset()

state = processor.process(raw_state)

done = False

while not done:

    action = agent.select_action(
        state
    )

    raw_next_state, reward, done, info = env.step(
        action
    )

    state = processor.process(
        raw_next_state
    )


env.render()