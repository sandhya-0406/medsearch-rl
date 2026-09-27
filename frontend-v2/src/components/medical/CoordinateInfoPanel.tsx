import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { ImageDimensions, PixelPoint, PixelBox } from '../../utils/coordinates';
import { Crosshair, MousePointer, Target, Navigation, Maximize2, Layers } from 'lucide-react';

interface CoordinateInfoPanelProps {
  dimensions: ImageDimensions;
  cursorPosition: PixelPoint | null;
  agentPosition: PixelPoint | null;
  searchWindow: PixelBox | null;
  boundingBox: PixelBox | null;
  currentStep?: number;
  totalSteps?: number;
  currentAction?: string;
  className?: string;
}

export const CoordinateInfoPanel: React.FC<CoordinateInfoPanelProps> = ({
  dimensions,
  cursorPosition,
  agentPosition,
  searchWindow,
  boundingBox,
  currentStep,
  totalSteps,
  currentAction,
  className = '',
}) => {
  return (
    <GlassCard
      title="Spatial Coordinates & Geometry"
      headerIcon={<Crosshair className="w-4 h-4 text-cyan-400" />}
      className={className}
    >
      <div className="space-y-3.5 text-xs font-mono">
        {/* Source Image Scale & Cursor Tracking */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70">
          <div>
            <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
              <Maximize2 className="w-3 h-3 text-blue-500" /> Source Dimension
            </span>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">
              {dimensions.naturalWidth} × {dimensions.naturalHeight} px
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
              <MousePointer className="w-3 h-3 text-cyan-500" /> Live Cursor
            </span>
            <div className="font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
              {cursorPosition ? `X: ${cursorPosition.x}, Y: ${cursorPosition.y}` : 'Hovering outside'}
            </div>
          </div>
        </div>

        {/* Current RL Agent Position & Step */}
        <div className="p-2.5 rounded-lg bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-purple-600 dark:text-purple-300 font-bold uppercase flex items-center gap-1">
              <Navigation className="w-3 h-3 text-purple-400" /> RL Agent Position
            </span>
            {totalSteps !== undefined && (
              <span className="text-[10px] text-slate-400 font-bold">
                Step {currentStep !== undefined ? currentStep + 1 : 1}/{totalSteps}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-purple-700 dark:text-purple-200">
              {agentPosition ? `(${agentPosition.x}, ${agentPosition.y})` : 'Origin Center'}
            </span>
            {currentAction && (
              <span className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-[10px]">
                {currentAction}
              </span>
            )}
          </div>
        </div>

        {/* Active Search Window Box */}
        {searchWindow && (
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" /> Active Search Window
            </span>
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>({searchWindow.xmin}, {searchWindow.ymin}) → ({searchWindow.xmax}, {searchWindow.ymax})</span>
              <span className="text-cyan-500 text-[11px]">{searchWindow.width}×{searchWindow.height} px</span>
            </div>
          </div>
        )}

        {/* Final Predicted Bounding Box Coordinates */}
        {boundingBox && (
          <div className="p-2.5 rounded-lg bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-blue-600 dark:text-blue-300 font-bold uppercase flex items-center gap-1">
                <Target className="w-3 h-3 text-blue-400" /> Target ROI Bounding Box
              </span>
              <span className="text-[10px] text-blue-500 font-bold">
                {boundingBox.width} × {boundingBox.height} px
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-white/60 dark:bg-slate-900/60 p-2 rounded border border-blue-200 dark:border-blue-900/50">
              <div>xmin: <span className="font-bold text-slate-800 dark:text-slate-200">{boundingBox.xmin}</span></div>
              <div>ymin: <span className="font-bold text-slate-800 dark:text-slate-200">{boundingBox.ymin}</span></div>
              <div>xmax: <span className="font-bold text-slate-800 dark:text-slate-200">{boundingBox.xmax}</span></div>
              <div>ymax: <span className="font-bold text-slate-800 dark:text-slate-200">{boundingBox.ymax}</span></div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};