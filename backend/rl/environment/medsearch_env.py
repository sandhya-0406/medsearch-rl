# backend/rl/environment/medsearch_env.py
import random
import cv2
import matplotlib.pyplot as plt
import matplotlib.patches as patches

class MedSearchEnv:

    def __init__(self, dataset, max_steps=50):

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

        idx = random.randint(
            0,
            len(self.dataset)-1
        )

        self.current_sample = self.dataset[idx]

        while len(self.current_sample["boxes"]) == 0:

            idx = random.randint(
                0,
                len(self.dataset)-1
            )

            self.current_sample = self.dataset[idx]

        self.target_box = random.choice(
            self.current_sample["boxes"]
        )

        self.current_step = 0

        self.done = False

        self.width = 256
        self.height = 256

        self.x = (512 - self.width)//2
        self.y = (512 - self.height)//2


        self.previous_iou = 0.0

        return self.get_state()

    def step(self, action):

        # Do nothing if episode already ended
        if self.done:
            return (
                self.get_state(),
                0,
                self.done,
                {}
            )

        # Adaptive movement size
        step_size = int(0.2 * self.width)

        # -------------------------
        # Movement actions
        # -------------------------

        # Move Up
        if action == 0:
            self.y -= step_size

        # Move Down
        elif action == 1:
            self.y += step_size

        # Move Left
        elif action == 2:
            self.x -= step_size

        # Move Right
        elif action == 3:
            self.x += step_size

        # -------------------------
        # Zoom actions
        # -------------------------

        # Zoom In
        elif action == 4:

            self.width = int(self.width * 0.8)
            self.height = int(self.height * 0.8)

            # Prevent window from becoming too small
            self.width = max(32, self.width)
            self.height = max(32, self.height)

        # Zoom Out
        elif action == 5:

            self.width = int(self.width * 1.2)
            self.height = int(self.height * 1.2)

            # Prevent window from exceeding image size
            self.width = min(512, self.width)
            self.height = min(512, self.height)

        # Stop action
        elif action == 6:
            self.done = True

        # -------------------------
        # Boundary clipping
        # -------------------------

        self.x = max(0, self.x)
        self.y = max(0, self.y)

        self.x = min(
            self.x,
            512 - self.width
        )

        self.y = min(
            self.y,
            512 - self.height
        )

        # -------------------------
        # Update step count
        # -------------------------

        self.current_step += 1

        # Maximum episode length
        if self.current_step >= self.max_steps:
            self.done = True

        # -------------------------
        # Reward
        # -------------------------

        reward = self.calculate_reward()

        # -------------------------
        # Next state
        # -------------------------

        next_state = self.get_state()

        # -------------------------
        # Info dictionary
        # -------------------------

        info = {

            "step": self.current_step,

            "window": [
                self.x,
                self.y,
                self.width,
                self.height
            ]
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

        reward = (
            current_iou -
            self.previous_iou
        )

        self.previous_iou = current_iou

        if current_iou >= 0.7:

            reward += 10

            self.done = True

        if self.done and current_iou < 0.7:

            reward -= 5

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
