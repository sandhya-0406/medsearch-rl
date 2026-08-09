import React, { useState, useEffect } from 'react';
import { LocalizationResult } from '../../types/api';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

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
  const [speed, setSpeed] = useState<number>(300);

  // Synchronize initial currentStep if stepsCount changes
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
      }, speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, stepsCount, speed, onStepChange]);

  const handlePlayToggle = () => {
    if (stepsCount === 0) return;

    if (!isPlaying) {
      // If currently at or beyond the final step, reset to step 0 before playing
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

  return (
    <div className="space-y-3 bg-slate-100 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayToggle}
            disabled={stepsCount === 0}
            className="p-2 rounded-lg bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 hover:opacity-90 font-medium text-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Replay Search'}
          </button>
          <button
            onClick={() => handleStepSelect(0)}
            disabled={stepsCount === 0}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs disabled:opacity-50"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-600 dark:text-slate-400">
          <span>
            Step {stepsCount > 0 ? currentStep + 1 : 0} of {stepsCount}
          </span>
          <button
            onClick={() => setSpeed(speed === 300 ? 150 : 300)}
            className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-[10px] flex items-center gap-1"
          >
            <FastForward className="w-3 h-3" /> {speed === 300 ? '1x' : '2x'}
          </button>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={Math.max(0, stepsCount - 1)}
        value={currentStep}
        onChange={(e) => handleStepSelect(Number(e.target.value))}
        disabled={stepsCount === 0}
        className="w-full accent-blue-600 dark:accent-cyan-400 cursor-pointer disabled:opacity-50"
      />

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