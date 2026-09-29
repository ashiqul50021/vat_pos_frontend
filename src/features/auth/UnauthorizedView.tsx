import React from 'react';
import { ShieldAlert, ExternalLink, ArrowRight, Lock } from 'lucide-react';
import { NexvatLogo } from '../../components/common/NexvatLogo';

export const UnauthorizedView: React.FC = () => {
  const handleGoToErp = () => {
    window.location.href = 'http://localhost:3000/pos/open';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/40 flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none">
      {/* Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <NexvatLogo />
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
          <Lock className="w-3.5 h-3.5 text-amber-500" />
          <span>NBR Mushak-6.3 Secure Enclave</span>
        </div>
      </header>

      {/* Main Card */}
      <main className="max-w-lg w-full mx-auto my-auto bg-white border border-slate-200/90 rounded-2xl shadow-xl p-8 sm:p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-6 text-amber-600 shadow-inner">
          <ShieldAlert className="w-8 h-8 stroke-[1.8]" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
          Authentication Required
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          Direct URL access to the <strong>NEXVAT POS</strong> terminal is not allowed. To ensure a verified cashier session and NBR Mushak-6.3 tax invoices, please sign in to the <strong>NEXVAT</strong> portal and launch via the <strong>&quot;Open POS Terminal&quot;</strong> button.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-500 mb-8 text-left space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-700">Security Gate:</span>
            <span className="font-mono text-rose-600 font-semibold">Missing Auth Token</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-700">Required Source:</span>
            <span className="font-mono text-slate-600">NEXVAT (/pos/open)</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoToErp}
            className="w-full h-11 bg-[#1E3A8A] hover:bg-[#1e40af] active:scale-[0.99] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-900/20 transition-all cursor-pointer"
          >
            <span>Go to NEXVAT to Launch</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center py-2 text-xs text-slate-400">
        NEXVAT POS Ecosystem &copy; {new Date().getFullYear()} &bull; NBR Approved Architecture
      </footer>
    </div>
  );
};
