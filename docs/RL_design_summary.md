# RL Design Summary

## Project

MedSearch-RL: A Multi-Domain Deep Reinforcement Learning Framework for Medical Object Detection, Localization, and Classification

---

# Objective

The reinforcement learning framework models medical visual search as a sequential decision-making problem.

The agent learns how to navigate within Brain MRI, ESAD, and MESAD images to efficiently localize clinically relevant targets.

The same RL formulation is shared across all domains.

---

# Markov Decision Process

The environment is formulated as:

MDP = (S, A, T, R)

where:

S = State Space

A = Action Space

T = Transition Function

R = Reward Function

---

# State Space

The state consists of:

1. Image Patch

Current image observation.

Shape:

```text
128 × 128 × 3
```

2. Spatial Information

Normalized coordinates:

```text
x_norm
y_norm
w_norm
h_norm
```

3. Temporal Information

Normalized episode progress:

```text
step_ratio
```

---

## Mathematical Representation

S = (Ip, x, y, w, h, t)

where:

Ip = image patch

x, y = normalized position

w, h = normalized window dimensions

t = normalized episode step

---

# Action Space

The agent interacts with the image through seven discrete actions.

| Action ID | Action     |
| --------- | ---------- |
| 0         | Move Up    |
| 1         | Move Down  |
| 2         | Move Left  |
| 3         | Move Right |
| 4         | Zoom In    |
| 5         | Zoom Out   |
| 6         | Stop       |

---

## Mathematical Representation

A =

{

Up,

Down,

Left,

Right,

ZoomIn,

ZoomOut,

Stop

}

---

# Transition Function

At each time step:

Current State

↓

Action

↓

Environment Update

↓

Next State

Mathematically:

S(t+1) = T(S(t), A(t))

The transition function updates:

• Window position

• Window size

• Image patch

• Step counter

---

# Reward Function

The reward guides the agent toward efficient localization.

Positive Rewards

• Improved localization.

• Successful target discovery.

• Efficient exploration.

Negative Rewards

• Wasted movements.

• Invalid actions.

• Premature stopping.

• Episode failure.

---

## Reward Representation

R =

Localization Reward

*

Success Reward

*

Exploration Reward

−

Step Penalty

−

Boundary Penalty

−

Early Stop Penalty

−

Failure Penalty

---

# Episode Initialization

Initial window:

```python
x = 0
y = 0
width = 512
height = 512
```

The agent initially observes the entire image.

---

# Target Selection

Brain MRI:

Single tumor region.

ESAD:

Multiple surgical action regions.

MESAD:

Multiple surgical action regions.

For training:

```python
target_box = random.choice(gt_boxes)
```

One target is selected per episode.

---

# Episode Length

Maximum steps:

```python
max_steps = 50
```

---

# Termination Conditions

The episode terminates when:

### Stop Action

```python
action == 6
```

---

### Maximum Steps Reached

```python
current_step >= max_steps
```

---

### Successful Localization

```python
IoU >= 0.7
```

---

# Environment API

The RL environment follows the OpenAI Gym style.

Reset:

```python
state = env.reset()
```

Step:

```python
next_state, reward, done, info = env.step(action)
```

Render:

```python
env.render()
```

---

# Expected Agent Behavior

Whole Image

↓

Move

↓

Move

↓

Zoom

↓

Refine

↓

Target Region

↓

Stop

↓

Successful Localization

---

# Explainability Support

The framework supports:

• Trajectory visualization

• Agent replay

• Reward history

• Decision sequence analysis

• Heatmaps

• Training analytics

---

# Multi-Domain Support

Brain MRI

↓

ESAD

↓

MESAD

↓

Shared RL Formulation

↓

Unified Visual Search Framework

---

# Advantages

• Domain-independent design.

• Compatible with Deep Q-Networks.

• Supports explainable AI.

• Produces interpretable search trajectories.

• Enables object detection, localization, and classification.

• Preserves the complete MedSearch-RL vision.

---

# Conclusion

The RL problem for MedSearch-RL has been formally defined through a unified Markov Decision Process consisting of state space, action space, transition function, and reward strategy. This design provides the foundation for implementing the RL environment and subsequent DQN-based visual search agent.
