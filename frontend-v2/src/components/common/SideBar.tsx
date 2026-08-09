import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Scan,
  GitMerge,
  BarChart3,
  FlaskConical,
  Settings,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Analyze Image', path: '/analyze', icon: Scan },
    { label: 'Decision Lab', path: '/decision-lab', icon: GitMerge },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Playground', path: '/playground', icon: FlaskConical },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 flex flex-col justify-between shrink-0">
      <nav className="space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Workspaces
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 dark:bg-cyan-500 dark:text-slate-950 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3.5 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 text-xs">
        <div className="font-semibold text-slate-800 dark:text-slate-200 font-poppins">
          MedSearch-RL Core
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-1 leading-snug">
          Reinforcement Learning Visual Search & Classification
        </p>
      </div>
    </aside>
  );
};