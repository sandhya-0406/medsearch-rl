import numpy as np


class Evaluator:

    def __init__(self, env, agent, processor):

        self.env = env
        self.agent = agent
        self.processor = processor

    def evaluate(self, num_episodes=100):

        rewards = []
        ious = []
        steps = []
        successes = 0

        old_epsilon = self.agent.epsilon

        # pure exploitation
        self.agent.epsilon = 0

        for _ in range(num_episodes):

            raw_state = self.env.reset()

            state = self.processor.process(
                raw_state
            )

            done = False

            episode_reward = 0

            while not done:

                action = self.agent.select_action(
                    state
                )

                raw_next_state, reward, done, info = self.env.step(
                    action
                )

                state = self.processor.process(
                    raw_next_state
                )

                episode_reward += reward

            rewards.append(
                episode_reward
            )

            ious.append(
                info["iou"]
            )

            steps.append(
                info["step"]
            )

            if info["iou"] >= 0.3:
                successes += 1

        self.agent.epsilon = old_epsilon

        results = {

            "avg_reward":
                np.mean(rewards),

            "avg_iou":
                np.mean(ious),

            "avg_steps":
                np.mean(steps),

            "success_rate":
                successes / num_episodes

        }

        return results