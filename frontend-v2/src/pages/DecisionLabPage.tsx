import React from 'react';
import { useSessionStore } from '../stores/useSessionStore';
import { GlassCard } from '../components/common/GlassCard';
import { getDomainName } from '../types/api';
import { GitMerge, Layers, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DecisionLabPage: React.FC = () => {
  const { currentAnalysis } = useSessionStore();
  const navigate = useNavigate();

  const activeResult = currentAnalysis.result;

  if (!activeResult) {
    return (
      <GlassCard className="text-center py-16 max-w-2xl mx-auto my-12">
        <div className="flex flex-col items-center space-y-3">
          <GitMerge className="w-12 h-12 text-slate-400" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No Active Inference Session
          </h3>
          <p className="text-xs text-slate-500 max-w-md">
            Please run an image analysis first in the Analyze Image workspace to inspect the RL decision-making pipeline.
          </p>
          <button
            onClick={() => navigate('/analyze')}
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
          >
            Go to Analyze Image
          </button>
        </div>
      </GlassCard>
    );
  }

  const domainName = getDomainName(activeResult.domain);
  const actionsList = activeResult.localization?.actions || [];
  const totalSteps = activeResult.localization?.steps ?? actionsList.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-poppins font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          <GitMerge className="w-6 h-6 text-purple-500" /> Decision Lab & Explainability
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Deconstruct the RL agent trajectory, action rationale, and confidence progression.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <GlassCard title="Action & Reward Sequence" headerIcon={<Clock className="w-4 h-4 text-cyan-500" />}>
            <div className="space-y-3">
              {actionsList.map((act, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        Action: <span className="font-mono text-cyan-500">{act}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">Window refinement step {idx + 1}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div>
          <GlassCard title="Active Session Meta" headerIcon={<Layers className="w-4 h-4 text-blue-500" />}>
            <div className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-slate-400">Image File:</span>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {currentAnalysis.file?.name || 'Medical Scan'}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Detected Domain:</span>
                <div className="font-bold text-cyan-400">{domainName}</div>
              </div>
              <div>
                <span className="text-slate-400">Total Steps:</span>
                <div className="font-bold text-slate-800 dark:text-slate-200">{totalSteps}</div>
              </div>
              <div>
                <span className="text-slate-400">Classification:</span>
                <div className="font-bold text-emerald-400">
                  {activeResult.classification?.class_name || 'N/A'}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};