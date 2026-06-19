# State Space Design

## Objective

The reinforcement learning agent performs visual search by observing only a portion of the image and learning how to navigate toward clinically relevant targets. The same state formulation is shared across Brain MRI, ESAD, and MESAD domains.

---

# State Components

The state consists of three parts:

1. Image Patch
2. Spatial Information
3. Temporal Information

---

# 1. Image Patch

The agent observes the current image window rather than the entire image.

Example:

Current window:

x = 120

y = 180

width = 128

height = 128

Patch extraction:

```python
patch = image[180:308,120:248]
```

The extracted patch is resized to:

```text
128 × 128 × 3
```

---

# 2. Spatial Information

Current window coordinates are normalized:

```python
x_norm = x / 512
y_norm = y / 512
w_norm = width / 512
h_norm = height / 512
```

Example:

```python
x = 128
y = 64
width = 128
height = 128
```

becomes:

```python
[0.25, 0.125, 0.25, 0.25]
```

---

# 3. Temporal Information

Episode progress is represented by:

```python
step_ratio = current_step / max_steps
```

Example:

```python
15 / 50 = 0.30
```

---

# Final State Representation

```python
State = {
    image_patch,
    x_norm,
    y_norm,
    w_norm,
    h_norm,
    step_ratio
}
```

---

# Mathematical Formulation

S = (Ip, x, y, w, h, t)

where:

Ip = image patch

x, y = normalized window position

w, h = normalized window size

t = normalized episode step

---

# Design Decisions

✔ Current image patch observation

✔ Normalized coordinates

✔ Normalized step count

✘ Entire image observation

---

# Advantages

• Supports Brain MRI, ESAD, and MESAD.

• Enables visual search behavior.

• Provides spatial awareness.

• Supports explainable trajectories.

• Suitable for CNN feature extraction and DQN training.
