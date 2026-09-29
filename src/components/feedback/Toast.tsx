import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#1E3A8A] shrink-0" />,
  };

  const iconContainers = {
    success: 'bg-emerald-50 border border-emerald-200/80 text-emerald-700',
    error: 'bg-rose-50 border border-rose-200/80 text-rose-700',
    info: 'bg-blue-50 border border-blue-200/80 text-[#1E3A8A]',
  };

  return (
    <div className="fixed top-5 right-5 z-[100] select-none antialiased animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-auto">
      <div className="flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xl backdrop-blur-md min-w-[320px] max-w-md">
        <div className={clsx('p-1.5 rounded-xl shrink-0', iconContainers[toast.type])}>
          {icons[toast.type]}
        </div>
        <div className="flex-1 pr-1">
          <p className="text-sm font-bold text-slate-900 tracking-tight">{toast.title}</p>
          {toast.message && <p className="text-xs text-slate-500 mt-0.5 font-medium">{toast.message}</p>}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
