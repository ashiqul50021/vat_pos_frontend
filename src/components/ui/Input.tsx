import React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, suffix, error, helperText, className, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={clsx(
              'w-full bg-slate-900 border text-slate-100 text-sm rounded-lg transition-colors placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 disabled:opacity-50 disabled:bg-slate-950',
              icon ? 'pl-10' : 'pl-3.5',
              suffix ? 'pr-12' : 'pr-3.5',
              'py-2.5',
              error ? 'border-rose-500 focus:ring-rose-500/40 focus:border-rose-500' : 'border-slate-700/80 hover:border-slate-600',
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 flex items-center text-slate-400">
              {suffix}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-rose-400">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
