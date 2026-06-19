import sys
from pathlib import Path
import random

PROJECT_ROOT = Path(__file__).resolve().parent.parent
project_root = Path.cwd()
sys.path.append(str(project_root))

from backend.rl.environment.medsearch_env import MedSearchEnv
from backend.datasets.unified_dataset import UnifiedDataset

dataset = UnifiedDataset(
    mri_path=PROJECT_ROOT / "data" / "figshare",
    esad_path=PROJECT_ROOT / "data" / "esad",
    mesad_path=PROJECT_ROOT / "data" / "mesad"
)

# env = MedSearchEnv(dataset)

# state = env.reset()

# actions = [3, 3, 1, 4, 2, 4]

# for action in actions:

#     next_state, reward, done, info = env.step(action)

#     print()
#     print("Action:", action)
#     print("Step:", info["step"])
#     print("Window:", info["window"])
#     print("Center:", info["center"])
#     print("Reward:", reward)
#     print("IoU:", info["iou"])

#     env.render()

#     if done:
#         break

# episode_data = env.get_episode_data()

# print("Trajectory length:", len(episode_data["trajectory"]))
# print("Actions:", episode_data["actions"])
# print("Rewards:", episode_data["rewards"])
# print("IoUs:", episode_data["ious"])
# print("Windows:", len(episode_data["windows"]))


# env.reset()

# print("Before:")
# print(env.x, env.y, env.width, env.height)
# print("Center:", env.get_center())

# env.step(4)

# print()

# print("After Zoom In:")
# print(env.x, env.y, env.width, env.height)
# print("Center:", env.get_center())

# env.reset()

# actions = [3,3,1,1,4,2,4]

# for action in actions:

#     _,_,done,_ = env.step(action)

#     if done:
#         break

# env.render()

# episode_data = env.get_episode_data()

# print()

# for i in range(len(episode_data["actions"])):

#     print(
#         i,
#         episode_data["actions"][i],
#         episode_data["rewards"][i],
#         episode_data["ious"][i]
#     )

# for i in range(20):

#     state = env.reset()

#     print(
#         env.current_sample["domain"],
#         env.target_box
#     )

env = MedSearchEnv(dataset)

state = env.reset()

actions = [

    3,
    3,
    1,
    4,
    2,
    4,
    6

]

for action in actions:

    next_state, reward, done, info = env.step(action)

    print()

    print("Action:", action)

    print("Reward:", reward)

    print("IoU:", info["iou"])

    print("Step:", info["step"])

    env.render()

    if done:

        break

env.reset()

actions = [

    3,
    2,
    3,
    2,
    3,
    2

]

for action in actions:

    _, reward, _, info = env.step(action)

    print(

        action,

        reward,

        info["iou"]

    )


env.reset()

while not env.done:

    _, reward, done, info = env.step(

        random.randint(
            0,
            5
        )

    )

    print(

        info["step"],

        reward,

        info["iou"]

    )

print()

print("Finished")