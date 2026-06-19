# Action Space Design

## Objective

The reinforcement learning agent interacts with the image through a discrete set of actions. These actions allow navigation and scale adjustment during visual search.

---

# Action Set

Seven actions are used:

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

# Movement Actions

Move Up

```python
y -= step_size
```

Move Down

```python
y += step_size
```

Move Left

```python
x -= step_size
```

Move Right

```python
x += step_size
```

---

# Adaptive Movement

Movement is proportional to the current window size:

```python
step_size = 0.2 * window_width
```

Example:

Window size:

```text
128 × 128
```

Movement:

```text
25 pixels
```

Window size:

```text
256 × 256
```

Movement:

```text
51 pixels
```

---

# Zoom In

Reduce window dimensions:

```python
width *= 0.8
height *= 0.8
```

Purpose:

Focus on smaller regions.

---

# Zoom Out

Increase window dimensions:

```python
width *= 1.2
height *= 1.2
```

Purpose:

Recover from excessive zooming and explore larger areas.

---

# Stop Action

Action:

```python
6
```

The stop action terminates the episode and represents the agent's decision that the target has been localized.

---

# Boundary Constraints

Window coordinates are clipped to remain inside the image.

```python
x = max(0, x)
y = max(0, y)
```

Additionally,

```python
x + width ≤ 512
y + height ≤ 512
```

must always hold.

---

# Mathematical Formulation

A = {Up, Down, Left, Right, ZoomIn, ZoomOut, Stop}

or

A = {0,1,2,3,4,5,6}

---

# Design Decisions

✔ Seven discrete actions

✔ Relative movement

✔ Zoom factor of 0.8 and 1.2

✔ Boundary clipping

✔ Stop action

---

# Advantages

• Suitable for DQN.

• Supports interpretable trajectories.

• Mimics human visual search.

• Works uniformly across MRI, ESAD, and MESAD domains.

• Provides explainable decision sequences.
