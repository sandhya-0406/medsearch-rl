import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBackendStatus } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Activity, Scan, Target, Brain, ArrowRight, Cpu, Layers } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: status } = useQuery({ queryKey: ['backendStatus'], queryFn: getBackendStatus });

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-mono font-medium backdrop-blur-md">
            EXPLAINABLE AI MEDICAL WORKSTATION
          </span>
          <h1 className="text-3xl md:text-4xl font-poppins font-bold">
            MedSearch-RL Workstation V2
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed font-inter">
            Reinforcement Learning visual search and explainable localization pipeline for Brain MRI and Surgical Endoscopy (ESAD / MESAD).
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => navigate('/analyze')}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm shadow-md transition flex items-center gap-2"
            >
              <Scan className="w-4 h-4" /> Launch Image Analysis
            </button>
            <button
              onClick={() => navigate('/playground')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition"
            >
              Explore Playground
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">BACKEND STATUS</span>
            <StatusBadge status={status?.status === 'offline' ? 'offline' : 'online'} />
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-slate-900 dark:text-white">
            {status?.status === 'offline' ? 'Disconnected' : 'Active'}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">SUPPORTED DOMAINS</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-slate-900 dark:text-white">
            3 <span className="text-xs font-sans text-slate-500">(MRI, ESAD, MESAD)</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">PIPELINE SPEED</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-slate-900 dark:text-white">
            ~0.8s <span className="text-xs font-sans text-slate-500">avg inference</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">COMPUTATIONAL DEVICE</span>
            <Cpu className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-xl font-mono font-bold text-slate-900 dark:text-white">
            {status?.gpu_available ? 'CUDA GPU' : 'CPU / PyTorch'}
          </div>
        </GlassCard>
      </div>

      {/* System Pipeline Visualization */}
      <GlassCard title="MedSearch-RL Architecture Pipeline" headerIcon={<Brain className="w-5 h-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 py-4 text-center">
          {[
            { step: '01', title: 'Upload Image', desc: 'Medical Input' },
            { step: '02', title: 'Domain Detection', desc: 'MRI / ESAD / MESAD' },
            { step: '03', title: 'Expert Routing', desc: 'Policy Selection' },
            { step: '04', title: 'RL Visual Search', desc: 'Sequential Bounding' },
            { step: '05', title: 'Localization', desc: 'Region of Interest' },
            { step: '06', title: 'Classification', desc: 'Final Diagnosis' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 relative group"
            >
              <div className="text-[10px] font-mono text-blue-600 dark:text-cyan-400 font-bold mb-1">
                STEP {item.step}
              </div>
              <div className="font-poppins font-semibold text-xs text-slate-800 dark:text-slate-200">
                {item.title}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
              {idx < 5 && (
                <ArrowRight className="hidden md:block w-4 h-4 text-slate-400 absolute -right-3 top-1/2 -translate-y-1/2 z-10" />
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};