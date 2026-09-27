# MedSearch-RL

MedSearch-RL is a research-oriented, multi-domain medical image analysis system. It combines domain classification, deep reinforcement learning (DQN), visual search, object localization, and domain-specific classification in one inspectable pipeline.

The supported domains are:

- Brain MRI tumor images
- ESAD surgical endoscopy images
- MESAD surgical endoscopy images

The project is intended for experimentation and explainable visual-search research. It is **not a clinical diagnostic system**.

## What It Does

For an uploaded image, the system performs the following steps:

```text
Image upload
  -> image validation and preparation
  -> domain classification (MRI / ESAD / MESAD)
  -> domain-specific DQN agent selection
  -> sequential visual search and localization
  -> bounding-box clamping and ROI extraction
  -> domain-specific classification
  -> JSON result with trajectory and timing information
```

The reinforcement-learning environment represents visual search as a sequence of actions over a movable and resizable search window:

| Action | Meaning |
|---|---|
| `0` | Move up |
| `1` | Move down |
| `2` | Move left |
| `3` | Move right |
| `4` | Zoom in |
| `5` | Zoom out |
| `6` | Stop |

## Repository Layout

```text
backend/
  api/             FastAPI application and HTTP routes
  agents/          DQN agent implementations
  classification/  Classifiers, datasets, training, and evaluation
  core/             Runtime configuration and model management
  datasets/        MRI, ESAD, MESAD, and unified dataset loaders
  domain/          Domain-classifier implementation
  evaluation/      Evaluation and monitoring scripts
  memory/          Replay-buffer implementations
  models/          Visual DQN models
  preprocessing/   Image transforms, normalization, and box utilities
  rl/environment/  Visual-search environments
  services/        Domain, localization, classification, and prediction services
  training/        DQN and classifier training entry points
data/              Local datasets and metadata
checkpoints/       Experiment checkpoints and saved training artifacts
docs/              Design documents, reports, and validation results
experiments/       Experiment-specific outputs and scripts
frontend-v2/       Current React + TypeScript + Vite frontend
notebooks/         Dataset exploration and validation notebooks
tests/             Python tests for loaders, validation, and project utilities
```

## Requirements

- Python 3.10 or newer recommended
- Node.js 18 or newer recommended
- npm
- A CPU is supported; CUDA is used automatically when available
- Local copies of the required datasets and trained model weights

The Python dependencies are split across requirement files. `requirements_yolo.txt` contains the core machine-learning and image-processing packages, while `requirements.txt` and `requirements_utf8.txt` are broader environment exports. Install the runtime web packages explicitly as well.

## Installation

From the repository root, create and activate a virtual environment:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
```

Install the backend dependencies:

```powershell
pip install -r requirements_yolo.txt
pip install fastapi uvicorn python-multipart
```

If you need the notebook and analysis environment, install the broader environment export as well:

```powershell
pip install -r requirements.txt
```

Install the frontend dependencies:

```powershell
cd frontend-v2
npm install
cd ..
```

## Model Weights

At startup, the backend looks for these files under `backend/weights`:

```text
backend/weights/
  agents/
    mri_agent.pth
    esad_agent.pth
    mesad_agent.pth
  classifiers/
    mri_classifier.pth
    esad_classifier.pth
    mesad_classifier.pth
```

The directory is ignored by Git because trained weights can be large. Place compatible checkpoints there before running inference. The model manager reports missing files and loads whichever configured models are available; a complete prediction requires the models needed by the selected domain and the domain-classification pipeline.

The runtime paths and class counts are defined in [backend/core/config.py](backend/core/config.py). The repository also contains experiment artifacts under `checkpoints/`; those files are not automatically substituted for the runtime paths above.

## Run the Application

Start the backend from the repository root:

```powershell
.\.venv\Scripts\python.exe -m uvicorn backend.api.app:app --reload --port 8000
```

The API is available at `http://127.0.0.1:8000`. FastAPI documentation is available at:

- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/redoc`

In a second terminal, start the frontend:

```powershell
cd frontend-v2
npm run dev
```

Vite serves the frontend on `http://localhost:3000`. The frontend API base URL defaults to `http://127.0.0.1:8000/api/v1`. To use another backend URL, create `frontend-v2/.env.local`:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## API

### `GET /`

Returns basic backend information.

### `GET /api/v1/status`

Returns server and model status, including loaded agents, loaded classifiers, and the selected device.

### `POST /api/v1/predict`

Accepts a multipart form upload with the field name `file`. Supported content types are JPEG, PNG, WEBP, and BMP.

Example request:

```powershell
curl.exe -X POST http://127.0.0.1:8000/api/v1/predict `
  -F "file=@path\to\image.jpg"
```

Successful responses include:

- `domain`: predicted domain, confidence, and domain scores
- `localization`: bounding box and visual-search trajectory
- `classification`: domain-specific class prediction and scores
- `processing_time` and request metadata

Invalid uploads return `400`. Runtime model availability errors return `503`.

## Datasets

The repository expects local dataset files under `data/`. Dataset loading and annotation formats are implemented in:

- [backend/datasets/mri_loader.py](backend/datasets/mri_loader.py) for Figshare MATLAB MRI data and tumor masks
- [backend/datasets/esad_loader.py](backend/datasets/esad_loader.py) for JPG images and YOLO annotations
- [backend/datasets/mesad_loader.py](backend/datasets/mesad_loader.py) for MESAD images and TSV bounding-box annotations
- [backend/datasets/unified_dataset.py](backend/datasets/unified_dataset.py) for shared multi-domain access

The project documentation reports a unified collection of 68,606 images across the three domains. These figures describe the documented dataset snapshot; they are not generated automatically during application startup.

## Training and Evaluation

Training scripts are in `backend/training/`:

```text
train_domain_classifier.py
train_mri_agent.py
train_esad_agent.py
train_mesad_agent.py
double_dqn_trainer.py
run_training.py
```

Before training, verify dataset paths, output directories, device settings, and checkpoint destinations in the relevant script and configuration module. `run_training.py` demonstrates the unified dataset, environment, replay buffer, trainer, and metric-plotting flow; it is an experiment script rather than a packaged CLI.


## Testing and Frontend Checks

Run the Python test suite from the repository root:

```powershell
pytest
```

Run frontend checks from `frontend-v2`:

```powershell
npm run lint
npm run build
```

Some tests and training workflows require local datasets or model artifacts. If those files are not present, environment-dependent tests may fail even when the source code is installed correctly.

## Development Notes

- The active backend entry point is `backend.api.app:app`.
- The current frontend is `frontend-v2`; the older `frontend/` tree is no longer the active UI.
- CORS is configured for the local Vite and common development origins. Restrict allowed origins before deploying.
- Uploaded images are decoded with OpenCV and normalized to three channels before inference.
- Model loading occurs during FastAPI startup, so startup logs show which agents and classifiers were found.
- Results are designed to make the search process inspectable, including bounding boxes, actions, windows, and trajectory history.

## Disclaimer

MedSearch-RL is an experimental software project for research, education, and model-development workflows. Its outputs must not be used as a substitute for professional medical judgment, diagnosis, or treatment.
