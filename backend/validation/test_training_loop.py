from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]

sys.path.append(str(PROJECT_ROOT))

from backend.datasets.unified_dataset import UnifiedDataset

from backend.rl.environment.medsearch_env import MedSearchEnv

from backend.agents.dqn_agent import DQNAgent

from backend.memory.replay_buffer import ReplayBuffer

from backend.training.trainer import DQNTrainer

from backend.training.train_loop import TrainLoop

from backend.models.cnn_feature_extractor import StateEncoder

from backend.training.state_processor import StateProcessor

dataset = UnifiedDataset(
    mri_path="data/mri",
    esad_path="data/esad",
    mesad_path="data/mesad"
)


env = MedSearchEnv(
    dataset
)

agent = DQNAgent()

buffer = ReplayBuffer()

trainer = DQNTrainer(
    agent,
    buffer
)

encoder = StateEncoder()

processor = StateProcessor(
    encoder
)

loop = TrainLoop(

    env,

    agent,

    buffer,

    trainer,

    processor

)

results = loop.train(

    num_episodes=10

)

print()

print(
    "Training finished."
)

print(

    "Episodes:",

    len(
        results["reward_history"]
    )

)