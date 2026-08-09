import React, { useState, useRef } from 'react';
import {
  LocalizationResult,
  parseBBox,
  parseSearchWindow,
  parseTrajectoryPoint,
} from '../../types/api';
import { Eye, EyeOff, Navigation, Target } from 'lucide-react';

interface ImageViewerProps {
  imageUrl: string;
  localization?: LocalizationResult;
  currentStepIndex?: number;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  imageUrl,
  localization,
  currentStepIndex,
}) => {
  const [showBbox, setShowBbox] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [showWindows, setShowWindows] = useState(true);

  const imgRef = useRef<HTMLImageElement>(null);

  const parsedBbox = parseBBox(localization?.bbox);
  const windows = localization?.windows || [];
  const rawTrajectory = localization?.trajectory || [];

  // Parse trajectory points ([x, y] or {x, y})
  const trajectoryPoints = rawTrajectory.map(parseTrajectoryPoint);

  // Determine effective step for replay progress
  const effectiveStep =
    currentStepIndex !== undefined
      ? Math.min(currentStepIndex, Math.max(0, trajectoryPoints.length - 1))
      : Math.max(0, trajectoryPoints.length - 1);

  // Progressive trajectory slicing based on current step
  const visibleTrajectory =
    trajectoryPoints.length > 0 ? trajectoryPoints.slice(0, effectiveStep + 1) : [];

  // Get current active window based on currentStepIndex
  const activeRawWindow =
    currentStepIndex !== undefined && windows[currentStepIndex]
      ? windows[currentStepIndex]
      : windows[windows.length - 1];

  const parsedWindow = parseSearchWindow(activeRawWindow);

  // Normalize search window coordinates
  const getNormalizedWindowStyle = () => {
    if (!parsedWindow) return { left: '0%', top: '0%', width: '0%', height: '0%' };

    let x1 = parsedWindow.x1;
    let y1 = parsedWindow.y1;
    let x2 = parsedWindow.x2 || x1 + 0.2;
    let y2 = parsedWindow.y2 || y1 + 0.2;

    const img = imgRef.current;
    const naturalW = img?.naturalWidth || 1;
    const naturalH = img?.naturalHeight || 1;

    // Check if coordinates are in pixel scale (> 1.0)
    if (x1 > 1.0 || y1 > 1.0 || x2 > 1.0 || y2 > 1.0) {
      x1 = x1 / naturalW;
      y1 = y1 / naturalH;
      x2 = x2 / naturalW;
      y2 = y2 / naturalH;
    }

    // Clamp coordinates within [0.0, 1.0] image bounds
    const clampedX1 = Math.max(0, Math.min(1, x1));
    const clampedY1 = Math.max(0, Math.min(1, y1));
    const clampedX2 = Math.max(clampedX1, Math.min(1, x2));
    const clampedY2 = Math.max(clampedY1, Math.min(1, y2));

    const widthPct = (clampedX2 - clampedX1) * 100;
    const heightPct = (clampedY2 - clampedY1) * 100;

    return {
      left: `${clampedX1 * 100}%`,
      top: `${clampedY1 * 100}%`,
      width: `${widthPct}%`,
      height: `${heightPct}%`,
    };
  };

  // Helper to normalize pixel trajectory points into SVG viewBox space (0 - 100)
  const normalizeTrajectoryPoint = (point: { x: number; y: number }) => {
    const img = imgRef.current;
    const naturalW = img?.naturalWidth || 1;
    const naturalH = img?.naturalHeight || 1;

    let normX: number;
    let normY: number;

    if (point.x <= 1.0 && point.y <= 1.0) {
      normX = point.x * 100;
      normY = point.y * 100;
    } else {
      normX = (point.x / naturalW) * 100;
      normY = (point.y / naturalH) * 100;
    }

    return { x: normX, y: normY };
  };

  const isBboxNorm = parsedBbox.isNormalized;
  const bboxStyle = isBboxNorm
    ? {
        left: `${parsedBbox.x * 100}%`,
        top: `${parsedBbox.y * 100}%`,
        width: `${parsedBbox.w * 100}%`,
        height: `${parsedBbox.h * 100}%`,
      }
    : {
        left: `${parsedBbox.x}px`,
        top: `${parsedBbox.y}px`,
        width: `${parsedBbox.w}px`,
        height: `${parsedBbox.h}px`,
      };

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex flex-col items-center justify-center min-h-[380px]">
      {/* Visual Toggles */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-700/60 text-xs text-white">
        <button
          onClick={() => setShowBbox(!showBbox)}
          className={`px-2 py-1 rounded flex items-center gap-1 transition ${
            showBbox ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Bounding Box"
        >
          <Target className="w-3.5 h-3.5" /> BBox
        </button>
        <button
          onClick={() => setShowTrajectory(!showTrajectory)}
          className={`px-2 py-1 rounded flex items-center gap-1 transition ${
            showTrajectory ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Trajectory"
        >
          <Navigation className="w-3.5 h-3.5" /> Path
        </button>
        <button
          onClick={() => setShowWindows(!showWindows)}
          className={`px-2 py-1 rounded flex items-center gap-1 transition ${
            showWindows ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Search Window"
        >
          {showWindows ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />} Window
        </button>
      </div>

      <div className="relative max-w-full max-h-[500px]">
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Medical scan"
          className="max-h-[500px] w-auto object-contain block"
        />

        <div className="absolute inset-0 pointer-events-none">
          {/* Search Window corresponding to currentStepIndex */}
          {showWindows && activeRawWindow && (
            <div
              className="absolute border-2 border-cyan-400 bg-cyan-400/15 border-dashed animate-pulse transition-all duration-150"
              style={getNormalizedWindowStyle()}
            />
          )}

          {/* Final Predicted Bounding Box (Independent of replay step) */}
          {showBbox && localization?.bbox && (
            <div
              className="absolute border-2 border-blue-500 bg-blue-500/20 rounded-sm shadow-sm"
              style={bboxStyle}
            />
          )}
        </div>

        {/* Trajectory Polyline & Step Markers */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {showTrajectory && visibleTrajectory.length > 1 && (
            <polyline
              points={visibleTrajectory
                .map((p) => {
                  const norm = normalizeTrajectoryPoint(p);
                  return `${norm.x},${norm.y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {showTrajectory &&
            visibleTrajectory.map((p, idx) => {
              const isLast = idx === visibleTrajectory.length - 1;
              const norm = normalizeTrajectoryPoint(p);
              return (
                <circle
                  key={idx}
                  cx={norm.x}
                  cy={norm.y}
                  r={isLast ? '2.5' : '1.5'}
                  fill={isLast ? '#06B6D4' : '#8B5CF6'}
                />
              );
            })}
        </svg>
      </div>
    </div>
  );
};