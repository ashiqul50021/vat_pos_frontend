import React from 'react';
import { CloudCheck, ShieldCheck } from 'lucide-react';

interface NbrSyncIndicatorProps {
  latencyMs?: number;
  isSynced?: boolean;
  autoMushak?: boolean;
}

export const NbrSyncIndicator: React.FC<NbrSyncIndicatorProps> = ({
  latencyMs = 24,
  isSynced = true,
  autoMushak = true,
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* NBR Cloud Sync Status */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-medium text-emerald-300">NBR SDMS Cloud</span>
        <span className="text-slate-400 font-mono text-[11px]">({latencyMs}ms)</span>
      </div>

      {/* Mushak 6.3 Auto Generation Tag */}
      {autoMushak && (
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Mushak 6.3 Auto-Gen: Active</span>
        </div>
      )}
    </div>
  );
};
