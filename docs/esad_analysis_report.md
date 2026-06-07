# ESAD Dataset Analysis Report

## Dataset

**ESAD (Endoscopic Surgical Action Detection Dataset)**

---

# 1. Objective

The objective of this analysis was to understand the structure, annotations, class distribution, and localization characteristics of the ESAD dataset before integrating it into the MedSearch-RL framework.

The dataset will be used for:

* Surgical Action Detection
* Surgical Action Localization
* Surgical Action Classification
* Reinforcement Learning-Based Visual Search

---

# 2. Dataset Structure

The dataset consists of:

* Endoscopic surgical image frames (.jpg)
* YOLO annotation files (.txt)
* Class label mapping file (obj.names)

Each image has a corresponding annotation file.

Example:

RARP2_frame_1.jpg

RARP2_frame_1.txt

Annotations follow the YOLO format:

class_id center_x center_y width height

where all coordinates are normalized to the image dimensions.

---

# 3. Dataset Statistics

| Metric                     | Value  |
| -------------------------- | ------ |
| Total Images               | 40,152 |
| Annotated Images           | 18,793 |
| Images Without Annotations | 21,359 |
| Number of Classes          | 21     |

### Annotation Coverage

Annotated Images Percentage:

46.8%

Non-Annotated Images Percentage:

53.2%

The dataset contains a significant number of negative frames that do not contain labeled surgical actions.

These negative samples can be useful during training to improve model robustness and reduce false positives.

---

# 4. Annotation Validation

Several random samples were visualized to verify:

* Correct image loading
* Proper YOLO annotation parsing
* Accurate bounding box conversion
* Correct class label mapping

Results confirmed that:

* Bounding boxes were correctly positioned.
* Multiple objects can exist within the same frame.
* Annotation files are valid and usable.

Example observations:

* Multiple PullingTissue regions can appear in a single frame.
* Different surgical actions may coexist within one image.
* Object sizes vary significantly across samples.

---

# 5. Class Distribution Analysis

The dataset exhibits strong class imbalance.

## Most Frequent Classes

| Class                 | Count |
| --------------------- | ----: |
| PullingTissue         | 4,877 |
| SuckingBlood          | 3,753 |
| CuttingTissue         | 3,715 |
| BladderAnastomosis    | 3,585 |
| PullingSeminalVesicle | 2,712 |
| CuttingSeminalVesicle | 2,509 |
| CuttingProstate       | 1,845 |

## Least Frequent Classes

| Class                  | Count |
| ---------------------- | ----: |
| BaggingProstate        |    34 |
| CuttingVasDeferens     |    71 |
| CuttingThread          |   108 |
| ClippingSeminalVesicle |   118 |

### Imbalance Observation

The most frequent class (PullingTissue) contains approximately 143 times more samples than the rarest class (BaggingProstate).

This imbalance should be considered during future model training through techniques such as:

* Weighted losses
* Balanced sampling
* Data augmentation
* Class-aware reward design

---

# 6. Bounding Box Analysis

Bounding box area statistics were computed using normalized YOLO coordinates.

| Metric       | Value  |
| ------------ | ------ |
| Minimum Area | 0.0052 |
| Maximum Area | 0.6454 |
| Mean Area    | 0.1706 |

### Interpretation

Smallest Objects:

Approximately 0.52% of the image area.

Largest Objects:

Approximately 64.54% of the image area.

Average Objects:

Approximately 17.06% of the image area.

This indicates substantial variation in target size across the dataset.

---

# 7. Relevance to Reinforcement Learning

The ESAD dataset is highly suitable for reinforcement learning-based visual search because:

* Images contain spatially localized targets.
* Bounding box annotations are available.
* Multiple objects may exist in a single frame.
* Target sizes vary considerably.
* Negative frames are present.

The RL agent can learn to:

1. Navigate within the image.
2. Search for surgical action regions.
3. Localize targets using bounding boxes.
4. Minimize search steps.
5. Maximize localization accuracy.

---

# 8. Challenges Identified

## Class Imbalance

Several classes have very few examples, which may negatively affect classification performance.

## Large Number of Negative Frames

More than half of the dataset contains no annotations.

## Multi-Object Scenes

Some frames contain multiple action regions, increasing localization complexity.

## Scale Variation

Objects range from extremely small regions to large regions occupying most of the image.

---

# 9. Strengths of the Dataset

* Large dataset size.
* High-quality YOLO annotations.
* Multi-class surgical action labels.
* Suitable for object detection.
* Suitable for localization tasks.
* Suitable for reinforcement learning visual search.
* Contains realistic surgical environments.
* Supports explainable AI research.

---

# 10. Conclusion

The ESAD dataset successfully passed all validation checks and is suitable for integration into the MedSearch-RL framework.

Key findings include:

* 40,152 total images.
* 21 surgical action classes.
* 18,793 annotated images.
* Valid YOLO localization annotations.
* Significant class imbalance.
* Wide variation in target sizes.

Overall, ESAD provides a strong foundation for developing and evaluating reinforcement learning-based medical visual search algorithms for surgical action detection, localization, and classification.
