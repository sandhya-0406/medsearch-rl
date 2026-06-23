import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
project_root = Path.cwd()
sys.path.append(str(project_root))

from backend.datasets.unified_dataset import UnifiedDataset
from backend.rl.environment.medsearch_env import MedSearchEnv
from backend.agents.dqn_agent import DQNAgent
from backend.training.state_processor import StateProcessor
from backend.evaluation.evaluate import Evaluator


# ---------------------------------------------------
# MRI ONLY DATASET
# ---------------------------------------------------
# dataset = UnifiedDataset(
#     mri_path=PROJECT_ROOT / "data" / "figshare",
#     esad_path=None,
#     mesad_path=None
# )

# ---------------------------------------------------
# ESAD ONLY DATASET
# ---------------------------------------------------
# dataset = UnifiedDataset(
#     mri_path=None,
#     esad_path=PROJECT_ROOT/"data"/"esad",
#     mesad_path=None
# )

# ---------------------------------------------------
# MESAD ONLY DATASET
# ---------------------------------------------------
dataset = UnifiedDataset(
    mri_path=None,
    esad_path=None,
    mesad_path=PROJECT_ROOT/"data"/"mesad"
)

print("Dataset length:", len(dataset))
# print("MRI count:", dataset.mri_count)


# ---------------------------------------------------
# ENVIRONMENT
# ---------------------------------------------------
env = MedSearchEnv(
    dataset,
    max_steps=150
)


# ---------------------------------------------------
# AGENT
# ---------------------------------------------------
agent = DQNAgent(
    state_dim=577
)

agent.load_checkpoint(
    "backend/checkpoints/best_model.pth"
)

# pure exploitation
agent.epsilon = 0


# ---------------------------------------------------
# STATE PROCESSOR
# ---------------------------------------------------
processor = StateProcessor()


# ---------------------------------------------------
# EVALUATOR
# ---------------------------------------------------
evaluator = Evaluator(
    env,
    agent,
    processor
)


# ---------------------------------------------------
# RUN EVALUATION
# ---------------------------------------------------
metrics = evaluator.evaluate(
    num_episodes=100
)


# ---------------------------------------------------
# RESULTS
# ---------------------------------------------------
print("\nMESAD ONLY RESULTS")
print("-----------------------")

print(
    "Average Reward :",
    metrics["avg_reward"]
)

print(
    "Average IoU :",
    metrics["avg_iou"]
)

print(
    "Average Steps :",
    metrics["avg_steps"]
)

print(
    "Success Rate :",
    metrics["success_rate"]
)