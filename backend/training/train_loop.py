import os
import numpy as np
from tqdm import tqdm

reward_history = []
loss_history = []
iou_history = []
epsilon_history = []

class TrainLoop:

    def __init__(
            self,
            env,
            agent,
            replay_buffer,
            trainer,
            state_processor,
            target_update_freq=40,
            checkpoint_dir="backend/checkpoints/mri"
    ):

        self.env = env
        self.agent = agent
        self.replay_buffer = replay_buffer
        self.trainer = trainer

        self.state_processor = state_processor

        self.target_update_freq = target_update_freq

        self.checkpoint_dir = checkpoint_dir

        os.makedirs(
            checkpoint_dir,
            exist_ok=True
        )

    def train(
            self,
            num_episodes=1000
    ):

        reward_history = []
        loss_history = []
        iou_history = []

        best_reward = -np.inf
        best_iou = 0

        for episode in tqdm(range(num_episodes)):

            raw_state = self.env.reset()

            state = self.state_processor.process(
                raw_state
            )

            done = False

            episode_reward = 0

            episode_loss = []

            while not done:

                action = self.agent.select_action(
                    state
                )

                raw_next_state, reward, done, info = self.env.step(
                    action
                )

                next_state = self.state_processor.process(
                    raw_next_state
                )

                self.replay_buffer.push(
                    state,
                    action,
                    reward,
                    next_state,
                    done
                )

                loss = self.trainer.train_step()

                if loss is not None:
                    episode_loss.append(loss)

                state = next_state

                episode_reward += reward

            self.agent.decay_epsilon()

            avg_loss = (

                np.mean(
                    episode_loss
                )

                if len(
                    episode_loss
                ) > 0

                else 0

            )

            reward_history.append(
                episode_reward
            )

            loss_history.append(
                avg_loss
            )

            iou_history.append(
                info["iou"]
            )

            epsilon_history.append(
                self.agent.epsilon
            )

            if episode % self.target_update_freq == 0:
                self.agent.update_target_network()


            if info["iou"] > best_iou:
                best_iou = info["iou"]
            # if episode_reward > best_reward:

            #     best_reward = episode_reward

                self.agent.save_checkpoint(

                    os.path.join(
                        self.checkpoint_dir,
                        "double_dqn_model2.pth"
                    )

                )

            print(

                f"Episode {episode+1} | "

                f"Reward = {episode_reward:.2f} | "

                f"Loss = {avg_loss:.4f} | "

                f"IoU = {info['iou']:.3f} | "

                f"Epsilon = {self.agent.epsilon:.3f}"

            )
            print(
                f"MaxIoU={info['max_iou']:.3f}"
            )

        return {

            "reward_history": reward_history,

            "loss_history": loss_history,

            "iou_history": iou_history,

            "epsilon_history": epsilon_history

        }