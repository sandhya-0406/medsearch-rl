Project Title

MedSearch-RL: A Multi-Domain Deep Reinforcement Learning Framework for Medical Object Detection, Localization, and Classification

Problem Statement

Traditional deep learning models in medical imaging typically provide only a final prediction, such as a classification label or segmentation output, without exposing the sequence of decisions that led to the result.

This lack of transparency limits interpretability and prevents users from understanding how the model arrived at its prediction.

Furthermore, most existing systems are designed for a single imaging modality and cannot easily adapt to different medical domains.

The objective of this project is to develop a Multi-Domain Medical Visual Search Framework using Deep Reinforcement Learning that can detect, localize, and classify clinically relevant targets across multiple medical imaging domains while visualizing the complete decision-making process of the agent.

Datasets Used
Dataset 1 – Brain MRI

Target:

Brain Tumor

Task:

Tumor Detection
Tumor Localization
Tumor Classification
Dataset 2 – ESAD

Target:

Surgical Action Regions

Examples:

CuttingTissue
PullingTissue
ClippingTissue
CuttingProstate
BaggingProstate

Task:

Action Detection
Action Localization
Action Classification
Dataset 3 – MESAD

Target:

Surgical Action Regions

Examples:

PullingProstate
UrethraDissection
PassingNeedle
GraspingCatheter

Task:

Action Detection
Action Localization
Action Classification
System Architecture
Input Image
      ↓
Domain Identification Module
      ↓
Feature Extraction Network
      ↓
Deep Reinforcement Learning Agent
      ↓
Medical Visual Search
      ↓
Object Detection
      ↓
Bounding Box Localization
      ↓
Classification Module
      ↓
Explainability Dashboard
Stage 1: Domain Identification

The system first determines whether the uploaded image belongs to:

Brain MRI
ESAD Endoscopy
MESAD Endoscopy

This enables routing to the appropriate prediction pipeline.

Stage 2: Medical Visual Search

The RL agent observes image patches and learns how to navigate toward clinically relevant regions through reward-driven exploration.

Actions:

Move Up
Move Down
Move Left
Move Right
Zoom In
Zoom Out
Stop

The objective is to reach the target region using the fewest possible steps.

Stage 3: Object Detection

The system identifies the presence of a medically relevant target.

Examples:

Brain
Tumor Present
Endoscopy
Surgical Action Present
Stage 4: Localization

The RL agent predicts the location of the detected target.

Output:

Bounding Box

Examples:

Tumor Region

or

CuttingTissue Region
Stage 5: Classification

After localization, the detected region is classified.

Brain MRI

Examples:

Glioma
Meningioma
Pituitary

(or Tumor/No Tumor depending on the final dataset)

ESAD

Examples:

CuttingTissue
PullingTissue
CuttingProstate
BaggingProstate
MESAD

Examples:

PassingNeedle
GraspingCatheter
PullingProstate
What Makes The Project Unique?

Most medical AI systems perform:

Image
↓
Prediction

Our system performs:

Image
↓
Visual Search
↓
Decision Sequence
↓
Detection
↓
Localization
↓
Classification
↓
Explanation

The entire reasoning process becomes visible.

Dashboard Features
1. Multi-Domain Upload Center

Upload:

MRI
ESAD Image
MESAD Image

Display:

Detected Domain
Image Metadata
Prediction Summary
2. Live RL Agent Explorer

Visualize:

Current Position
Current Action
Current Reward
Current Step

in real time.

3. Agent Replay Studio

Features:

Play
Pause
Rewind
Fast Forward

Replay every decision.

4. Object Detection Panel

Displays:

Detected Object
Confidence Score

Examples:

Tumor

or

CuttingTissue
5. Localization Viewer

Displays:

Ground Truth Box
Predicted Box
IoU Score
6. Classification Center

Displays:

Predicted Class
Confidence
Top Predictions
7. Trajectory Visualization

Shows:

Agent Path
Visited Locations
Search Efficiency
8. Heatmap Generator

Generate:

Attention Heatmap
Reward Heatmap
Visit Density Heatmap
9. Training Analytics

Metrics:

Episode Reward
Loss
Exploration Rate
Success Rate
10. Explainability Center

Shows:

Why Agent Moved
Why Region Was Selected
Reward Progression
Decision History
11. Multi-Domain Comparison Lab

Compare performance across:

Brain MRI
ESAD
MESAD

Metrics:

Detection Accuracy
Localization Accuracy
Classification Accuracy
Average Search Steps
12. Research Playground

Run:

Random MRI
Random ESAD Frame
Random MESAD Frame

and watch the agent search and classify in real time.