import React from 'react';
import { useAppSelector } from '../store/hooks';

export const PosFooter: React.FC = () => {
  const { activeCounter, session } = useAppSelector((state) => state.counter);

  return (
    <footer className="h-7 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-[11px] text-slate-500 shrink-0 select-none">
      {/* Left: NBR Cloud Sync Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>NEXVAT Cloud: Connected</span>
          <span className="text-slate-400 font-mono">(Latency: {session?.nbrCloudLatencyMs || 24}ms)</span>
        </div>

        <div className="flex items-center gap-1 pl-3 border-l border-slate-200">
          <span className="text-slate-500">Mushak 6.3 Auto-Generation:</span>
          <strong className="text-emerald-600 font-bold">Active</strong>
        </div>
      </div>

      {/* Right: Branch & Version Meta */}
      <div className="flex items-center gap-4 text-slate-500 font-mono text-[10px]">
        <span>Branch: Dhaka Central (001)</span>
        <span>Terminal: {activeCounter?.code || 'POS-T01'}</span>
        <span className="text-slate-400">v4.2.1-PROD</span>
      </div>
    </footer>
  );
};
