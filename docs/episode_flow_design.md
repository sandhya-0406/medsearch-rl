# Episode Flow Design

## Objective

The reinforcement learning environment models medical visual search as a sequence of state transitions. During each episode, the agent navigates within the image, receives rewards, and attempts to localize a clinically relevant target.

The same episode structure is used across Brain MRI, ESAD, and MESAD domains.

---

# Episode Overview

An episode follows the sequence:

Start Episode

↓

Initialize Environment

↓

Observe State

↓

Choose Action

↓

Execute Action

↓

Update Window

↓

Compute Reward

↓

Check Termination

↓

Repeat

↓

End Episode

---

# Target Selection

Images may contain one or multiple objects.

Brain MRI:

• Single tumor region.

ESAD:

• Multiple surgical action regions.

MESAD:

• Multiple surgical action regions.

To simplify training, one ground-truth bounding box is selected per episode.

Example:

```python
target_box = random.choice(gt_boxes)
```

The selected target remains fixed throughout the episode.

---

# Environment Initialization

At the beginning of every episode:

```python
current_step = 0
done = False
```

Initial viewing window:

```python
x = 0
y = 0
width = 512
height = 512
```

The agent initially observes the entire image.

---

# Reset Function

Purpose:

Start a new episode.

Prototype:

```python
state = env.reset()
```

Operations:

1. Randomly select a sample.
2. Select one target bounding box.
3. Initialize window.
4. Set step counter to zero.
5. Generate initial state.
6. Return state.

---

# Step Function

Prototype:

```python
next_state, reward, done, info = env.step(action)
```

Operations:

1. Receive action.
2. Update window coordinates.
3. Apply boundary constraints.
4. Extract new image patch.
5. Calculate reward.
6. Increase step counter.
7. Determine termination.
8. Return next state.

---

# Transition Function

The environment follows:

```text
State
↓

Action

↓

Next State
```

Mathematically:

S(t+1) = T(S(t), A(t))

where:

T = transition function

S(t) = current state

A(t) = selected action

S(t+1) = next state

---

# Episode Length

Maximum number of steps:

```python
max_steps = 50
```

This prevents infinite exploration.

---

# Termination Conditions

An episode ends when any of the following occurs.

## 1. Stop Action

The agent chooses:

```python
action = 6
```

Episode terminates.

---

## 2. Maximum Step Limit

If:

```python
current_step >= max_steps
```

Episode terminates.

---

## 3. Successful Localization

If the predicted window overlaps sufficiently with the target:

```python
IoU >= 0.7
```

Episode terminates.

---

# Information Dictionary

The step function returns:

```python
info = {

    "iou": current_iou,

    "step": current_step,

    "window": [x, y, width, height]

}
```

This information will later support:

• Trajectory visualization

• Replay studio

• Explainability dashboard

• Reward analytics

---

# Episode Example

Step 0

Whole image

↓

Move Right

↓

Move Down

↓

Zoom In

↓

Move Left

↓

Zoom In

↓

IoU reaches threshold

↓

Stop

↓

Episode ends

---

# Mathematical Formulation

The environment is represented as:

(S, A, T, R)

where:

S = state space

A = action space

T = transition function

R = reward function

---

# Design Decisions

✔ Whole image as initial window

✔ One target per episode

✔ Maximum 50 steps

✔ IoU threshold-based success

✔ Stop action termination

✔ Support for trajectory tracking

---

# Advantages

• Simple training formulation.

• Compatible with DQN.

• Supports explainability.

• Uniform across MRI, ESAD, and MESAD.

• Enables replay and analytics.
