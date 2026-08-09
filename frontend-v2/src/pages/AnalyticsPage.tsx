import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore } from '../stores/useSessionStore';
import { getBackendStatus } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import {
  BarChart3,
  Activity,
  Clock,
  Layers,
  Trash2,
  Cpu,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Server,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { sessionHistory, clearHistory } = useSessionStore();

  // Query actual backend status for System Overview
  const { data: statusData } = useQuery({
    queryKey: ['backendStatus'],
    queryFn: getBackendStatus,
    refetchInterval: 10000,
  });

  // Calculate real metrics from persistent localStorage history
  const totalSessions = sessionHistory.length;

  const domainCounts = sessionHistory.reduce((acc, item) => {
    acc[item.domainName] = (acc[item.domainName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgProcessingTime =
    totalSessions > 0
      ? (
          sessionHistory.reduce((acc, item) => acc + item.totalProcessingTime, 0) / totalSessions
        ).toFixed(3)
      : '0.000';

  const avgSteps =
    totalSessions > 0
      ? Math.round(
          sessionHistory.reduce((acc, item) => acc + item.localizationSteps, 0) / totalSessions
        )
      : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-poppins font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <BarChart3 className="w-6 h-6 text-blue-500" /> Research Analytics & System Metrics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Workstation system overview, verified model evaluation status, real inference history, and training telemetry.
          </p>
        </div>

        {totalSessions > 0 && (
          <button
            onClick={clearHistory}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Inference History
          </button>
        )}
      </div>

      {/* SECTION 1: Model / System Overview */}
      <div className="space-y-3">
        <h3 className="text-sm font-poppins font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-500" /> 1. Model & System Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>SERVICE STATUS</span>
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="mt-2 text-lg font-mono font-bold text-slate-900 dark:text-white">
              {statusData?.status === 'offline' ? 'Offline' : 'Active (Online)'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">REST API /api/v1</div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>EXECUTION DEVICE</span>
              <Cpu className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="mt-2 text-lg font-mono font-bold text-slate-900 dark:text-white">
              {statusData?.gpu_available ? 'CUDA GPU' : 'PyTorch CPU'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Device: {statusData?.active_device || 'Auto-detect'}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>EXPERT DOMAINS</span>
              <Layers className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <div className="mt-2 text-lg font-mono font-bold text-slate-900 dark:text-white">
              3 Domains
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Brain MRI, ESAD, MESAD</div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>STORED RUNS</span>
              <Clock className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="mt-2 text-lg font-mono font-bold text-slate-900 dark:text-white">
              {totalSessions} Sessions
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Persistent localStorage log</div>
          </GlassCard>
        </div>
      </div>

      {/* SECTION 2: Verified Model Evaluation */}
      <div className="space-y-3">
        <h3 className="text-sm font-poppins font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> 2. Verified Model Evaluation
        </h3>

        <GlassCard>
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500 shrink-0 mt-0.5">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="font-poppins font-semibold text-xs text-slate-800 dark:text-slate-200">
                  Evaluation Metrics Pending Verification
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                  Benchmark evaluation results (IoU distribution, mean IoU per dataset, classification accuracy matrices) are only displayed when verified evaluation output files are connected. No synthetic metrics are fabricated.
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-500 shrink-0">
              STATUS: UNVERIFIED
            </div>
          </div>
        </GlassCard>
      </div>

      {/* SECTION 3: Inference Session History (Persisted) */}
      <div className="space-y-3">
        <h3 className="text-sm font-poppins font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" /> 3. Inference Session History (Calculated)
        </h3>

        {totalSessions === 0 ? (
          <GlassCard className="text-center py-10">
            <div className="flex flex-col items-center justify-center space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400" />
              <div className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                No inference sessions recorded yet
              </div>
              <p className="text-xs text-slate-500 max-w-sm">
                Run an image analysis in the <strong>Analyze Image</strong> workspace to populate real session telemetry from completed /predict runs.
              </p>
            </div>
          </GlassCard>
        ) : (
          <>
            {/* Real Computed Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassCard>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Activity className="w-3.5 h-3.5 text-blue-500" /> TOTAL RUNS
                </div>
                <div className="mt-2 text-2xl font-mono font-bold text-slate-900 dark:text-white">
                  {totalSessions}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Clock className="w-3.5 h-3.5 text-purple-500" /> AVG LATENCY
                </div>
                <div className="mt-2 text-2xl font-mono font-bold text-slate-900 dark:text-white">
                  {avgProcessingTime}s
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Layers className="w-3.5 h-3.5 text-cyan-500" /> AVG RL STEPS
                </div>
                <div className="mt-2 text-2xl font-mono font-bold text-slate-900 dark:text-white">
                  {avgSteps} Steps
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-500" /> DOMAIN BREAKDOWN
                </div>
                <div className="mt-2 text-xs font-mono font-bold text-slate-900 dark:text-white flex flex-wrap gap-1">
                  {Object.entries(domainCounts).map(([dom, count]) => (
                    <span key={dom} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {dom}: {count}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* History Table */}
            <GlassCard title="Persisted Session History Log" headerIcon={<Clock className="w-4 h-4 text-cyan-500" />}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase">
                      <th className="pb-3 pt-1">Time</th>
                      <th className="pb-3 pt-1">File Name</th>
                      <th className="pb-3 pt-1">Domain</th>
                      <th className="pb-3 pt-1">Classification</th>
                      <th className="pb-3 pt-1">Steps</th>
                      <th className="pb-3 pt-1 text-right">Time (s)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {sessionHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="py-2.5 text-slate-400">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200">
                          {item.fileName}
                        </td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-cyan-950 text-blue-700 dark:text-cyan-300 font-bold text-[10px]">
                            {item.domainName}
                          </span>
                        </td>
                        <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-medium">
                          {item.classificationName} ({Math.round(item.classificationConfidence * (item.classificationConfidence <= 1 ? 100 : 1))}%)
                        </td>
                        <td className="py-2.5 text-slate-600 dark:text-slate-300">{item.localizationSteps}</td>
                        <td className="py-2.5 text-right font-bold text-slate-800 dark:text-slate-200">
                          {item.totalProcessingTime.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </>
        )}
      </div>

      {/* SECTION 4: Training Telemetry */}
      <div className="space-y-3">
        <h3 className="text-sm font-poppins font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-500" /> 4. Training Telemetry
        </h3>

        <GlassCard>
          <div className="p-6 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="font-poppins font-semibold text-sm text-slate-800 dark:text-slate-200">
              Training history unavailable
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              Saved RL agent checkpoints store neural network weights, policy parameters, and optimizer states, but do not contain episode-level reward or loss trajectories. Synthetic curves are not generated.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};