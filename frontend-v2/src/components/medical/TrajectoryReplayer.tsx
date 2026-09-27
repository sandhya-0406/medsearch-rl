import React, { useState, useEffect } from 'react';
import { LocalizationResult } from '../../types/api';
import { Play, Pause, RotateCcw, FastForward, Navigation, Activity } from 'lucide-react';

interface TrajectoryReplayerProps {
  localization: LocalizationResult;
  onStepChange?: (stepIndex: number) => void;
}

export const TrajectoryReplayer: React.FC<TrajectoryReplayerProps> = ({
  localization,
  onStepChange,
}) => {
  const actions = localization?.actions || [];
  const stepsCount = localization?.steps || actions.length || 0;

  const [currentStep, setCurrentStep] = useState<number>(stepsCount > 0 ? stepsCount - 1 : 0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  // Base tick is 300ms
  const currentIntervalMs = Math.max(50, Math.round(300 / speedMultiplier));

  useEffect(() => {
    if (stepsCount > 0) {
      setCurrentStep(stepsCount - 1);
    }
  }, [stepsCount]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && stepsCount > 0) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= stepsCount - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          if (onStepChange) onStepChange(next);
          return next;
        });
      }, currentIntervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, stepsCount, currentIntervalMs, onStepChange]);

  const handlePlayToggle = () => {
    if (stepsCount === 0) return;

    if (!isPlaying) {
      if (currentStep >= stepsCount - 1) {
        setCurrentStep(0);
        if (onStepChange) onStepChange(0);
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleStepSelect = (idx: number) => {
    const targetStep = Math.max(0, Math.min(idx, stepsCount - 1));
    setCurrentStep(targetStep);
    if (onStepChange) onStepChange(targetStep);
  };

  const speedOptions = [0.5, 1, 2, 4];

  const currentAction = actions[currentStep] || 'Terminal / Final State';

  return (
    <div className="space-y-4 bg-slate-100 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
      {/* Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayToggle}
            disabled={stepsCount === 0}
            className="px-3 py-2 rounded-lg bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 hover:opacity-90 font-medium text-xs flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Replay Trajectory'}
          </button>
          <button
            onClick={() => handleStepSelect(0)}
            disabled={stepsCount === 0}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs disabled:opacity-50"
            title="Reset to Step 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator & Speed Multiplier Selector */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
            Step <span className="font-bold text-blue-600 dark:text-cyan-400">{stepsCount > 0 ? currentStep + 1 : 0}</span> / {stepsCount}
          </div>

          <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
            {speedOptions.map((spd) => (
              <button
                key={spd}
                onClick={() => setSpeedMultiplier(spd)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                  speedMultiplier === spd
                    ? 'bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Slider */}
      <input
        type="range"
        min={0}
        max={Math.max(0, stepsCount - 1)}
        value={currentStep}
        onChange={(e) => handleStepSelect(Number(e.target.value))}
        disabled={stepsCount === 0}
        className="w-full accent-blue-600 dark:accent-cyan-400 cursor-pointer disabled:opacity-50"
      />

      {/* Current Step Telemetry Badge */}
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs">
        <div className="flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-slate-500 dark:text-slate-400">Current Action:</span>
          <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">
            {currentAction}
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>Step {currentStep + 1} of {stepsCount}</span>
        </div>
      </div>

      {/* Action Sequence Badges */}
      {actions.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
          {actions.map((act, idx) => (
            <button
              key={idx}
              onClick={() => handleStepSelect(idx)}
              className={`px-2 py-1 rounded border whitespace-nowrap transition-colors ${
                idx === currentStep
                  ? 'bg-blue-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-semibold border-transparent'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              {idx + 1}. {act}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};