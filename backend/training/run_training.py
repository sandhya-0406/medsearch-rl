import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
project_root = Path.cwd()
sys.path.append(str(project_root))

from backend.datasets.unified_dataset import UnifiedDataset
from backend.rl.environment.medsearch_env import MedSearchEnv

from backend.agents.dqn_agent import DQNAgent
from backend.memory.replay_buffer import ReplayBuffer

from backend.training.trainer import DQNTrainer
from backend.training.train_loop import TrainLoop
from backend.training.state_processor import StateProcessor

from backend.models.cnn_feature_extractor import StateEncoder

from backend.visualization.plot_metrics import plot_metrics


# Dataset
dataset = UnifiedDataset(
    mri_path="data/mri",
    esad_path="data/esad",
    mesad_path="data/mesad"
)

# Environment
env = MedSearchEnv(dataset)

# Agent
agent = DQNAgent()

# Replay buffer
buffer = ReplayBuffer()

# Trainer
trainer = DQNTrainer(
    agent,
    buffer
)

# Encoder
encoder = StateEncoder()

# State processor
processor = StateProcessor(
    encoder
)

# Train loop
loop = TrainLoop(
    env,
    agent,
    buffer,
    trainer,
    processor
)

results = loop.train(
    num_episodes=2000
)

plot_metrics(
    results
)