import React from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  variant?: 'available' | 'in-use' | 'attention' | 'offline' | 'success' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  className,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    available: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    'in-use': 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    attention: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    offline: 'bg-slate-700/30 text-slate-400 border border-slate-700/50',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    info: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    neutral: 'bg-slate-800 text-slate-300 border border-slate-700',
  };

  const dotColors = {
    available: 'bg-emerald-400 animate-pulse',
    'in-use': 'bg-cyan-400',
    attention: 'bg-amber-400 animate-ping',
    offline: 'bg-slate-500',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    info: 'bg-blue-400',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />
      )}
      <span>{children}</span>
    </span>
  );
};
