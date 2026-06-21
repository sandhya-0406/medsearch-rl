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

from backend.evaluation.evaluate import Evaluator


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

# Load trained weights (optional)
agent.load_checkpoint(
    "backend/checkpoints/best_model.pth"
)

# State encoder
encoder = StateEncoder()

# Processor
processor = StateProcessor(
    encoder
)

# Evaluator
evaluator = Evaluator(
    env,
    agent,
    processor
)

metrics = evaluator.evaluate(
    num_episodes=100
)

print()

print("Average Reward :", metrics["avg_reward"])

print("Average IoU :", metrics["avg_iou"])

print("Average Steps :", metrics["avg_steps"])

print("Success Rate :", metrics["success_rate"])