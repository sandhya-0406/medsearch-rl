import time

import numpy as np

from backend.agents.dqn_agent import DQNAgent
from backend.rl.environment.mri_env import MRIEnv
from backend.rl.environment.medsearch_env import MedSearchEnv
from backend.training.state_processor import StateProcessor
from backend.core.model_manager import model_manager

class LocalizationService:
    """
    Runs the trained MedSearch-RL agent in inference mode.

    Responsibilities:
        - Create the appropriate environment
        - Load the uploaded image as a sample
        - Convert environment states using StateProcessor
        - Select actions using the trained DQN agent
        - Execute inference navigation
        - Return the final localization and replay information
    """

    DEFAULT_MAX_STEPS = 150

    def __init__(
        self,
        model_manager,
        max_steps=None
    ):

        self.model_manager = model_manager

        self.max_steps = (
            max_steps
            if max_steps is not None
            else self.DEFAULT_MAX_STEPS
        )

        self.processor = StateProcessor()

    # ---------------------------------------------------------
    # ENVIRONMENT
    # ---------------------------------------------------------

    def _create_environment(self, domain):

        domain = domain.upper()

        if domain == "MRI":

            return MRIEnv(
                dataset=None,
                max_steps=self.max_steps
            )

        if domain in ("ESAD", "MESAD"):

            return MedSearchEnv(
                dataset=None,
                max_steps=self.max_steps
            )

        raise ValueError(
            f"Unsupported domain: {domain}"
        )

    # ---------------------------------------------------------
    # AGENT
    # ---------------------------------------------------------

    def _get_agent(self, domain):

        agent = self.model_manager.get_agent(
            domain
        )

        if agent is None:

            raise RuntimeError(
                f"No RL agent loaded for {domain}."
            )

        # IMPORTANT:
        # select_action() uses epsilon-greedy behavior.
        # For deployment we want deterministic inference.

        agent.epsilon = 0.0

        agent.q_network.eval()
        agent.target_network.eval()

        return agent

    # ---------------------------------------------------------
    # SAMPLE
    # ---------------------------------------------------------

    def _create_sample(self, image, domain):

        if image is None:

            raise ValueError(
                "Image is empty."
            )

        image = np.asarray(
            image
        )

        if image.ndim == 2:

            image = np.stack(
                [
                    image,
                    image,
                    image
                ],
                axis=-1
            )

        elif (
            image.ndim == 3
            and image.shape[2] == 4
        ):

            image = image[:, :, :3]

        return {

            "image": image,

            # Deployment has no ground-truth annotations.
            "boxes": [],

            "labels": [],

            "domain": domain.lower()

        }

    # ---------------------------------------------------------
    # SEARCH
    # ---------------------------------------------------------

    def localize(
        self,
        image,
        domain
    ):
        """
        Run RL visual search.

        Returns:

        {
            "bbox": {...},
            "trajectory": [...],
            "actions": [...],
            "windows": [...],
            "steps": ...
        }
        """

        domain = domain.upper()

        start_time = time.perf_counter()

        agent = self._get_agent(
            domain
        )

        env = self._create_environment(
            domain
        )

        sample = self._create_sample(
            image,
            domain
        )

        # -----------------------------------------------------
        # Initialize environment with uploaded image
        # -----------------------------------------------------

        env.load_sample(
            sample
        )

        done = False

        # -----------------------------------------------------
        # RL SEARCH
        # -----------------------------------------------------

        while not done:

            raw_state = env.get_state()

            state = self.processor.process(
                raw_state
            )

            action = agent.select_action(
                state
            )

            result = env.inference_step(
                action
            )

            # Your current inference_step returns:
            #
            # state, done, info
            #
            _, done, _ = result

        # -----------------------------------------------------
        # FINAL WINDOW
        # -----------------------------------------------------

        x = int(env.x)
        y = int(env.y)

        width = int(env.width)
        height = int(env.height)

        bbox = {

            "x": x,

            "y": y,

            "width": width,

            "height": height,

            "x2": x + width,

            "y2": y + height

        }

        # -----------------------------------------------------
        # REPLAY DATA
        # -----------------------------------------------------

        trajectory = [
            [
                int(point[0]),
                int(point[1])
            ]

            for point
            in env.trajectory
        ]

        actions = [
            int(action)
            for action
            in env.action_history
        ]

        windows = [

            {

                "x": int(window[0]),

                "y": int(window[1]),

                "width": int(window[2]),

                "height": int(window[3])

            }

            for window
            in env.window_history
        ]

        elapsed = (
            time.perf_counter()
            - start_time
        )

        return {

            "bbox": bbox,

            "trajectory": trajectory,

            "actions": actions,

            "windows": windows,

            "steps": int(
                env.current_step
            ),

            "processing_time": round(
                elapsed,
                4
            )

        }


localization_service = LocalizationService(
    model_manager= model_manager
)