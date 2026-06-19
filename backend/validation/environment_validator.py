import random
import numpy as np
from collections import defaultdict
from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]

sys.path.append(str(PROJECT_ROOT))

print("Project root:", PROJECT_ROOT)
print(PROJECT_ROOT)
print(PROJECT_ROOT / "data" / "esad")

from backend.datasets.unified_dataset import UnifiedDataset
from backend.rl.environment.medsearch_env import MedSearchEnv

class EnvironmentValidator:

    def __init__(self, env, num_episodes=500):

        self.env = env
        self.num_episodes = num_episodes

        self.domain_stats = defaultdict(list)

        self.success_count = defaultdict(int)

        self.boundary_errors = 0
        self.state_errors = 0
        self.replay_errors = 0

    def validate(self):

        for episode in range(self.num_episodes):

            state = self.env.reset()

            domain = self.env.current_sample["domain"]

            done = False
            episode_reward = 0

            while not done:

                action = random.randint(0, 6)

                next_state, reward, done, info = self.env.step(action)

                episode_reward += reward

                # --------------------
                # State validation
                # --------------------

                if state["patch"].shape != (128,128,3):
                    self.state_errors += 1

                # --------------------
                # Boundary validation
                # --------------------

                x = self.env.x
                y = self.env.y
                w = self.env.width
                h = self.env.height

                if x < 0:
                    self.boundary_errors += 1

                if y < 0:
                    self.boundary_errors += 1

                if x + w > 512:
                    self.boundary_errors += 1

                if y + h > 512:
                    self.boundary_errors += 1

                state = next_state


            final_iou = info["iou"]

            self.domain_stats[domain].append(
                {
                    "reward": episode_reward,
                    "steps": info["step"],
                    "iou": final_iou
                }
            )

            if final_iou >= 0.7:
                self.success_count[domain] += 1

            # --------------------------------
            # Replay validation
            # --------------------------------

            if not (

                    len(self.env.action_history)
                    ==
                    len(self.env.reward_history)
                    ==
                    len(self.env.iou_history)

            ):
                self.replay_errors += 1


            if (

                len(self.env.window_history)

                !=

                len(self.env.action_history) + 1

            ):
                self.replay_errors += 1


            if (

                len(self.env.trajectory)

                !=

                len(self.env.action_history) + 1

            ):
                self.replay_errors += 1
                    
    def print_report(self):

        print("\n==============================")
        print("MEDSEARCH-RL VALIDATION REPORT")
        print("==============================")

        for domain, stats in self.domain_stats.items():

            rewards = [x["reward"] for x in stats]
            steps = [x["steps"] for x in stats]
            ious = [x["iou"] for x in stats]

            print(f"\n{domain}")

            print(
                "Episodes:",
                len(stats)
            )

            print(
                "Average Reward:",
                round(np.mean(rewards),2)
            )

            print(
                "Average Steps:",
                round(np.mean(steps),2)
            )

            print(
                "Average IoU:",
                round(np.mean(ious),3)
            )

            print(
                "Success Rate:",
                round(
                    self.success_count[domain]/len(stats),
                    3
                )
            )

        print("\nBoundary Errors:", self.boundary_errors)
        print("State Errors:", self.state_errors)
        print("Replay Errors:", self.replay_errors)

        if (
            self.boundary_errors == 0
            and self.state_errors == 0
            and self.replay_errors == 0
        ):
            print("\nENVIRONMENT STATUS : PASSED")
        else:
            print("\nENVIRONMENT STATUS : FAILED")

if __name__ == "__main__":

    dataset = UnifiedDataset(
        mri_path=PROJECT_ROOT / "data" / "figshare",
        esad_path=PROJECT_ROOT / "data" / "esad",
        mesad_path=PROJECT_ROOT / "data" / "mesad"
    )

    env = MedSearchEnv(dataset)

    validator = EnvironmentValidator(
        env,
        num_episodes= 500
    )

    validator.validate()

    validator.print_report()