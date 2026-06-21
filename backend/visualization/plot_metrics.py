import matplotlib.pyplot as plt


def plot_metrics(results):

    plt.figure(figsize=(8,5))

    plt.plot(
        results["reward_history"]
    )

    plt.xlabel(
        "Episode"
    )

    plt.ylabel(
        "Reward"
    )

    plt.title(
        "Reward Curve"
    )

    plt.show()


    plt.figure(figsize=(8,5))

    plt.plot(
        results["loss_history"]
    )

    plt.xlabel(
        "Episode"
    )

    plt.ylabel(
        "Loss"
    )

    plt.title(
        "Loss Curve"
    )

    plt.show()


    plt.figure(figsize=(8,5))

    plt.plot(
        results["iou_history"]
    )

    plt.xlabel(
        "Episode"
    )

    plt.ylabel(
        "IoU"
    )

    plt.title(
        "IoU Curve"
    )

    plt.show()


    plt.figure(figsize=(8,5))

    plt.plot(
        results["epsilon_history"]
    )

    plt.xlabel(
        "Episode"
    )

    plt.ylabel(
        "Epsilon"
    )

    plt.title(
        "Exploration Decay"
    )

    plt.show()