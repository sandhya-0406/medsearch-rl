import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBackendStatus } from '../../services/api';
import { useSessionStore } from '../../stores/useSessionStore';
import { getDomainName } from '../../types/api';
import { StatusBadge } from './StatusBadge';
import { Stethoscope, Bot, Activity, Search, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { workspaceTheme, toggleWorkspaceTheme, currentAnalysis } = useSessionStore();

  const { data: statusData, isError } = useQuery({
    queryKey: ['backendStatus'],
    queryFn: getBackendStatus,
    refetchInterval: 10000,
  });

  const isOnline = !isError && statusData?.status !== 'offline';
  const activeResult = currentAnalysis.result;

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-poppins font-bold text-lg leading-tight text-slate-900 dark:text-white tracking-wide">
              MedSearch<span className="text-blue-600 dark:text-cyan-400">-RL</span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              WORKSTATION V2.0
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center ml-6 pl-6 border-l border-slate-200 dark:border-slate-800">
          <StatusBadge
            status={isOnline ? 'online' : 'offline'}
            label={isOnline ? 'BACKEND ONLINE' : 'DISCONNECTED'}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search sessions or cases..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 transition-all border border-transparent dark:border-slate-700"
          />
        </div>

        {activeResult && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 dark:bg-cyan-950/40 border border-blue-200 dark:border-cyan-800/50 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span className="text-slate-600 dark:text-slate-300">Active:</span>
            <span className="font-mono font-medium text-blue-700 dark:text-cyan-300">
              {getDomainName(activeResult.domain)} ({activeResult.classification?.class_name})
            </span>
          </div>
        )}

        <button
          onClick={toggleWorkspaceTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 shadow-sm
            bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
          title="Switch Workspace View"
        >
          {workspaceTheme === 'medical' ? (
            <>
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span>Medical Mode</span>
            </>
          ) : (
            <>
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI Research Mode</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};