import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { predictMedicalImage } from '../services/api';
import { useSessionStore } from '../stores/useSessionStore';
import { PredictResponse, parseBBox, parseSearchWindow, parseTrajectoryPoint } from '../types/api';
import {
  ImageDimensions,
  PixelPoint,
  toPixelBoundingBox,
  toPixelCoordinates,
} from '../utils/coordinates';
import { UploadZone } from '../components/medical/UploadZone';
import { ImageViewer } from '../components/medical/ImageViewer';
import { PredictionPanel } from '../components/medical/PredictionPanel';
import { TrajectoryReplayer } from '../components/medical/TrajectoryReplayer';
import { CoordinateInfoPanel } from '../components/medical/CoordinateInfoPanel';
import { GlassCard } from '../components/common/GlassCard';
import {
  Scan,
  GitMerge,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Layers,
  Target,
  Clock,
  Navigation,
  Brain,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export const AnalyzeImagePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentAnalysis,
    setCurrentAnalysisFile,
    setCurrentAnalysisStage,
    setCurrentAnalysisError,
    setAnalysisResult,
    startNewAnalysis,
  } = useSessionStore();

  const { file, previewUrl, result, stage, errorMessage } = currentAnalysis;
  const [activeStepIndex, setActiveStepIndex] = useState<number | undefined>(undefined);

  // Coordinate tracking state
  const [dimensions, setDimensions] = useState<ImageDimensions>({ naturalWidth: 512, naturalHeight: 512 });
  const [cursorPos, setCursorPos] = useState<PixelPoint | null>(null);

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    let timer3: NodeJS.Timeout;

    if (stage === 'domain_detection') {
      timer1 = setTimeout(() => setCurrentAnalysisStage('rl_search'), 400);
      timer2 = setTimeout(() => setCurrentAnalysisStage('localization'), 900);
      timer3 = setTimeout(() => setCurrentAnalysisStage('classification'), 1400);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [stage, setCurrentAnalysisStage]);

  const predictMutation = useMutation({
    mutationFn: predictMedicalImage,
    onMutate: () => {
      setCurrentAnalysisError(null);
      setCurrentAnalysisStage('domain_detection');
    },
    onSuccess: (data: PredictResponse) => {
      if (!data || data.success === false) {
        setCurrentAnalysisError('Inference pipeline execution returned an unsuccessful status.');
        return;
      }
      setAnalysisResult(data);
    },
    onError: (error: Error) => {
      setCurrentAnalysisError(
        error.message || 'Failed to communicate with /api/v1/predict backend service.'
      );
    },
  });

  const handleFileSelect = (selectedFile: File) => {
    const objectUrl = URL.createObjectURL(selectedFile);
    setCurrentAnalysisFile(selectedFile, objectUrl);
    setActiveStepIndex(undefined);
  };

  const handleStartInference = () => {
    if (file) {
      predictMutation.mutate(file);
    }
  };

  const handleChangeImage = () => {
    startNewAnalysis();
    setActiveStepIndex(undefined);
  };

  const parsedBbox = parseBBox(result?.localization?.bbox);
  const pixelBbox = result?.localization?.bbox
    ? toPixelBoundingBox(result.localization.bbox, dimensions)
    : null;

  // Trajectory and window coordinates
  const rawTrajectory = result?.localization?.trajectory || [];
  const trajectoryPoints = rawTrajectory.map(parseTrajectoryPoint);
  const effectiveStep =
    activeStepIndex !== undefined
      ? Math.min(activeStepIndex, Math.max(0, trajectoryPoints.length - 1))
      : Math.max(0, trajectoryPoints.length - 1);

  const currentRawPoint = trajectoryPoints[effectiveStep] || null;
  const currentAgentPixel = currentRawPoint ? toPixelCoordinates(currentRawPoint, dimensions) : null;

  const windows = result?.localization?.windows || [];
  const activeRawWindow = windows[effectiveStep] || windows[windows.length - 1];
  const pixelSearchWindow = activeRawWindow ? toPixelBoundingBox(activeRawWindow, dimensions) : null;

  const actionsList = result?.localization?.actions || [];
  const totalSteps = result?.localization?.steps || actionsList.length || 0;
  const currentAction = actionsList[effectiveStep] || (stage === 'completed' ? 'Target Localized' : undefined);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scan className="w-6 h-6 text-blue-600 dark:text-cyan-400" /> Analyze Medical Image
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-inter">
            Execute reinforcement learning visual search, spatial coordinate localization, and classification.
          </p>
        </div>

        {result && stage === 'completed' && (
          <button
            onClick={() => navigate('/decision-lab')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition"
          >
            <GitMerge className="w-4 h-4" /> Open Decision Lab
          </button>
        )}
      </div>

      <GlassCard>
        {!previewUrl ? (
          <UploadZone onFileSelect={handleFileSelect} isLoading={predictMutation.isPending} />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <img
                  src={previewUrl}
                  alt="Medical Scan Preview"
                  className="w-14 h-14 object-cover rounded-lg border border-slate-300 dark:border-slate-700"
                />
                <div>
                  <div className="font-poppins font-medium text-sm text-slate-800 dark:text-slate-200">
                    {file?.name || 'Medical Scan'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {dimensions.naturalWidth} × {dimensions.naturalHeight} px &bull; {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Active'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {stage !== 'completed' && (
                  <button
                    onClick={handleStartInference}
                    disabled={predictMutation.isPending || !file}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-950 text-white font-semibold text-xs shadow-md flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {predictMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Pipeline...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" /> Start Inference
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={handleChangeImage}
                  disabled={predictMutation.isPending}
                  className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Change Image
                </button>
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Progress & Error Displays */}
      {stage === 'error' && (
        <GlassCard className="border-rose-500/30 bg-rose-500/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-poppins font-bold text-sm text-slate-900 dark:text-slate-100">
                  Analysis Failed
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {errorMessage || 'Unable to render inference results.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleStartInference}
              disabled={!file}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Analysis
            </button>
          </div>
        </GlassCard>
      )}

      {/* Interactive Inference Results */}
      {previewUrl && result && stage === 'completed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Visualizer (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <GlassCard title="Medical Workstation Viewer" headerIcon={<Target className="w-4 h-4" />}>
              <ImageViewer
                imageUrl={previewUrl}
                localization={result.localization}
                currentStepIndex={activeStepIndex}
                initialCoordinatesEnabled={false}
                onCoordinatesChange={(data) => {
                  setDimensions(data.dimensions);
                  setCursorPos(data.cursor);
                }}
              />
            </GlassCard>

            {result.localization && (
              <GlassCard title="RL Search Trajectory & Search Windows" headerIcon={<Navigation className="w-4 h-4" />}>
                <TrajectoryReplayer
                  localization={result.localization}
                  onStepChange={(stepIdx) => setActiveStepIndex(stepIdx)}
                />
              </GlassCard>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GlassCard>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Layers className="w-3.5 h-3.5 text-blue-500" /> RL WINDOW STEPS
                </div>
                <div className="mt-2 text-xl font-mono font-bold text-slate-900 dark:text-white">
                  {result.localization?.steps ?? 0} Steps
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Target className="w-3.5 h-3.5 text-cyan-500" /> BOUNDING BOX
                </div>
                <div className="mt-2 text-xs font-mono font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {parsedBbox.displayText}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Clock className="w-3.5 h-3.5 text-purple-500" /> LOCALIZATION TIME
                </div>
                <div className="mt-2 text-xl font-mono font-bold text-slate-900 dark:text-white">
                  {result.localization?.processing_time
                    ? `${result.localization.processing_time.toFixed(3)}s`
                    : `${(result.processing_time ?? 0).toFixed(3)}s`}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Coordinate Info & Predictions (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <CoordinateInfoPanel
              dimensions={dimensions}
              cursorPosition={cursorPos}
              agentPosition={currentAgentPixel}
              searchWindow={pixelSearchWindow}
              boundingBox={pixelBbox}
              currentStep={effectiveStep}
              totalSteps={totalSteps}
              currentAction={currentAction}
            />

            <PredictionPanel prediction={result} />
          </div>
        </div>
      )}
    </div>
  );
};