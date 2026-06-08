# MESAD Dataset Analysis Report

## Project

**MedSearch-RL: A Multi-Domain Deep Reinforcement Learning Framework for Medical Object Detection, Localization, and Classification**

## Dataset

**MESAD (Medical Endoscopic Surgical Action Dataset)**

---

# 1. Objective

The objective of this analysis was to investigate the structure, annotation format, class distribution, and localization characteristics of the MESAD dataset before integrating it into the MedSearch-RL framework.

The dataset will be utilized for:

* Surgical Action Detection
* Surgical Action Localization
* Surgical Action Classification
* Reinforcement Learning-Based Medical Visual Search

---

# 2. Dataset Structure

The MESAD dataset is organized into separate training and validation sets.

Dataset hierarchy:

train/
├── images/
└── annotations/

val/
├── images/
└── annotations/

Each image has corresponding annotation files:

real1_frame_1490.jpg

real1_frame_1490.bboxes.tsv

real1_frame_1490.bboxes.labels.tsv

---

# 3. Annotation Format

Unlike ESAD, which uses YOLO annotations, MESAD stores annotations in TSV format.

## Bounding Box File

Example:

170    377    329    504

Fields represent:

xmin    ymin    xmax    ymax

## Label File

Example:

PullingSeminalVesicle

Each bounding box has a corresponding surgical action label stored in a separate label file.

This annotation format provides explicit pixel coordinates and does not require coordinate conversion.

---

# 4. Dataset Statistics

| Metric                 |  Value |
| ---------------------- | -----: |
| Total Images           | 25,390 |
| Total Annotation Files | 25,390 |
| Number of Classes      |     21 |

The dataset contains a complete set of image–annotation pairs, indicating consistent annotation coverage across the dataset.

---

# 5. Annotation Validation

Several randomly selected samples were visualized to verify:

* Image loading
* Bounding box parsing
* Label parsing
* Image–annotation correspondence
* Visualization accuracy

Results confirmed that:

* Bounding boxes are correctly positioned.
* Labels correspond to the expected surgical action.
* Annotation files are valid and consistent.
* Multiple action categories are represented.

Example observation:

A sample frame containing the action "PullingSeminalVesicle" was correctly localized using the provided bounding box coordinates.

---

# 6. Class Distribution Analysis

The dataset contains 21 surgical action classes.

## Most Frequent Classes

| Class                 | Count |
| --------------------- | ----: |
| PullingTissue         | 7,761 |
| CuttingTissue         | 6,204 |
| SuckingBlood          | 4,894 |
| BladderAnastomosis    | 4,509 |
| PullingSeminalVesicle | 3,194 |
| CuttingSeminalVesicle | 2,811 |
| BladderNeckDissection | 2,070 |

## Least Frequent Classes

| Class                  | Count |
| ---------------------- | ----: |
| BaggingProstate        |    49 |
| ClippingVasDeferens    |    73 |
| CuttingVasDeferens     |   106 |
| CuttingThread          |   147 |
| ClippingSeminalVesicle |   162 |

### Imbalance Observation

The dataset exhibits significant class imbalance.

The most frequent class (PullingTissue) contains approximately 158 times more samples than the least frequent class (BaggingProstate).

Such imbalance may influence detection and classification performance and should be considered during future training through:

* Weighted loss functions
* Balanced sampling strategies
* Data augmentation
* Class-aware reward design

---

# 7. Bounding Box Analysis

Bounding box statistics were computed using pixel coordinates.

| Metric       |         Value |
| ------------ | ------------: |
| Minimum Area |     3,080 px² |
| Maximum Area |   380,712 px² |
| Mean Area    | 86,634.32 px² |

### Interpretation

Smallest Objects:

3,080 pixels²

Largest Objects:

380,712 pixels²

Average Objects:

86,634 pixels²

The dataset contains substantial scale variation, ranging from small localized surgical regions to large structures occupying significant portions of the image.

---

# 8. Relevance to Reinforcement Learning

The MESAD dataset is highly suitable for reinforcement learning-based visual search because:

* Surgical targets are spatially localized.
* Explicit bounding box annotations are provided.
* Multiple action categories are represented.
* Significant scale variation exists.
* Real surgical environments are captured.

The RL agent can learn to:

1. Navigate within endoscopic scenes.
2. Search for clinically relevant action regions.
3. Localize surgical targets.
4. Minimize search steps.
5. Improve localization efficiency.

---

# 9. Challenges Identified

## Class Imbalance

Rare classes contain very limited examples compared to dominant classes.

## Scale Variation

Target sizes vary substantially across images.

## Surgical Scene Complexity

Visual clutter, occlusions, blood, smoke, and instrument overlap increase localization difficulty.

## Fine-Grained Action Differences

Several classes involve visually similar actions that may be difficult to distinguish.

---

# 10. Strengths of the Dataset

* Large-scale dataset.
* Complete image–annotation coverage.
* High-quality localization annotations.
* Pixel-accurate bounding box coordinates.
* Multi-class surgical action labels.
* Suitable for detection tasks.
* Suitable for localization tasks.
* Suitable for reinforcement learning visual search.
* Supports explainable AI workflows.

---

# 11. Comparison with ESAD

| Property               | ESAD       | MESAD             |
| ---------------------- | ---------- | ----------------- |
| Images                 | 40,152     | 25,390            |
| Classes                | 21         | 21                |
| Annotation Format      | YOLO       | TSV               |
| Coordinate Type        | Normalized | Pixel Coordinates |
| Empty Frames           | Present    | Minimal           |
| Surgical Action Labels | Yes        | Yes               |

Although the annotation formats differ, both datasets share the same action vocabulary, making them highly compatible for unified multi-domain learning.

---

# 12. Conclusion

The MESAD dataset successfully passed all validation checks and is suitable for integration into the MedSearch-RL framework.

Key findings include:

* 25,390 annotated images.
* 21 surgical action classes.
* Complete image–annotation coverage.
* Explicit pixel-coordinate localization annotations.
* Significant class imbalance.
* Wide variation in target sizes.

Overall, MESAD provides a strong foundation for developing reinforcement learning-based medical visual search systems capable of surgical action detection, localization, and classification.

