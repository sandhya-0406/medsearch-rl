import json
from dataclasses import asdict


def save_config(config, save_path):

    with open(save_path, "w") as f:

        json.dump(

            asdict(config),

            f,

            indent=4

        )