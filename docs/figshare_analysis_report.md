# Brain MRI (Figshare) Dataset Analysis Report

## Dataset Overview

The Brain MRI dataset is a medical imaging dataset containing T1-weighted contrast-enhanced magnetic resonance imaging (MRI) scans collected from 233 patients. The dataset is designed for brain tumor analysis and contains three major tumor categories:

| Tumor Type      | Images   |
| --------------- | -------- |
| Meningioma      | 708      |
| Glioma          | 1426     |
| Pituitary Tumor | 930      |
| **Total**       | **3064** |

The dataset serves as the neuroimaging domain of the MedSearch-RL framework and supports tumor detection, localization, and classification tasks.

---

# Image Characteristics

## Image Resolution

All MRI scans have a uniform image resolution:

| Property        | Value           |
| --------------- | --------------- |
| Width           | 512 pixels      |
| Height          | 512 pixels      |
| Resolution      | 512 × 512       |
| Pixel Size      | 0.49 × 0.49 mm² |
| Slice Thickness | 6 mm            |
| Slice Gap       | 1 mm            |

### Observation

The dataset exhibits complete resolution consistency across all images. This significantly simplifies preprocessing and enables the development of a unified image pipeline without introducing resolution-related variability.

---

# Dataset Structure

Each sample is stored as a MATLAB `.mat` file containing a structure named `cjdata`.

## Available Fields

### Label

```text
cjdata.label
```

Class labels:

| Label | Tumor Type      |
| ----- | --------------- |
| 1     | Meningioma      |
| 2     | Glioma          |
| 3     | Pituitary Tumor |

---

### Patient ID

```text
cjdata.PID
```

Stores the patient identifier associated with the MRI slice.

---

### MRI Image

```text
cjdata.image
```

Stores the original MRI image data.

---

### Tumor Border

```text
cjdata.tumorBorder
```

Contains manually annotated tumor boundary coordinates represented as:

```text
[x1, y1, x2, y2, ..., xn, yn]
```

Each coordinate pair represents a point on the tumor contour.

---

### Tumor Mask

```text
cjdata.tumorMask
```

Binary segmentation mask where:

```text
1 = Tumor Region
0 = Background
```

The tumor mask provides precise pixel-level localization of tumor regions.

---

# Class Distribution Analysis

## Tumor Category Distribution

| Tumor Type      | Samples | Percentage |
| --------------- | ------- | ---------- |
| Meningioma      | 708     | 23.1%      |
| Glioma          | 1426    | 46.5%      |
| Pituitary Tumor | 930     | 30.4%      |

### Observation

The dataset exhibits moderate class imbalance, with Glioma accounting for nearly half of all samples. This imbalance should be considered during model training and evaluation.

---

# Localization Information

Unlike ESAD and MESAD, which provide rectangular bounding boxes, the MRI dataset provides:

* Tumor boundary coordinates
* Pixel-level tumor masks

This allows the generation of:

* Segmentation masks
* Bounding boxes
* Tumor centroids
* Tumor area measurements

### Observation

The availability of pixel-level annotations provides richer localization information than traditional bounding box datasets and enables multiple forms of supervision.

---

# Preprocessing Analysis

## Normalization

MRI intensity values are normalized to:

```text
Range: [0,1]
Datatype: float32
```

### Observation

Intensity normalization standardizes image values across patients and improves training stability for CNN and reinforcement learning models.

---

## Image Conversion

The dataset can be converted from MATLAB format to standard image formats such as:

* JPG
* PNG
* TIFF

This conversion enables integration with conventional computer vision pipelines and deep learning frameworks.

---

# Suitability for MedSearch-RL

## Detection Task

### Objective

Determine whether a clinically relevant tumor region is present.

### Status

✅ Supported

---

## Localization Task

### Objective

Locate the tumor region within the MRI image.

### Status

✅ Supported

### Annotation Sources

* Tumor Border Coordinates
* Tumor Mask
* Derived Bounding Boxes

---

## Classification Task

### Objective

Classify the tumor into one of three categories.

### Status

✅ Supported

Classes:

* Meningioma
* Glioma
* Pituitary Tumor

---

## Reinforcement Learning Visual Search

### Objective

Enable the RL agent to navigate through the MRI image and discover tumor regions.

### Status

✅ Supported

The tumor masks and border annotations provide precise reward generation targets for RL-based localization.

---

# Advantages for Reinforcement Learning

The MRI dataset offers several advantages for visual search learning:

1. Uniform image dimensions.
2. Consistent imaging protocol.
3. High-quality expert annotations.
4. Pixel-level tumor localization.
5. Multi-class classification capability.
6. Realistic tumor size and position variability.

These properties make the dataset highly suitable for training and evaluating reinforcement learning agents that learn efficient search strategies.

---

# Challenges

Several challenges increase the complexity of the visual search task:

* Tumor sizes vary considerably.
* Tumor locations differ across patients.
* Class imbalance exists between tumor categories.
* MRI intensity patterns can vary across scans.

These factors encourage the RL agent to learn generalized search behavior rather than memorizing fixed locations.

---

# Integration into MedSearch-RL

Within the MedSearch-RL architecture, the MRI dataset contributes:

* Brain Tumor Detection
* Tumor Localization
* Tumor Classification
* RL-Based Visual Search
* Explainable Decision Tracking
* Multi-Domain Evaluation

The MRI dataset complements the ESAD and MESAD surgical datasets by providing a distinct neuroimaging domain, enabling the framework to demonstrate cross-domain adaptability.

---

# Conclusion

The Brain MRI (Figshare) dataset is a high-quality medical imaging dataset containing 3064 contrast-enhanced MRI slices from 233 patients across three tumor categories. Its uniform image resolution, expert-generated tumor boundaries, binary tumor masks, and multi-class labels make it well-suited for object detection, localization, classification, and reinforcement learning-based visual search.

The dataset fulfills all major requirements of the MedSearch-RL framework and serves as the primary neuroimaging domain alongside ESAD and MESAD for multi-domain medical visual search research.
