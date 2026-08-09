from pathlib import Path

import torch

from backend.agents.dqn_agent import DQNAgent
from backend.classification.models.classifier import MedicalClassifier

from backend.core.config import MODEL_PATHS
from backend.core.config import NUM_CLASSES
from backend.core.config import DEVICE


class ModelManager:

    def __init__(self):

        self.agents = {}

        self.classifiers = {}

    ##################################################

    def load_agents(self):

        print("\nLoading RL Agents...\n")

        for domain in MODEL_PATHS:

            path = MODEL_PATHS[domain]["agent"]

            if not Path(path).exists():

                print(f"{domain} Agent Missing")

                continue

            agent = DQNAgent()

            agent.load_checkpoint(path)

            agent.set_inference_mode()

            self.agents[domain] = agent

            print(f"{domain} Agent Loaded")

    ##################################################

    def load_classifiers(self):

        print("\nLoading Classifiers...\n")

        for domain in MODEL_PATHS:

            path = MODEL_PATHS[domain]["classifier"]

            if not Path(path).exists():

                print(f"{domain} Classifier Missing")

                continue

            model = MedicalClassifier(

                num_classes=NUM_CLASSES[domain]

            ).to(DEVICE)

            checkpoint = torch.load(

                path,

                map_location=DEVICE

            )

            model.load_state_dict(

                checkpoint["model_state_dict"]

            )

            model.eval()

            self.classifiers[domain] = model

            print(f"{domain} Classifier Loaded")

    ##################################################

    def load_all_models(self):

        self.load_agents()

        self.load_classifiers()

    ##################################################

    def get_agent(self, domain):

        return self.agents[domain]

    ##################################################

    def get_classifier(self, domain):

        return self.classifiers[domain]

    ##################################################

    def status(self):

        return {

            "agents": list(self.agents.keys()),

            "classifiers": list(self.classifiers.keys()),

            "device": str(DEVICE)

        }


model_manager = ModelManager()