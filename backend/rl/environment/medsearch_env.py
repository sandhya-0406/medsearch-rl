# backend/rl/environment/medsearch_env.py
import random
import cv2
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from backend.rl.environment.navigation_engine import NavigationEngine

class MedSearchEnv(NavigationEngine):

    def __init__(self, dataset, max_steps=100):

        self.dataset = dataset
        self.max_steps = max_steps

        self.current_sample = None
        self.target_box = None

        self.current_step = 0
        self.done = False

        # window coordinates
        self.x = 0
        self.y = 0
        self.width = 512
        self.height = 512


    def reset(self):

        # History variables
        self.trajectory = []
        self.action_history = []
        self.reward_history = []
        self.iou_history = []
        self.window_history = []

        idx = random.randint(
            0,
            len(self.dataset) - 1
        )

        self.current_sample = self.dataset[idx]

        while len(self.current_sample["boxes"]) == 0:

            idx = random.randint(
                0,
                len(self.dataset) - 1
            )

            self.current_sample = self.dataset[idx]

        self.target_box = random.choice(
            self.current_sample["boxes"]
        )

        self.current_step = 0

        self.done = False
        self.stopped = False

        # Initial window
        self.width = 192
        self.height = 192

        self.x = random.randint(0,512-self.width)
        self.y = random.randint(0,512-self.height)
        
        self.previous_iou = 0.0
        self.max_iou_episode = 0

        # Save first position
        self.window_history.append(
            [
                self.x,
                self.y,
                self.width,
                self.height
            ]
        )

        self.trajectory.append(
            self.get_center()
        )

        self.previous_distance = self.compute_distance()

        self.visited_positions = set()

        return self.get_state()

    def step(self, action):

        # Episode already finished
        if self.done:

            return (
                self.get_state(),
                0,
                self.done,
                {}
            )

        # Adaptive movement
        step_size = int(
            0.15 * self.width
        )

        # -------------------
        # Movement actions
        # -------------------

        if action == 0:

            self.y -= step_size

        elif action == 1:

            self.y += step_size

        elif action == 2:

            self.x -= step_size

        elif action == 3:

            self.x += step_size

        # -------------------
        # Zoom actions
        # -------------------

        elif action == 4:

            self.zoom_in()

        elif action == 5:

            self.zoom_out()

        # -------------------
        # Stop action
        # -------------------

        elif action == 6:

            self.done = True
            self.stopped = True

        # -------------------
        # Boundary clipping
        # -------------------

        before_clip = (
            self.x,
            self.y
        )

        self.clip_window()

        after_clip = (
            self.x,
            self.y
        )

        if before_clip != after_clip:

            self.boundary_penalty = -0.02

        else:

            self.boundary_penalty = 0
        # -------------------
        # Update step count
        # -------------------

        self.current_step += 1

        # Maximum episode length
        if self.current_step >= self.max_steps:

            self.done = True

        # -------------------
        # Reward
        # -------------------

        reward = self.calculate_reward()

        current_iou = self.compute_iou()

        self.max_iou_episode = max(
            self.max_iou_episode,
            current_iou
        )

        # -------------------
        # History recording
        # -------------------

        self.action_history.append(
            action
        )

        self.reward_history.append(
            reward
        )

        self.iou_history.append(
            current_iou
        )

        self.window_history.append(

            [
                self.x,
                self.y,
                self.width,
                self.height
            ]

        )

        self.trajectory.append(

            self.get_center()

        )

        # -------------------
        # Next state
        # -------------------

        next_state = self.get_state()

        # -------------------
        # Info dictionary
        # -------------------

        info = {

            "step": self.current_step,

            "iou": current_iou,

            "max_iou": self.max_iou_episode,

            "reward": reward,

            "window": [

                self.x,
                self.y,
                self.width,
                self.height

            ],

            "center": self.get_center()

        }

        return (

            next_state,
            reward,
            self.done,
            info

        )

    def render(self):
        image = self.current_sample["image"]

        fig, ax = plt.subplots(
            figsize=(8,8)
        )

        ax.imshow(image)

        tx1, ty1, tx2, ty2 = self.target_box
        gt_rect = patches.Rectangle(

            (tx1, ty1),

            tx2 - tx1,

            ty2 - ty1,

            linewidth=2,

            edgecolor='green',

            facecolor='none',

            label='Target'

        )

        ax.add_patch(gt_rect)

        agent_rect = patches.Rectangle(

            (self.x, self.y),

            self.width,

            self.height,

            linewidth=2,

            edgecolor='red',

            facecolor='none',

            label='Agent'

        )

        ax.add_patch(agent_rect)

        center = self.get_center()

        ax.scatter(
            center[0],
            center[1],
            s=50,
            c='blue'
        )

        if len(self.trajectory) > 1:

            xs = [p[0] for p in self.trajectory]
            ys = [p[1] for p in self.trajectory]

            ax.plot(
                xs,
                ys,
                linewidth=2,
                color='yellow'
            )

        iou = self.compute_iou()

        plt.title(
            f"Step: {self.current_step} | "
            f"IoU : {iou:.3f}"
        )

        plt.show()

    def get_state(self):

        image = self.current_sample["image"]

        patch = image[
            self.y:self.y+self.height,
            self.x:self.x+self.width
        ]

        patch = cv2.resize(
            patch,
            (128, 128)
        )

        x_norm = self.x / 512
        y_norm = self.y / 512

        w_norm = self.width / 512
        h_norm = self.height / 512

        step_ratio = (
            self.current_step /
            self.max_steps
        )

        state = {
            "patch": patch,
            "x_norm": x_norm,
            "y_norm": y_norm,
            "w_norm": w_norm,
            "h_norm": h_norm,
            "step_ratio": step_ratio
        }

        return state

    def calculate_reward(self):

        current_iou = self.compute_iou()

        # ---------------------------------
        # IoU improvement reward
        # ---------------------------------
        iou_reward = 20 * (
            current_iou -
            self.previous_iou
        )

        # ---------------------------------
        # Distance reward
        # ---------------------------------
        current_distance = self.compute_distance()

        distance_reward = 2 * (
            self.previous_distance -
            current_distance
        ) / 512

        # ---------------------------------
        # Exploration reward
        # ---------------------------------
        position = tuple(

            np.round(
                self.get_center(),
                0
            ).astype(int)

        )

        if position not in self.visited_positions:

            exploration_reward = 0.01

            self.visited_positions.add(position)

        else:

            exploration_reward = 0

        # ---------------------------------
        # Step penalty
        # ---------------------------------
        step_penalty = -0.005

        # ---------------------------------
        # Boundary penalty
        # ---------------------------------
        boundary_penalty = self.boundary_penalty

        # ---------------------------------
        # Success bonus
        # ---------------------------------
        success_bonus = 0

        if current_iou >= 0.3:

            success_bonus = 10

            self.done = True

        # ---------------------------------
        # Early stop penalty
        # ---------------------------------
        early_stop_penalty = 0

        if self.stopped and current_iou < 0.3:

            early_stop_penalty = -3

        # ---------------------------------
        # Failure penalty
        # ---------------------------------
        failure_penalty = 0

        if (

            self.current_step >= self.max_steps

            and

            current_iou < 0.3

        ):

            failure_penalty = -1

        # ---------------------------------
        # Total reward
        # ---------------------------------
        reward = (

            iou_reward

            + distance_reward

            + exploration_reward

            + step_penalty

            + boundary_penalty

            + success_bonus

            + early_stop_penalty

            + failure_penalty

        )

        self.previous_iou = current_iou

        self.previous_distance = current_distance

        return reward
    
    def compute_iou(self):

        x1 = self.x
        y1 = self.y

        x2 = self.x + self.width
        y2 = self.y + self.height

        tx1, ty1, tx2, ty2 = self.target_box

        inter_x1 = max(x1, tx1)
        inter_y1 = max(y1, ty1)

        inter_x2 = min(x2, tx2)
        inter_y2 = min(y2, ty2)

        inter_width = max(
            0,
            inter_x2 - inter_x1
        )

        inter_height = max(
            0,
            inter_y2 - inter_y1
        )

        intersection = (
            inter_width *
            inter_height
        )

        window_area = (
            self.width *
            self.height
        )

        target_area = (
            (tx2 - tx1) *
            (ty2 - ty1)
        )

        union = (
            window_area +
            target_area -
            intersection
        )

        iou = intersection / (
            union + 1e-8
        )

        return iou
    
    def get_target_center(self):

        tx1, ty1, tx2, ty2 = self.target_box

        center_x = (tx1 + tx2) / 2
        center_y = (ty1 + ty2) / 2

        return center_x, center_y
    
    def compute_distance(self):

        agent_x, agent_y = self.get_center()

        target_x, target_y = self.get_target_center()

        distance = np.sqrt(

            (agent_x - target_x)**2 +

            (agent_y - target_y)**2

        )

        return distance
    

