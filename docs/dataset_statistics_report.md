# Dataset Statistics Analysis Report

## Project

**MedSearch-RL: A Multi-Domain Deep Reinforcement Learning Framework for Medical Object Detection, Localization, and Classification**

---

# 1. Objective

The objective of this analysis was to generate comprehensive statistics from the unified MedSearch-RL dataset after integrating the Brain MRI, ESAD, and MESAD datasets into a common schema and preprocessing pipeline.

The analysis was performed to:

* Validate dataset integration.
* Understand class distributions.
* Analyze localization characteristics.
* Measure object size variation.
* Support future Reinforcement Learning environment design.
* Guide reward engineering and search strategy development.

---

# 2. Unified Dataset Overview

The unified dataset combines three medical imaging domains:

| Domain    |    Samples |
| --------- | ---------: |
| Brain MRI |      3,064 |
| ESAD      |     40,152 |
| MESAD     |     25,390 |
| **Total** | **68,606** |

### Domain Distribution

| Domain | Percentage |
| ------ | ---------: |
| MRI    |      4.47% |
| ESAD   |     58.53% |
| MESAD  |     37.01% |

### Observation

The dataset is dominated by surgical endoscopy images (ESAD and MESAD), which together account for more than 95% of all samples. The MRI dataset contributes a smaller but clinically important neuroimaging domain that enables evaluation of cross-domain adaptability.

---

# 3. Localization Statistics

## Total Bounding Boxes

| Metric                  |  Value |
| ----------------------- | -----: |
| Total Bounding Boxes    | 69,951 |
| Total Images            | 68,606 |
| Average Boxes per Image |   1.02 |

### Observation

The average number of bounding boxes per image is approximately one. This indicates that most images contain a single clinically relevant target, while a smaller number of images contain multiple targets. This property is highly suitable for Reinforcement Learning-based visual search because the agent can focus on locating a small number of objects per episode.

---

# 4. Bounding Box Size Analysis

Bounding box statistics were computed after preprocessing and scaling all datasets to the common 512 × 512 image resolution.

## Width Statistics

| Metric        |     Value |
| ------------- | --------: |
| Minimum Width |     14 px |
| Maximum Width |    495 px |
| Average Width | 182.44 px |

## Height Statistics

| Metric         |     Value |
| -------------- | --------: |
| Minimum Height |     15 px |
| Maximum Height |    505 px |
| Average Height | 226.82 px |

## Area Statistics

| Metric       |         Value |
| ------------ | ------------: |
| Minimum Area |       320 px² |
| Maximum Area |   240,570 px² |
| Average Area | 48,623.66 px² |

### Observation

The dataset exhibits substantial scale variation.

Smallest targets occupy only a tiny portion of the image, while the largest targets cover almost the entire frame. Such variability confirms the necessity of incorporating zoom-based navigation actions into the Reinforcement Learning environment.

The average object dimensions indicate that most clinically relevant targets occupy a significant portion of the image, suggesting that an initial search window of approximately 256 × 256 pixels may provide a suitable balance between exploration and localization precision.

---

# 5. MRI Tumor Distribution

The Brain MRI dataset contains three tumor categories.

| Tumor Type      | Samples |
| --------------- | ------: |
| Glioma          |   1,426 |
| Pituitary Tumor |     930 |
| Meningioma      |     708 |

### Observation

Glioma is the most frequent tumor category, accounting for nearly half of all MRI samples. Although moderate imbalance exists, all tumor categories remain sufficiently represented for classification tasks.

---

# 6. Most Frequent Classes

The most common classes across the unified dataset are:

| Class                 |  Count |
| --------------------- | -----: |
| PullingTissue         | 12,638 |
| CuttingTissue         |  9,919 |
| SuckingBlood          |  8,647 |
| BladderAnastomosis    |  8,094 |
| PullingSeminalVesicle |  5,906 |
| CuttingSeminalVesicle |  5,320 |
| CuttingProstate       |  3,759 |
| BladderNeckDissection |  3,691 |

### Observation

A small number of surgical action classes account for a large proportion of all annotations. These classes are expected to dominate training unless class balancing strategies are introduced.

---

# 7. Least Frequent Classes

The rarest classes are:

| Class                  | Count |
| ---------------------- | ----: |
| BaggingProstate        |    83 |
| ClippingVasDeferens    |   106 |
| CuttingVasDeferens     |   177 |
| CuttingThread          |   255 |
| ClippingSeminalVesicle |   280 |
| ClippingBladderNeck    |   334 |

### Observation

The dataset exhibits severe class imbalance.

The most common class (PullingTissue) contains more than 150 times the number of samples available for the rarest class (BaggingProstate). This imbalance may negatively affect classification performance if not addressed during training.

Potential mitigation strategies include:

* Weighted loss functions
* Class-balanced sampling
* Data augmentation
* Class-aware reward shaping

---

# 8. Implications for Reinforcement Learning

The generated statistics provide valuable guidance for RL environment design.

## Search Window Design

Average object dimensions suggest that an initial search window size of approximately 256 × 256 pixels is appropriate for the majority of targets.

## Navigation Actions

Because object sizes range from extremely small to nearly full-image regions, the RL agent should support:

* Move Up
* Move Down
* Move Left
* Move Right
* Zoom In
* Zoom Out
* Stop

## Reward Engineering

Localization rewards should primarily depend on:

* Intersection over Union (IoU)
* Distance to target center
* Search efficiency

rather than class frequency to prevent bias toward dominant classes.

## Episode Length

Given the average object size and image resolution, an initial episode limit of approximately 30 steps is expected to provide sufficient exploration capability without excessive search duration.

---

# 9. Conclusion

The unified MedSearch-RL dataset contains 68,606 medical images and 69,951 localization annotations spanning three medical imaging domains: Brain MRI, ESAD, and MESAD.

The dataset successfully passed validation and annotation verification procedures. Statistical analysis confirmed substantial object size variability, significant class imbalance, and strong suitability for reinforcement learning-based visual search.

The generated statistics provide a solid foundation for designing the RL environment, navigation strategy, reward functions, and localization objectives in subsequent development phases.
