import sys
from pathlib import Path
import os

PROJECT_ROOT = Path(__file__).resolve().parent.parent
project_root = Path.cwd()
sys.path.append(str(project_root))

from backend.datasets.unified_dataset import UnifiedDataset
# from backend.rl.environment.mri_env import MRIEnv
from backend.rl.environment.medsearch_env import MedSearchEnv

from backend.memory.replay_buffer import ReplayBuffer

from backend.training.double_dqn_trainer import Trainer

from backend.agents.dqn_agent import DQNAgent

from backend.training.train_loop import TrainLoop
from backend.training.state_processor import StateProcessor

from backend.visualization.plot_metrics import plot_metrics


# Dataset
dataset = UnifiedDataset(
    mri_path=None,
    esad_path="/content/drive/MyDrive/MedSearch/extracted/esad",
    mesad_path=None
)


# Agent
agent = DQNAgent()

checkpoint = ""
# checkpoint = "/content/drive/MyDrive/MedSearch/checkpoints/rl/esad"
# Change this to the latest checkpoint you have:
# checkpoint_ep_400.pth
# checkpoint_ep_500.pth
# ...
# or best_model.pth

start_episode = 0

if os.path.exists(checkpoint):

    print("Loading checkpoint...")

    start_episode = agent.load_checkpoint(checkpoint)

    print(f"Resumed from episode {start_episode}")

# env = MRIEnv(dataset)
env = MedSearchEnv(dataset)

buffer = ReplayBuffer()

trainer = Trainer(
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
    processor,
    checkpoint_dir="/content/drive/MyDrive/MedSearch/checkpoints/rl/esad"
)

results = loop.train(
    num_episodes=2000,
    start_episode=start_episode
)

plot_metrics(
    results
)