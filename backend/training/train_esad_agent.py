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

from backend.visualization.plot_metrics import plot_metrics


# Dataset
dataset = UnifiedDataset(
    mri_path=None,
    esad_path="data/esad",
    mesad_path=None
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

processor = StateProcessor()

# Train loop
loop = TrainLoop(
    env,
    agent,
    buffer,
    trainer,
    processor
)

results = loop.train(
    num_episodes=100
)

plot_metrics(
    results
)