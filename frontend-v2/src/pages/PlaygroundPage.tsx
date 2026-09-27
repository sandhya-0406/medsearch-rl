import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { predictMedicalImage, fetchSampleFile } from '../services/api';
import { useSessionStore } from '../stores/useSessionStore';
import {
  PredictResponse,
  parseBBox,
  parseTrajectoryPoint,
  parseSearchWindow,
  getDomainName,
} from '../types/api';
import {
  ImageDimensions,
  PixelPoint,
  toPixelBoundingBox,
  toPixelCoordinates,
} from '../utils/coordinates';
import { GlassCard } from '../components/common/GlassCard';
import { ImageViewer } from '../components/medical/ImageViewer';
import { CoordinateInfoPanel } from '../components/medical/CoordinateInfoPanel';
import {
  FlaskConical,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Brain,
  Target,
  Clock,
  Zap,
  Activity,
  ShieldCheck,
  Video,
  Navigation,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ExperimentConfig {
  id: 'mri' | 'esad' | 'mesad';
  name: string;
  domainTitle: string;
  subtitle: string;
  description: string;
  badge: string;
  samplePath: string;
  fileName: string;
  expertName: string;
  icon: typeof Brain;
}

const PRECONFIGURED_EXPERIMENTS: ExperimentConfig[] = [
  {
    id: 'mri',
    name: 'Brain MRI Sample',
    domainTitle: 'Brain MRI',
    subtitle: 'Brain tumor visual search',
    description: 'Axial T1-weighted contrast MRI with intracranial tumor localization (Glioma / Meningioma).',
    badge: 'MRI',
    samplePath: '/samples/mri/mri_16.jpg',
    fileName: 'mri_16.jpg',
    expertName: 'MRI-RL Agent v2',
    icon: Brain,
  },
  {
    id: 'esad',
    name: 'ESAD Endoscopy Sample',
    domainTitle: 'ESAD Surgical',
    subtitle: 'Endoscopic surgical action search',
    description: 'Endoscopic surgical scene with automated instrument bounding and surgical action detection.',
    badge: 'ESAD',
    samplePath: '/samples/esad/RARP4_frame_20878.jpg',
    fileName: 'RARP4_frame_20878.jpg',
    expertName: 'ESAD-RL Agent v2',
    icon: Activity,
  },
  {
    id: 'mesad',
    name: 'MESAD Multi-Site Sample',
    domainTitle: 'MESAD Surgical',
    subtitle: 'Multi-site surgical action analysis',
    description: 'Multi-site laparoscopic procedure sample with complex organ anatomy and visual search.',
    badge: 'MESAD',
    samplePath: '/samples/mesad/real1_frame_503.jpg',
    fileName: 'real1_frame_503.jpg',
    expertName: 'MESAD-RL Agent v2',
    icon: Video,
  },
];

type ExperimentState =
  | 'IDLE'
  | 'INITIALIZING'
  | 'SEARCHING'
  | 'LOCALIZING'
  | 'CLASSIFYING'
  | 'COMPLETED'
  | 'ERROR';

export const PlaygroundPage: React.FC = () => {
  const { setAnalysisResult } = useSessionStore();

  const [activeExperiment, setActiveExperiment] = useState<ExperimentConfig | null>(null);
  const [experimentState, setExperimentState] = useState<ExperimentState>('IDLE');
  const [samplePreviewUrl, setSamplePreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Replay State
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [replaySpeed, setReplaySpeed] = useState<number>(1); // 0.5x, 1x, 2x, 4x

  // Coordinate tracking state
  const [dimensions, setDimensions] = useState<ImageDimensions>({ naturalWidth: 512, naturalHeight: 512 });
  const [cursorPos, setCursorPos] = useState<PixelPoint | null>(null);

  const actionListRef = useRef<HTMLDivElement>(null);

  // Pipeline stage visual progression
  useEffect(() => {
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;
    let t3: NodeJS.Timeout;

    if (experimentState === 'INITIALIZING') {
      t1 = setTimeout(() => setExperimentState('SEARCHING'), 400);
      t2 = setTimeout(() => setExperimentState('LOCALIZING'), 900);
      t3 = setTimeout(() => setExperimentState('CLASSIFYING'), 1400);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [experimentState]);

  const predictMutation = useMutation({
    mutationFn: async (experiment: ExperimentConfig) => {
      setErrorMessage(null);
      setExperimentState('INITIALIZING');
      setSamplePreviewUrl(experiment.samplePath);

      const file = await fetchSampleFile(experiment.samplePath, experiment.fileName);
      return await predictMedicalImage(file);
    },
    onSuccess: (data: PredictResponse) => {
      if (!data || data.success === false) {
        setErrorMessage('Backend returned unsuccessful prediction status for this sample.');
        setExperimentState('ERROR');
        return;
      }

      setExperimentState('COMPLETED');
      const steps = data.localization?.steps || data.localization?.actions?.length || 0;
      setCurrentStep(steps > 0 ? steps - 1 : 0);
      setAnalysisResult(data);
    },
    onError: (error: Error) => {
      setExperimentState('ERROR');
      setErrorMessage(error.message || 'Failed to execute sample prediction via /api/v1/predict.');
    },
  });

  const activeResult = predictMutation.data;

  // Trajectory Replay Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const totalSteps =
      activeResult?.localization?.steps ||
      activeResult?.localization?.actions?.length ||
      0;

    if (isPlaying && totalSteps > 0) {
      const intervalMs = Math.max(40, 350 / replaySpeed);
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    }

    return () => clearInterval(timer);
  }, [isPlaying, replaySpeed, activeResult]);

  // Auto-scroll the active action step in the timeline
  useEffect(() => {
    if (actionListRef.current) {
      const activeEl = actionListRef.current.querySelector(`[data-step="${currentStep}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentStep]);

  const handleRunExperiment = (experiment: ExperimentConfig) => {
    setActiveExperiment(experiment);
    predictMutation.mutate(experiment);
  };

  const handleStopOrReset = () => {
    setIsPlaying(false);
    setActiveExperiment(null);
    setSamplePreviewUrl(null);
    setExperimentState('IDLE');
    setErrorMessage(null);
    setCurrentStep(0);
  };

  const handlePlayToggle = () => {
    const totalSteps =
      activeResult?.localization?.steps ||
      activeResult?.localization?.actions?.length ||
      0;
    if (totalSteps === 0) return;

    if (!isPlaying) {
      if (currentStep >= totalSteps - 1) {
        setCurrentStep(0);
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  // Trajectory & Coordinates Calculation
  const actionsList = activeResult?.localization?.actions || [];
  const totalSteps = activeResult?.localization?.steps || actionsList.length || 0;
  const currentAction = actionsList[currentStep] || (experimentState === 'COMPLETED' ? 'Target Localized' : 'Awaiting RL Policy');

  const rawTrajectory = activeResult?.localization?.trajectory || [];
  const trajectoryPoints = rawTrajectory.map(parseTrajectoryPoint);
  const currentRawPoint = trajectoryPoints[currentStep] || null;
  const currentAgentPixel = currentRawPoint ? toPixelCoordinates(currentRawPoint, dimensions) : null;

  const windows = activeResult?.localization?.windows || [];
  const activeRawWindow = windows[currentStep] || windows[windows.length - 1];
  const pixelSearchWindow = activeRawWindow ? toPixelBoundingBox(activeRawWindow, dimensions) : null;

  const pixelBbox = activeResult?.localization?.bbox
    ? toPixelBoundingBox(activeResult.localization.bbox, dimensions)
    : null;

  const domainName = getDomainName(activeResult?.domain) || activeExperiment?.domainTitle || 'N/A';
  const confidencePct = Math.round(
    (activeResult?.classification?.confidence ?? 0) <= 1
      ? (activeResult?.classification?.confidence ?? 0) * 100
      : activeResult?.classification?.confidence ?? 0
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold tracking-wider uppercase">
              Spatial RL Visual Search
            </span>
            <span className="text-xs font-mono text-slate-500">EXPLAINABLE AGENT COORDINATES</span>
          </div>
          <h2 className="text-2xl font-poppins font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-cyan-400" /> Research Playground
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Test pre-configured medical domain samples and inspect live agent trajectories in pixel coordinate space.
          </p>
        </div>

        {activeExperiment && (
          <button
            onClick={handleStopOrReset}
            disabled={predictMutation.isPending}
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium transition flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Choose Another Sample
          </button>
        )}
      </div>

      {/* Pre-configured Sample Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PRECONFIGURED_EXPERIMENTS.map((exp) => {
          const isSelected = activeExperiment?.id === exp.id;
          const isRunning = isSelected && predictMutation.isPending;
          const Icon = exp.icon;

          return (
            <div
              key={exp.id}
              className={`relative rounded-xl border transition-all duration-200 p-4 flex flex-col justify-between overflow-hidden backdrop-blur-md ${
                isSelected
                  ? 'bg-slate-900/90 border-cyan-500 ring-1 ring-cyan-500/50 shadow-xl shadow-cyan-950/40'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-500 text-slate-950 text-[10px] font-mono font-bold uppercase rounded-bl-lg tracking-wider flex items-center gap-1 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                  ACTIVE EXPERIMENT
                </div>
              )}

              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-cyan-950/60 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-cyan-800/50">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-sm text-slate-900 dark:text-slate-100">
                      {exp.name}
                    </h3>
                    <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                      {exp.subtitle}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {exp.description}
                </p>

                <div className="relative h-28 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center mb-3">
                  <img
                    src={exp.samplePath}
                    alt={exp.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2364748b" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-2">
                    <span className="text-[10px] font-mono text-slate-300 flex items-center gap-1">
                      <Target className="w-3 h-3 text-cyan-400" /> {exp.expertName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {exp.fileName}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRunExperiment(exp)}
                disabled={predictMutation.isPending}
                className={`w-full py-2.5 rounded-lg text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition ${
                  isRunning
                    ? 'bg-cyan-600 text-white cursor-wait'
                    : isSelected && experimentState === 'COMPLETED'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-950 text-white'
                } disabled:opacity-50`}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Executing Policy...
                  </>
                ) : isSelected && experimentState === 'COMPLETED' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Re-run {exp.badge} Search
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Run {exp.badge} Visual Search
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* RL Trajectory & Coordinate Workspace */}
      {samplePreviewUrl && activeResult && experimentState === 'COMPLETED' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" /> RL Agent Replay
              </span>
              <span className="text-slate-400">
                Origin: <strong className="text-white">(0,0) Top-Left</strong> &bull; Dimensions:{' '}
                <strong className="text-cyan-400">{dimensions.naturalWidth}×{dimensions.naturalHeight} px</strong>
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Trajectory generated by domain expert (<span className="text-cyan-400">{activeExperiment?.expertName}</span>)
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Medical Image Viewer with Coordinates (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <GlassCard
                title={`Spatial Search Trajectory — ${activeExperiment?.name}`}
                headerIcon={<Navigation className="w-4 h-4 text-cyan-400" />}
              >
                <ImageViewer
                  imageUrl={samplePreviewUrl}
                  localization={activeResult.localization}
                  currentStepIndex={currentStep}
                  initialCoordinatesEnabled={true}
                  onCoordinatesChange={(data) => {
                    setDimensions(data.dimensions);
                    setCursorPos(data.cursor);
                  }}
                />
              </GlassCard>

              {/* Replay Controls & Timeline Scrubber */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3 font-mono">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentStep(0);
                      }}
                      disabled={totalSteps === 0}
                      className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-40"
                      title="Reset to Step 0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handlePlayToggle}
                      disabled={totalSteps === 0}
                      className="px-4 py-2 rounded-lg bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:opacity-95 transition disabled:opacity-40"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {isPlaying ? 'Pause' : 'Replay Search'}
                    </button>
                  </div>

                  {/* Replay Speeds */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="text-slate-400 px-1 text-[10px] flex items-center gap-0.5">
                      <FastForward className="w-3 h-3" /> SPEED:
                    </span>
                    {[0.5, 1, 2, 4].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setReplaySpeed(spd)}
                        className={`px-2 py-0.5 rounded text-[11px] transition ${
                          replaySpeed === spd
                            ? 'bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-bold'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    STEP <span className="text-cyan-400">{totalSteps > 0 ? currentStep + 1 : 0}</span> / {totalSteps}
                  </div>
                </div>

                {/* Timeline Scrubber */}
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, totalSteps - 1)}
                  value={currentStep}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setCurrentStep(Number(e.target.value));
                  }}
                  disabled={totalSteps === 0}
                  className="w-full accent-blue-600 dark:accent-cyan-400 cursor-pointer disabled:opacity-50"
                />

                {/* Live Step Action & Position */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">ACTIVE ACTION:</span>
                    <span className="text-cyan-400 font-bold">{currentAction}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">AGENT PIXEL COORD:</span>
                    <span className="text-slate-200 font-bold">
                      {currentAgentPixel ? `(${currentAgentPixel.x}, ${currentAgentPixel.y})` : 'Origin Center'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Coordinate Info Panel & RL Timeline (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Comprehensive Coordinate Info Panel */}
              <CoordinateInfoPanel
                dimensions={dimensions}
                cursorPosition={cursorPos}
                agentPosition={currentAgentPixel}
                searchWindow={pixelSearchWindow}
                boundingBox={pixelBbox}
                currentStep={currentStep}
                totalSteps={totalSteps}
                currentAction={currentAction}
              />

              {/* Sequential Action History Timeline */}
              <GlassCard
                title="RL Decision Sequence Timeline"
                headerIcon={<Layers className="w-4 h-4 text-purple-400" />}
              >
                <div
                  ref={actionListRef}
                  className="max-h-48 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs"
                >
                  {actionsList.map((act, idx) => {
                    const isSelected = idx === currentStep;
                    const isPast = idx < currentStep;

                    return (
                      <div
                        key={idx}
                        data-step={idx}
                        onClick={() => {
                          setIsPlaying(false);
                          setCurrentStep(idx);
                        }}
                        className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-500/80 text-cyan-300 ring-1 ring-cyan-500/50'
                            : isPast
                            ? 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
                            : 'bg-slate-900/30 border-slate-800/50 text-slate-500 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] ${
                              isSelected
                                ? 'bg-cyan-500 text-slate-950'
                                : isPast
                                ? 'bg-purple-900/60 text-purple-300'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-[11px] text-slate-200">
                            {act}
                          </span>
                        </div>

                        <ChevronRight
                          className={`w-3.5 h-3.5 ${
                            isSelected ? 'text-cyan-400' : 'text-slate-600'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Classification Verdict */}
              <GlassCard
                title="Search Verdict & Efficiency"
                headerIcon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
              >
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      DIAGNOSIS
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                      {confidencePct}% CONFIDENCE
                    </span>
                  </div>

                  <div className="text-base font-poppins font-bold text-slate-900 dark:text-white">
                    {activeResult.classification?.class_name || 'Classifying...'}
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Search Converged
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Target localized across {totalSteps} visual steps in {activeResult.processing_time?.toFixed(3)}s.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};