import React, { useState, useRef, useEffect } from 'react';
import {
  LocalizationResult,
  parseBBox,
  parseSearchWindow,
  parseTrajectoryPoint,
} from '../../types/api';
import {
  displayToImageCoordinates,
  toPixelCoordinates,
  ImageDimensions,
  PixelPoint,
} from '../../utils/coordinates';
import { CoordinateGrid } from './CoordinateGrid';
import { Eye, EyeOff, Navigation, Target, Grid, Hash } from 'lucide-react';

interface ImageViewerProps {
  imageUrl: string;
  localization?: LocalizationResult;
  currentStepIndex?: number;
  initialCoordinatesEnabled?: boolean;
  onCoordinatesChange?: (data: {
    dimensions: ImageDimensions;
    cursor: PixelPoint | null;
    agent: PixelPoint | null;
  }) => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  imageUrl,
  localization,
  currentStepIndex,
  initialCoordinatesEnabled = false,
  onCoordinatesChange,
}) => {
  const [showBbox, setShowBbox] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [showWindows, setShowWindows] = useState(true);
  const [showGrid, setShowGrid] = useState(initialCoordinatesEnabled);
  const [showCoordinates, setShowCoordinates] = useState(initialCoordinatesEnabled);

  const [mousePos, setMousePos] = useState<PixelPoint | null>(null);
  const [imgDimensions, setImgDimensions] = useState<ImageDimensions>({ naturalWidth: 512, naturalHeight: 512 });

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = () => {
    if (imgRef.current) {
      const dimensions = {
        naturalWidth: imgRef.current.naturalWidth || 512,
        naturalHeight: imgRef.current.naturalHeight || 512,
      };
      setImgDimensions(dimensions);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showCoordinates) {
      if (mousePos) setMousePos(null);
      return;
    }
    const coords = displayToImageCoordinates(e.clientX, e.clientY, imgRef.current);
    setMousePos(coords);
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  // Trajectory calculations
  const rawTrajectory = localization?.trajectory || [];
  const trajectoryPoints = rawTrajectory.map(parseTrajectoryPoint);
  const effectiveStep =
    currentStepIndex !== undefined
      ? Math.min(currentStepIndex, Math.max(0, trajectoryPoints.length - 1))
      : Math.max(0, trajectoryPoints.length - 1);

  const visibleTrajectory =
    trajectoryPoints.length > 0 ? trajectoryPoints.slice(0, effectiveStep + 1) : [];

  const currentRawPoint = visibleTrajectory[visibleTrajectory.length - 1] || null;
  const currentPixelAgent = currentRawPoint ? toPixelCoordinates(currentRawPoint, imgDimensions) : null;

  useEffect(() => {
    if (onCoordinatesChange) {
      onCoordinatesChange({
        dimensions: imgDimensions,
        cursor: mousePos,
        agent: currentPixelAgent,
      });
    }
  }, [imgDimensions, mousePos, currentPixelAgent, onCoordinatesChange]);

  // Window coordinates normalization
  const windows = localization?.windows || [];
  const activeRawWindow =
    currentStepIndex !== undefined && windows[currentStepIndex]
      ? windows[currentStepIndex]
      : windows[windows.length - 1];
  const parsedWindow = parseSearchWindow(activeRawWindow);

  const getNormalizedWindowStyle = () => {
    if (!parsedWindow) return { left: '0%', top: '0%', width: '0%', height: '0%' };

    let x1 = parsedWindow.x1;
    let y1 = parsedWindow.y1;
    let x2 = parsedWindow.x2 || x1 + 0.2;
    let y2 = parsedWindow.y2 || y1 + 0.2;

    const { naturalWidth, naturalHeight } = imgDimensions;

    if (x1 > 1.0 || y1 > 1.0 || x2 > 1.0 || y2 > 1.0) {
      x1 = x1 / naturalWidth;
      y1 = y1 / naturalHeight;
      x2 = x2 / naturalWidth;
      y2 = y2 / naturalHeight;
    }

    const clampedX1 = Math.max(0, Math.min(1, x1));
    const clampedY1 = Math.max(0, Math.min(1, y1));
    const clampedX2 = Math.max(clampedX1, Math.min(1, x2));
    const clampedY2 = Math.max(clampedY1, Math.min(1, y2));

    return {
      left: `${clampedX1 * 100}%`,
      top: `${clampedY1 * 100}%`,
      width: `${(clampedX2 - clampedX1) * 100}%`,
      height: `${(clampedY2 - clampedY1) * 100}%`,
    };
  };

  const parsedBbox = parseBBox(localization?.bbox);
  const bboxStyle = parsedBbox.isNormalized
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

  const normalizePoint = (point: { x: number; y: number }) => {
    const { naturalWidth, naturalHeight } = imgDimensions;
    let normX = point.x <= 1.0 ? point.x * 100 : (point.x / naturalWidth) * 100;
    let normY = point.y <= 1.0 ? point.y * 100 : (point.y / naturalHeight) * 100;
    return { x: Math.max(0, Math.min(100, normX)), y: Math.max(0, Math.min(100, normY)) };
  };

  const normalizedVisiblePoints = visibleTrajectory.map(normalizePoint);
  const currentNormalizedPoint =
    normalizedVisiblePoints.length > 0
      ? normalizedVisiblePoints[normalizedVisiblePoints.length - 1]
      : null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex flex-col items-center justify-center min-h-[380px] select-none"
    >
      {/* Visual Toggles Toolbar */}
      <div className="absolute top-3 right-3 z-20 flex flex-wrap items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-lg border border-slate-700/60 text-xs text-white">
        <button
          onClick={() => setShowCoordinates(!showCoordinates)}
          className={`px-2 py-1 rounded flex items-center gap-1 transition ${
            showCoordinates ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Cursor Coordinates"
        >
          <Hash className="w-3.5 h-3.5" /> Coordinates
        </button>

        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`px-2 py-1 rounded flex items-center gap-1 transition ${
            showGrid ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Coordinate Grid"
        >
          <Grid className="w-3.5 h-3.5" /> Grid
        </button>

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
            showTrajectory ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Trajectory Path"
        >
          <Navigation className="w-3.5 h-3.5" /> Trajectory
        </button>

        <button
          onClick={() => setShowWindows(!showWindows)}
          className={`px-2 py-1 rounded flex items-center gap-1 transition ${
            showWindows ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Search Window"
        >
          {showWindows ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />} Window
        </button>
      </div>

      {/* Dimension Tag */}
      <div className="absolute top-3 left-3 z-20 px-2 py-0.5 rounded bg-slate-900/85 backdrop-blur-md border border-slate-700/60 font-mono text-[9px] text-cyan-400 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        {imgDimensions.naturalWidth} × {imgDimensions.naturalHeight} px
      </div>

      {/* Main Visualizer Canvas */}
      <div className="relative max-w-full max-h-[500px]">
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Medical scan"
          onLoad={handleImageLoad}
          className="max-h-[500px] w-auto object-contain block pointer-events-none"
        />

        {/* Spatial Coordinate Grid */}
        {showGrid && <CoordinateGrid dimensions={imgDimensions} />}

        {/* Overlays Container */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Active Search Window */}
          {showWindows && activeRawWindow && (
            <div
              className="absolute border border-cyan-400 bg-cyan-400/15 border-dashed transition-all duration-150"
              style={getNormalizedWindowStyle()}
            >
              <div className="absolute -top-3.5 left-0 px-1 py-0.2 rounded bg-cyan-600 text-slate-950 text-[8px] font-mono font-bold leading-tight">
                W{effectiveStep + 1}
              </div>
            </div>
          )}

          {/* Final Predicted BBox */}
          {showBbox && localization?.bbox && (
            <div
              className="absolute border border-blue-500 bg-blue-500/20 rounded-sm shadow-sm"
              style={bboxStyle}
            >
              <div className="absolute -top-3.5 right-0 px-1 py-0.2 rounded bg-blue-600 text-white text-[8px] font-mono font-bold leading-tight">
                ROI
              </div>
            </div>
          )}
        </div>

        {/* SVG Trajectory Path & Compact Agent Coordinate Marker */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {showTrajectory && normalizedVisiblePoints.length > 1 && (
            <polyline
              points={normalizedVisiblePoints.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {showTrajectory &&
            normalizedVisiblePoints.map((p, idx) => {
              const isCurrent = idx === normalizedVisiblePoints.length - 1;
              return (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r={isCurrent ? '1.8' : '1'}
                  fill={isCurrent ? '#06B6D4' : '#8B5CF6'}
                  className={isCurrent ? 'animate-pulse' : ''}
                />
              );
            })}

          {/* Scaled-down subtle Agent Coordinate Tag */}
          {showTrajectory && currentNormalizedPoint && currentPixelAgent && (
            <g transform={`translate(${currentNormalizedPoint.x}, ${currentNormalizedPoint.y})`}>
              <circle r="2.5" fill="none" stroke="#06B6D4" strokeWidth="0.4" strokeDasharray="1,1" />
              <rect
                x="2.5"
                y="-4.5"
                width="19"
                height="4.2"
                rx="0.8"
                fill="rgba(15, 23, 42, 0.9)"
                stroke="#06B6D4"
                strokeWidth="0.3"
              />
              <text x="3.5" y="-1.5" fill="#38BDF8" fontSize="2.4" fontFamily="monospace" fontWeight="bold">
                {currentPixelAgent.x},{currentPixelAgent.y}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Floating Mouse Cursor Tooltip */}
      {showCoordinates && mousePos && (
        <div className="absolute bottom-3 left-3 z-30 px-2 py-1 rounded-md bg-slate-900/90 border border-cyan-500/40 backdrop-blur-md font-mono text-[10px] text-cyan-300 shadow-lg flex items-center gap-1.5 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>X: <strong className="text-white">{mousePos.x}</strong></span>
          <span className="text-slate-600">|</span>
          <span>Y: <strong className="text-white">{mousePos.y}</strong></span>
        </div>
      )}
    </div>
  );
};