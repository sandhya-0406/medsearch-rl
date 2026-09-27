# MedSearch-RL Project Report

## 1. Project Overview

**MedSearch-RL** is a multi-domain medical image analysis system that combines deep reinforcement learning, domain classification, visual search, object localization, and medical image classification.

The project is designed to process medical images from three domains:

1. Brain MRI images containing tumors.
2. ESAD endoscopic images containing surgical action regions.
3. MESAD endoscopic images containing surgical action regions.

The central idea is to treat localization as a sequential visual-search problem. Instead of directly predicting a bounding box with a single detector, a domain-specific Deep Q-Network (DQN) agent navigates through an image by moving and changing the size of a search window. After the search process produces a region, the corresponding domain classifier assigns a medical or surgical class to the localized region.

The operational inference pipeline is:

```text
Uploaded image
    -> Image validation and preparation
    -> Domain classification
    -> Domain-specific RL agent selection
    -> Sequential visual-search localization
    -> Bounding-box clamping and ROI extraction
    -> Domain-specific medical classification
    -> JSON response for the frontend
```

The system also records the agent trajectory, actions, search windows, number of steps, confidence values, and processing times. These outputs are used by the frontend to make the model's search behavior inspectable.

## 2. Problem Statement

Conventional medical image models often return only a final class label or a final localization result. Such outputs provide limited information about how the model reached its decision. This is particularly important in medical imaging, where users may need to inspect the region analyzed by the model and understand the sequence of visual decisions.

MedSearch-RL addresses this problem by providing:

- Automatic identification of the input image domain.
- Separate expert agents for MRI, ESAD, and MESAD images.
- Reinforcement-learning-based navigation toward relevant image regions.
- Explicit bounding-box localization.
- Domain-specific classification after localization.
- A trajectory and search-window history that can be displayed in the user interface.

The system is therefore intended as an experimental and research-oriented framework for explainable multi-domain medical visual search. It is not a clinical diagnostic system.

## 3. Main Objectives

The repository implements or supports the following objectives:

- Combine different medical imaging datasets in a common project structure.
- Detect the input domain automatically.
- Route each image to an appropriate expert RL agent.
- Learn image navigation through discrete actions.
- Localize tumors or surgical action regions.
- Classify the localized region using a domain-specific classifier.
- Expose intermediate inference information through an API.
- Provide frontend views for upload, analysis, replay, analytics, and system status.
- Support training, validation, evaluation, and visualization experiments.

## 4. System Architecture

### 4.1 High-Level Architecture

```text
                         +----------------------+
                         |    Image Upload      |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         | Image Preparation     |
                         | Validation, channels  |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         | Domain Classifier     |
                         | MRI / ESAD / MESAD    |
                         +----------+-----------+
                                    |
             +----------------------+----------------------+
             |                      |                      |
             v                      v                      v
      +-------------+       +-------------+       +-------------+
      | MRI Agent   |       | ESAD Agent  |       | MESAD Agent |
      +------+------+       +------+------+       +------+------+
             |                      |                      |
             +----------------------+----------------------+
                                    |
                                    v
                         +----------------------+
                         | RL Visual Search    |
                         | Movement and zoom   |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         | Bounding Box / ROI  |
                         +----------+-----------+
                                    |
                                    v
             +----------------------+----------------------+
             |                      |                      |
             v                      v                      v
      +-------------+       +-------------+       +-------------+
      | MRI Class.  |       | ESAD Class. |       | MESAD Class.|
      +-------------+       +-------------+       +-------------+
                                    |
                                    v
                         +----------------------+
                         | API JSON Response    |
                         | and Frontend Views   |
                         +----------------------+
```

### 4.2 Backend Layers

The backend is organized into modules for:

- `api`: FastAPI application and HTTP routes.
- `agents`: DQN agent implementations.
- `classification`: classifier architecture, datasets, and training.
- `core`: configuration and model management.
- `datasets`: dataset loaders and unified dataset support.
- `domain`: domain-classifier architecture.
- `evaluation`: evaluation scripts and monitoring utilities.
- `inference`: prediction and replay-related utilities.
- `memory`: replay-buffer implementations.
- `models`: visual DQN architecture.
- `preprocessing`: image transforms, normalization, pipeline processing, and bounding-box utilities.
- `rl/environment`: visual-search environments and navigation logic.
- `services`: domain detection, localization, classification, and full prediction orchestration.
- `training`: training entry points and state processing.
- `validation` and `visualization`: validation and result-inspection utilities.

## 5. Datasets and Domain Support

### 5.1 Unified Dataset Summary

The repository's dataset statistics report describes a unified collection with the following documented totals:

| Domain | Images |
|---|---:|
| Brain MRI | 3,064 |
| ESAD | 40,152 |
| MESAD | 25,390 |
| **Total** | **68,606** |

The same report documents **69,951 bounding boxes** and an average of approximately **1.02 boxes per image**.

The documented domain distribution is:

| Domain | Percentage |
|---|---:|
| MRI | 4.47% |
| ESAD | 58.53% |
| MESAD | 37.01% |

These figures are repository documentation results and were not regenerated as part of writing this report.

### 5.2 Brain MRI Dataset

The MRI loader reads Figshare MATLAB files and extracts:

- The image from `cjdata/image`.
- The tumor mask from `cjdata/tumorMask`.
- The tumor label from `cjdata/label`.
- The patient identifier from `cjdata/PID`.

The tumor mask is used to generate a bounding box. The supported MRI classes in the current label mapping are:

- `Glioma`
- `Meningioma`
- `Pituitary`

The dataset statistics report records the following class counts:

| MRI class | Samples |
|---|---:|
| Glioma | 1,426 |
| Pituitary Tumor | 930 |
| Meningioma | 708 |

The runtime label mapping uses `Pituitary`, while the analysis report describes the category as `Pituitary Tumor`. This is a naming difference that should be kept in mind when preparing experimental tables.

### 5.3 ESAD Dataset

The ESAD loader reads JPG images and YOLO-format annotations. It:

- Reads class names from `obj.names`.
- Reads annotation text files.
- Converts normalized YOLO coordinates to pixel coordinates.
- Maps labels to the shared surgical-class vocabulary.

ESAD represents surgical action regions in endoscopic imagery. The current runtime classifier configuration assigns 21 classes to this domain.

### 5.4 MESAD Dataset

MESAD is a supported project domain and is present in the data, loading, training, model, and routing paths.

The MESAD loader reads:

- Images from `train/images` and `val/images`.
- Bounding boxes from `.bboxes.tsv` files.
- Labels from `.bboxes.labels.tsv` files.

Unlike the normalized YOLO annotation format used by ESAD, MESAD annotations use explicit pixel coordinates. The loader maps MESAD labels through the shared surgical-class mapping.

MESAD is configured as a 21-class classification domain and uses its own RL agent checkpoint path. The current shared runtime class list is:

```text
CuttingMesocolon
PullingVasDeferens
ClippingVasDeferens
CuttingVasDeferens
ClippingTissue
PullingSeminalVesicle
ClippingSeminalVesicle
CuttingSeminalVesicle
SuckingBlood
SuckingSmoke
PullingTissue
CuttingTissue
BaggingProstate
BladderNeckDissection
BladderAnastomosis
PullingProstate
ClippingBladderNeck
CuttingThread
UrethraDissection
CuttingProstate
PullingBladderNeck
```

In the runtime code, `MESAD_CLASSES` is assigned the same class list as `ESAD_CLASSES`. This means MESAD has a distinct domain route and agent, but shares the 21-class label vocabulary with ESAD.

### 5.5 Unified Dataset and Classification Dataset

`backend/datasets/unified_dataset.py` combines MRI, ESAD, and MESAD samples into a common representation and applies preprocessing.

The classification dataset path builds or loads classification caches and crops annotated objects for classifier training. This allows the localization and classification stages to use related but separate training representations.

## 6. Reinforcement Learning Formulation

The visual-search task is modeled as a Markov Decision Process:

$$
MDP = (S, A, T, R)
$$

where:

- $S$ is the state space.
- $A$ is the action space.
- $T$ is the transition function.
- $R$ is the reward function.

### 6.1 State Representation

The state contains:

1. The current image patch.
2. Normalized spatial information.
3. Normalized temporal information.
4. State-history information used by the implementation.

The visual patch is resized to approximately `128 x 128 x 3`. The spatial features represent the search-window position and dimensions:

```text
x_norm = x / image_width
y_norm = y / image_height
w_norm = window_width / image_width
h_norm = window_height / image_height
```

Temporal progress is represented using:

```text
step_ratio = current_step / max_steps
```

The current state-processing implementation also encodes recent action history. The repository summary describes a state dimension of 577, consisting of the visual/spatial state representation and action-history features used by the DQN configuration.

### 6.2 Actions

The design documents specify seven actions:

| Action ID | Action |
|---:|---|
| 0 | Move Up |
| 1 | Move Down |
| 2 | Move Left |
| 3 | Move Right |
| 4 | Zoom In |
| 5 | Zoom Out |
| 6 | Stop |

The current active environment implementation uses six actions, IDs `0` through `5`. The Stop action is documented but commented out in the current environments. Therefore, the six movement and zoom actions are the currently verified active action set.

Movement is relative to the current search-window size. The design documentation describes a movement step of approximately 20% of the current window width. Zoom operations reduce or increase the search-window dimensions while maintaining image boundaries.

### 6.3 Environment Behavior

The main environment components include:

- `medsearch_env.py` for ESAD and MESAD-style visual search.
- `mri_env.py` for MRI search.
- `navigation_engine.py` for window movement and navigation.
- `state_processor.py` for converting environment observations into model inputs.

Implemented environment capabilities include:

- Up, down, left, and right movement.
- Zoom in and zoom out.
- Image-boundary clipping.
- Search-window history.
- Action history.
- Trajectory recording.
- Replay-compatible state tracking.
- Image-patch observations.
- Normalized spatial and temporal features.

During training, the documented design selects one target box per episode, including a randomly selected target when multiple ground-truth boxes are available.

### 6.4 Rewards and Termination

The design reports describe reward components based on:

- Improvement in Intersection over Union (IoU).
- Distance or movement toward the target.
- Successful localization.
- Search efficiency.
- Step penalties.
- Boundary penalties.
- Early-stop penalties.
- Failure penalties.
- Exploration or coverage behavior.

The intended localization quality measure is IoU:

$$
IoU = \frac{Area(\text{prediction} \cap \text{target})}{Area(\text{prediction} \cup \text{target})}
$$

The current inference implementation terminates based on the maximum number of steps. The repository summary indicates that Stop-action termination and IoU-based early termination are not active in the current implementation. The localization service uses a default maximum of 150 steps, while the environment constructors have a current default of 50 steps. This difference should be resolved before reporting a single definitive episode-length value.

## 7. Model Architecture and Checkpoints

### 7.1 Domain Classifier

The domain classifier is a dedicated three-class CNN that routes an input image to:

- MRI.
- ESAD.
- MESAD.

The domain service:

- Converts grayscale and alpha-channel images to three-channel images.
- Converts OpenCV image data to the expected color representation.
- Resizes input to `224 x 224`.
- Applies per-image min-max normalization.
- Runs inference using CPU or CUDA depending on availability.
- Returns the predicted domain, confidence, and scores for all three domains.

The domain checkpoint is configured at:

```text
backend/weights/domain/domain_classifier.pth
```

### 7.2 RL Agents

The RL agents use a visual DQN architecture and checkpointed online and target networks. The agent wrapper supports loading a checkpoint and switching into deterministic inference mode.

Separate agent checkpoints are configured for:

```text
backend/weights/agents/mri_agent.pth
backend/weights/agents/esad_agent.pth
backend/weights/agents/mesad_agent.pth
```

The presence of a separate MESAD agent confirms that MESAD is part of the intended expert-routing design rather than only a dataset-analysis label.

### 7.3 Medical Classifiers

The medical classifier is implemented as a custom convolutional architecture with residual blocks and CBAM attention. The configured number of output classes is:

| Domain | Classes |
|---|---:|
| MRI | 3 |
| ESAD | 21 |
| MESAD | 21 |

Classifier checkpoints are configured at:

```text
backend/weights/classifiers/mri_classifier.pth
backend/weights/classifiers/esad_classifier.pth
backend/weights/classifiers/mesad_classifier.pth
```

The classification service prepares the localized ROI by:

- Rejecting empty inputs.
- Converting grayscale input to three channels.
- Converting RGBA input to three channels.
- Resizing to `224 x 224`.
- Scaling values to approximately `[0, 1]` when needed.
- Running the classifier in evaluation mode.
- Applying softmax to the logits.
- Returning the best class and up to five ranked predictions.

### 7.4 Current Checkpoint Status

The runtime configuration includes MESAD classification, but the repository inspection found that `backend/weights/classifiers/mesad_classifier.pth` is missing. The model manager skips missing checkpoint files during startup.

Consequently:

- MRI agent and classifier loading is supported.
- ESAD agent and classifier loading is supported.
- MESAD agent loading is supported.
- MESAD classifier configuration and code are present.
- MESAD classification is not fully operational until its classifier checkpoint is available.

This is the most important current limitation when describing end-to-end MESAD inference.

## 8. Backend API

### 8.1 Operational Application

The operational FastAPI application is defined in:

```text
backend/api/app.py
```

At startup, a lifespan handler loads available agents and classifiers through the model manager. The API includes CORS settings for local frontend development at ports 3000 and 5173.

The root endpoint returns the project name, online status, and version.

### 8.2 Prediction Endpoint

```http
POST /api/v1/predict
```

The endpoint accepts a multipart form upload with the field name `file`.

Supported content types are:

- `image/jpeg`
- `image/jpg`
- `image/png`
- `image/webp`
- `image/bmp`

The route validates the content type, reads the uploaded bytes, decodes the image with OpenCV, and executes the complete prediction service.

The endpoint returns HTTP 400 for invalid input, HTTP 503 for unavailable runtime model services, and HTTP 500 for unexpected processing failures.

The successful response contains:

```json
{
  "success": true,
  "processing_time": 0.0,
  "domain": {
    "name": "MRI",
    "confidence": 0.0,
    "scores": {}
  },
  "localization": {
    "bbox": {},
    "trajectory": [],
    "actions": [],
    "windows": [],
    "steps": 0,
    "processing_time": 0.0
  },
  "classification": {
    "class_id": 0,
    "class_name": "Glioma",
    "confidence": 0.0,
    "top_5": []
  },
  "file": {
    "filename": "uploaded-image.png",
    "content_type": "image/png"
  },
  "request_time": 0.0
}
```

The numeric values above are illustrative response shapes, not measured output values.

### 8.3 Status Endpoint

```http
GET /api/v1/status
```

The status endpoint reports:

- Loaded agent domains.
- Loaded classifier domains.
- Selected PyTorch device.

The current frontend expects additional GPU-related fields in some views, but those fields are not currently returned by the backend status route. As a result, the frontend may fall back to CPU-style display values.

### 8.4 Prediction Processing Details

The prediction service performs these operations:

1. Validate that the input is a non-empty NumPy array.
2. Convert grayscale or four-channel images into a three-channel representation.
3. Predict the input domain.
4. Select the matching RL localization service.
5. Run deterministic agent inference.
6. Clamp the returned bounding box to the image boundaries.
7. Crop the ROI.
8. Run the classifier for the detected domain.
9. Return domain, localization, classification, and timing metadata.

## 9. Frontend Applications

The repository contains two frontend implementations.

### 9.1 Frontend-v2

`frontend-v2` is the currently API-connected frontend implementation. It uses React, TypeScript, Vite, React Router, Axios, Zustand, Recharts, Framer Motion, and Lucide icons.

The documented application routes are:

- `/dashboard`
- `/analyze`
- `/decision-lab`
- `/analytics`
- `/playground`
- `/settings`

Its implemented capabilities include:

- Image upload.
- Backend status display.
- Domain confidence and domain scores.
- Bounding-box visualization.
- Search-window visualization.
- Agent trajectory replay.
- Coordinate display.
- Top-five classification display.
- Decision Lab views.
- Local inference history stored in browser `localStorage`.
- Sample-image Playground.
- Medical and AI workspace themes.
- Analytics and system-status views.

The frontend API service calls:

```text
GET  /api/v1/status
POST /api/v1/predict
```

The frontend-v2 production build was reported as successful during repository inspection.

### 9.2 Legacy Frontend

The `frontend` directory contains an earlier React implementation with routes for:

- Dashboard.
- Upload Center.
- Analytics.
- Replay Studio.

Several future-oriented routes remain commented out, including classification, heatmaps, comparison, explainability, playground, and settings.

The legacy upload service is a mock implementation. It waits for a fixed period and returns a hard-coded MRI/Glioma-style result instead of calling the backend API. Therefore, the legacy frontend can build successfully but does not represent live end-to-end inference.

### 9.3 Analytics Status

The frontend analytics service supports optional remote data but can fall back to local bundled data. No corresponding backend analytics route was identified in the current backend tree.

Frontend-v2 analytics primarily uses local browser session history. Benchmark evaluation metrics should therefore be described as unverified unless they are independently produced by the evaluation scripts.

## 10. Training and Evaluation Components

The repository contains training entry points for:

- MRI agent training.
- ESAD agent training.
- MESAD agent training.
- Domain-classifier training.
- Medical classifier training.

Important training-related modules include:

- DQN and Double-DQN logic.
- Replay buffers.
- State processing.
- Dataset caching and preprocessing.
- Checkpoint saving.
- Evaluation and monitoring utilities.

Representative entry points include:

```text
backend/training/train_mri_agent.py
backend/training/train_esad_agent.py
backend/training/train_mesad_agent.py
backend/training/train_domain_classifier.py
backend/classification/training/train_classifier.py
backend/evaluation/evaluate.py
```

The evaluation code reports metrics such as reward, IoU, step count, and success. The current evaluation implementation uses a success threshold of `0.3`, whereas some design documents describe a threshold of `0.7`. Results should always state which implementation and threshold produced them.

Some training scripts contain stale imports or paths that do not exactly match the current repository layout. They should be treated as experimental entry points unless executed successfully in the configured environment.

## 11. Dataset Characteristics and Research Implications

The documented statistics show three important properties.

### 11.1 Strong Domain Imbalance

ESAD and MESAD together account for more than 95% of the documented image collection, while MRI is a much smaller domain. This imbalance can affect unified training and domain-classifier behavior.

### 11.2 Large Object-Scale Variation

The analysis report documents bounding-box widths from 14 to 495 pixels and heights from 15 to 505 pixels after scaling to a common `512 x 512` representation. This supports the use of zoom-in and zoom-out actions in the RL environment.

### 11.3 Surgical-Class Imbalance

The most frequent surgical class, `PullingTissue`, is documented with 12,638 samples, while the rarest listed class, `BaggingProstate`, has 83 samples. This is a severe imbalance and may require weighted loss functions, balanced sampling, augmentation, or class-aware reward strategies in future experiments.

## 12. Installation and Running Guidance

### 12.1 Backend

The repository uses Python dependencies listed in the root requirements files and has a project virtual environment named `.venv` in the inspected workspace.

The operational FastAPI application can be started from the project root with:

```powershell
uvicorn backend.api.app:app --reload
```

This command follows the actual application module path. Model loading occurs during application startup, so the required checkpoints and Python dependencies must be available before the server can provide predictions.

### 12.2 Frontend-v2

From the `frontend-v2` directory:

```powershell
npm install
npm run dev
```

For a production build:

```powershell
npm run build
```

### 12.3 Legacy Frontend

From the `frontend` directory:

```powershell
npm install
npm run dev
```

Its build command is:

```powershell
npm run build
```

The legacy upload screen should be considered mock-data based unless its upload service is replaced with the backend API service.

## 13. Verification and Current Limitations

### 13.1 Reported Verification

The repository inspection reported successful:

- Python source compilation.
- `frontend-v2` production build.
- Legacy frontend production build.

### 13.2 Tests

The repository contains tests and validation scripts under:

```text
tests/
backend/evaluation/
backend/validation/
```

The Python test suite could not be run in the inspected environment because `pytest` was not installed in the active virtual environment. Existing validation documentation reports random-policy environment tests, but those results were not independently regenerated for this report.

### 13.3 Important Runtime Limitations

The following points should be stated clearly in any formal report:

1. The MESAD dataset loader, domain route, RL agent, classifier configuration, and training entry point are present.
2. The MESAD classifier checkpoint is currently missing, so MESAD classification is not fully end-to-end operational.
3. `backend/api/app.py` is the verified application entry point.
4. `backend/main.py` references `backend.api.router` and `backend.core.startup`, which are not present in the inspected tree and therefore should not be treated as the active startup path.
5. The legacy frontend uses mocked upload inference.
6. The analytics views can use local or mock data, and there is no verified backend analytics endpoint.
7. The design documents specify seven actions and IoU-based early stopping, while the current runtime environment has six active actions and maximum-step termination.
8. Design and evaluation IoU thresholds differ; the evaluation implementation currently reports a threshold of `0.3`.
9. The documented statistics are analysis results and should not be presented as newly measured results unless the analysis is rerun.
10. Missing model files are skipped by the model manager, which allows startup with an incomplete model set but causes domain-specific prediction failures later.

## 14. Conclusion

MedSearch-RL is a multi-domain medical visual-search framework built around expert-guided deep reinforcement learning. It brings together Brain MRI, ESAD, and MESAD data through dataset loaders, a unified preprocessing direction, domain-specific RL agents, and domain-specific classifiers.

The working backend pipeline accepts an image, identifies its domain, routes it to the relevant expert agent, performs sequential localization, extracts an ROI, and returns a ranked classification result together with the agent's trajectory and search history. The API-connected frontend-v2 presents these outputs through analysis, replay, decision, analytics, playground, and settings views.

MESAD is a genuine project component: it has a loader, dataset integration, dedicated agent checkpoint configuration, domain routing, 21-class classifier configuration, and a training entry point. However, the missing `mesad_classifier.pth` checkpoint means that MESAD support should currently be described as implemented in the software architecture and partially operational in runtime, rather than fully verified end to end.

The project provides a substantial foundation for explainable medical visual search research. Future work should focus on completing the MESAD classifier artifact, aligning design documents with runtime behavior, validating every training entry point, adding reproducible evaluation commands, and separating verified benchmark results from local frontend analytics or mock data.

## 15. Repository References

- `backend/api/app.py` - operational FastAPI application.
- `backend/api/routes/predict.py` - image prediction endpoint.
- `backend/api/routes/status.py` - model and device status endpoint.
- `backend/services/predict_service.py` - complete inference orchestration.
- `backend/services/domain_service.py` - MRI/ESAD/MESAD domain routing.
- `backend/services/localization_service.py` - domain-specific RL localization.
- `backend/services/classification_service.py` - ROI preparation and classification.
- `backend/core/model_manager.py` - checkpoint loading and model registry.
- `backend/datasets/mri_loader.py` - MRI loading.
- `backend/datasets/esad_loader.py` - ESAD loading.
- `backend/datasets/mesad_loader.py` - MESAD loading.
- `backend/rl/environment/medsearch_env.py` - visual-search environment.
- `backend/rl/environment/mri_env.py` - MRI visual-search environment.
- `backend/training/train_mesad_agent.py` - MESAD agent training entry point.
- `frontend-v2/src/services/api.ts` - API-connected frontend service.
- `docs/project_vision.md` - project objectives and intended architecture.
- `docs/RL_design_summary.md` - RL formulation and design.
- `docs/dataset_statistics_report.md` - documented dataset analysis.
