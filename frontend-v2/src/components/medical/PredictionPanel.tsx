import React from 'react';
import { PredictResponse, getDomainName } from '../../types/api';
import { GlassCard } from '../common/GlassCard';
import { Award, Zap, CheckCircle2, ShieldCheck, Tag, Layers } from 'lucide-react';

interface PredictionPanelProps {
  prediction: PredictResponse;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({ prediction }) => {
  const { domain, classification, processing_time } = prediction;

  const domainObj = typeof domain === 'object' && domain !== null ? domain : null;
  const domainName = getDomainName(domain);
  const domainConfidence = domainObj?.confidence;
  const domainScores = domainObj?.scores;

  const rawConfidence = classification?.confidence ?? 0;
  const confidencePct =
    rawConfidence <= 1.0 ? Math.round(rawConfidence * 100) : Math.round(rawConfidence);

  const className = classification?.class_name || 'Unknown Class';
  const top5List = classification?.top_5 || [];

  return (
    <div className="space-y-4">
      {/* Primary Inference Verdict Card */}
      <GlassCard title="Inference Verdict" headerIcon={<ShieldCheck className="w-5 h-5 text-blue-600 dark:text-cyan-400" />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-500" /> Detected Domain
            </span>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-cyan-950 text-blue-700 dark:text-cyan-300 font-mono font-bold text-xs border border-blue-200 dark:border-cyan-800">
                {domainName}
              </span>
              {typeof domainConfidence === 'number' && (
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  ({Math.round(domainConfidence * 100)}%)
                </span>
              )}
            </div>
          </div>

          {/* Domain Category Scores breakdown */}
          {domainScores && Object.keys(domainScores).length > 0 && (
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 space-y-2">
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                <Layers className="w-3 h-3 text-cyan-500" /> Domain Policy Scores
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                {Object.entries(domainScores).map(([key, score]) => (
                  <div key={key} className="p-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-slate-400 text-[10px]">{key}</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {Math.round((score ?? 0) * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Predicted Medical Class</div>
            <div className="text-lg font-poppins font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2">
              <span className="truncate">{className}</span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> {confidencePct}%
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>Classification Confidence</span>
              <span>{confidencePct}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-cyan-400 dark:to-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, confidencePct))}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Processing Time:
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {processing_time ? `${processing_time.toFixed(3)}s` : 'N/A'}
            </span>
          </div>
        </div>
      </GlassCard>

      {top5List.length > 0 && (
        <GlassCard title="Top Candidate Predictions" headerIcon={<Award className="w-4 h-4 text-purple-500" />}>
          <div className="space-y-3">
            {top5List.map((item, idx) => {
              const val = item.confidence ?? 0;
              const pct = val <= 1.0 ? Math.round(val * 100) : Math.round(val);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-inter">
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[180px]">
                      {idx + 1}. {item.class_name}
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 dark:bg-cyan-400 h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </div>
  );
};