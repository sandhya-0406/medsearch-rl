import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { useSessionStore } from '../stores/useSessionStore';
import { Settings, Stethoscope, Bot } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { workspaceTheme, setWorkspaceTheme } = useSessionStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-poppins font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-500" /> Workstation Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure interface theme, API environment endpoints, and visualization parameters.
        </p>
      </div>

      <GlassCard title="Workspace Preference">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => setWorkspaceTheme('medical')}
            className={`p-4 rounded-xl border flex items-center gap-3 transition ${
              workspaceTheme === 'medical'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Stethoscope className="w-5 h-5 text-blue-600" />
            <div className="text-left text-xs">
              <div>🏥 Medical Workspace</div>
              <div className="text-[11px] font-normal text-slate-500">Bright, clinical, minimal distractions</div>
            </div>
          </button>

          <button
            onClick={() => setWorkspaceTheme('ai')}
            className={`p-4 rounded-xl border flex items-center gap-3 transition ${
              workspaceTheme === 'ai'
                ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 font-bold'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bot className="w-5 h-5 text-cyan-400" />
            <div className="text-left text-xs">
              <div>🤖 AI Workspace</div>
              <div className="text-[11px] font-normal text-slate-500">Dark mode, glassmorphic analytics</div>
            </div>
          </button>
        </div>
      </GlassCard>

      <GlassCard title="Backend Service Configuration">
        <div className="space-y-2 text-xs">
          <label className="text-slate-500 font-mono">API Base URL</label>
          <input
            type="text"
            readOnly
            value={import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'}
            className="w-full p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
          />
        </div>
      </GlassCard>
    </div>
  );
};