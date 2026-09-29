import React from 'react';
import { Server, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
import { CounterTerminal } from '../../types/counter.types';

interface CounterMetricsBarProps {
  counters: CounterTerminal[];
}

export const CounterMetricsBar: React.FC<CounterMetricsBarProps> = ({ counters }) => {
  const total = counters.length;
  const available = counters.filter((c) => c.status === 'available').length;
  const inUse = counters.filter((c) => c.status === 'in-use').length;
  const attention = counters.filter((c) => c.status === 'attention').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Total Nodes */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
        <div className="p-2.5 rounded-lg bg-slate-800 text-slate-300">
          <Server className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Total Terminal Nodes</p>
          <p className="text-xl font-bold text-slate-100 mt-0.5">{String(total).padStart(2, '0')}</p>
        </div>
      </div>

      {/* Available / Ready */}
      <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3.5">
        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Ready for Session</p>
          <p className="text-xl font-bold text-emerald-400 mt-0.5">{String(available).padStart(2, '0')}</p>
        </div>
      </div>

      {/* In Use */}
      <div className="bg-slate-900/60 border border-cyan-500/20 rounded-xl p-4 flex items-center gap-3.5">
        <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Active in Session</p>
          <p className="text-xl font-bold text-cyan-400 mt-0.5">{String(inUse).padStart(2, '0')}</p>
        </div>
      </div>

      {/* Attention / Alerts */}
      <div className="bg-slate-900/60 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3.5">
        <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Needs Attention</p>
          <p className="text-xl font-bold text-amber-400 mt-0.5">{String(attention).padStart(2, '0')}</p>
        </div>
      </div>
    </div>
  );
};
