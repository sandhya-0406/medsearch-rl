import React from 'react';
import { ImageDimensions } from '../../utils/coordinates';

interface CoordinateGridProps {
  dimensions: ImageDimensions;
}

export const CoordinateGrid: React.FC<CoordinateGridProps> = ({ dimensions }) => {
  const { naturalWidth, naturalHeight } = dimensions;

  const xTicks = [0, 0.25, 0.5, 0.75, 1.0].map((ratio) => ({
    ratio,
    val: Math.round(ratio * naturalWidth),
  }));

  const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map((ratio) => ({
    ratio,
    val: Math.round(ratio * naturalHeight),
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none">
      {/* SVG Grid Overlay */}
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="subtleGrid"
            width="25"
            height="25"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 25 0 L 0 0 0 25"
              fill="none"
              stroke="rgba(6, 182, 212, 0.12)"
              strokeWidth="0.4"
              strokeDasharray="1,1"
            />
          </pattern>
        </defs>

        <rect width="100" height="100" fill="url(#subtleGrid)" />

        {/* Outer Coordinate Axes Border */}
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="none"
          stroke="rgba(6, 182, 212, 0.3)"
          strokeWidth="0.5"
        />

        {/* Axes Cross-hairs */}
        <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="0.4" strokeDasharray="1.5,1.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="0.4" strokeDasharray="1.5,1.5" />
      </svg>

      {/* Top X-Axis Tick Labels */}
      <div className="absolute top-0 left-0 right-0 h-3 flex justify-between px-1 bg-slate-950/60 border-b border-cyan-500/20 text-[8px] font-mono text-cyan-400/90">
        {xTicks.map((tick, i) => (
          <span
            key={i}
            className="transform -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
          >
            {tick.val}
          </span>
        ))}
      </div>

      {/* Left Y-Axis Tick Labels */}
      <div className="absolute top-3 bottom-0 left-0 w-5 flex flex-col justify-between py-0.5 bg-slate-950/60 border-r border-cyan-500/20 text-[8px] font-mono text-cyan-400/90">
        {yTicks.map((tick, i) => (
          <span
            key={i}
            className="transform -translate-y-1/2 first:translate-y-0 last:-translate-y-full text-center"
          >
            {tick.val}
          </span>
        ))}
      </div>

      {/* Origin Badge */}
      <div className="absolute top-0 left-0 px-0.5 py-0 bg-cyan-950/90 border-r border-b border-cyan-500/40 text-[7px] font-mono font-bold text-cyan-300">
        0,0
      </div>
    </div>
  );
};