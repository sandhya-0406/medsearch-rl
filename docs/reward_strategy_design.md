# Reward Strategy Design

## Objective

The reward function guides the reinforcement learning agent toward clinically relevant regions while encouraging efficient search and accurate localization.

The reward strategy is shared across Brain MRI, ESAD, and MESAD domains.

---

# Reward Principles

The agent should learn to:

• Improve localization accuracy.

• Reach targets quickly.

• Avoid unnecessary movements.

• Stop only when confident.

• Maximize overlap with the target region.

---

# Localization Reward

Localization quality is measured using Intersection over Union (IoU).

Higher IoU values indicate better overlap between the current window and the target bounding box.

Example:

Perfect overlap:

```text
IoU = 1.0
```

No overlap:

```text
IoU = 0.0
```

The reward increases as IoU improves.

---

# Positive Reward

The agent receives positive reward when:

• IoU increases.

• The search window moves closer to the target.

• Successful localization is achieved.

---

# Negative Reward

The agent receives penalties when:

• IoU decreases.

• Unnecessary movements occur.

• Maximum steps are exhausted.

• The stop action is used too early.

• Boundary collisions occur.

---

# Success Reward

When:

```python
IoU >= threshold
```

the episode is considered successful.

A large positive reward is assigned.

Purpose:

Encourage accurate localization.

---

# Early Stop Penalty

If:

```python
action == STOP
```

while localization quality is poor,

the agent receives a penalty.

Purpose:

Prevent premature termination.

---

# Step Penalty

Each action incurs a small negative reward.

Purpose:

Encourage shorter trajectories.

Desired behavior:

```text
Target found in 10 steps

>

Target found in 40 steps
```

---

# Exploration Reward

Reward can be assigned for discovering new regions.

Purpose:

Prevent repetitive movements and oscillation.

Encourages:

• Better coverage.

• More efficient search.

• Diverse trajectories.

---

# Boundary Penalty

When the agent attempts to move outside the image:

```python
x < 0
```

or

```python
x + width > image_width
```

a penalty is assigned.

Purpose:

Discourage invalid actions.

---

# Failure Penalty

If:

```python
current_step >= max_steps
```

and the target is not found,

the episode terminates with a negative reward.

Purpose:

Prevent endless wandering.

---

# Reward Components

The total reward may consist of:

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

# Reward Categories

Positive Rewards

• Better localization.

• Successful target discovery.

• Efficient exploration.

Negative Rewards

• Wasted steps.

• Invalid movements.

• Poor stopping decisions.

• Episode failure.

---

# Desired Agent Behavior

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

High IoU

↓

Stop

↓

Success

---

# Design Decisions

✔ Reward based on localization quality.

✔ Encourage shorter search trajectories.

✔ Penalize invalid actions.

✔ Penalize premature stopping.

✔ Reward successful localization.

✔ Support explainable decision sequences.

---

# Advantages

• Domain independent.

• Compatible with DQN.

• Encourages efficient search.

• Supports trajectory visualization.

• Works uniformly across MRI, ESAD, and MESAD.

• Suitable for explainable AI.
