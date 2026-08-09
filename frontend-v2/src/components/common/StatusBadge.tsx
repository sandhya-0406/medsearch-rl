import React from 'react';

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'running' | 'completed' | 'error';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const styles = {
    online: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    offline: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    running: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 animate-pulse',
    completed: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    error: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  };

  const dots = {
    online: 'bg-emerald-500',
    offline: 'bg-rose-500',
    running: 'bg-cyan-400',
    completed: 'bg-blue-500',
    error: 'bg-amber-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {label || status.toUpperCase()}
    </span>
  );
};