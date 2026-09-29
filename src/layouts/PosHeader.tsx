import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { openModal } from '../store/slices/modalSlice';
import { leaveSession } from '../store/slices/counterSlice';
import { clearCart } from '../store/slices/cartSlice';
import { useNavigate } from '../router';
import {
  FileText,
  Clock,
  FileCheck2,
  Tv,
  User,
  ArrowLeftRight,
  LogOut,
  ChevronDown,
  ExternalLink,
  Building2
} from 'lucide-react';
import { NexvatLogo } from '../components/common/NexvatLogo';

export const PosHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { activeCounter, session } = useAppSelector((state) => state.counter);
  const { draftOrders } = useAppSelector((state) => state.sales);
  const branchName = (typeof window !== 'undefined' ? localStorage.getItem('branch_name') : null) || 'Main Branch';

  const handleSwitchCounter = () => {
    dispatch(clearCart());
    dispatch(leaveSession());
    navigate('/counters');
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 select-none shadow-xs z-20">
      {/* Left: Logo & Navigation Pills */}
      <div className="flex items-center gap-2.5">
        {/* NEXVAT Brand Logo */}
        <button onClick={() => navigate('/counters')} className="cursor-pointer text-left">
          <NexvatLogo className="mr-2" />
        </button>

        {/* Counter Display & Switch Pill */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-lg p-1 shadow-2xs">
          <div className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>Counter: <strong className="text-slate-900 font-semibold">{activeCounter?.name || 'Counter 01 (Main)'}</strong></span>
          </div>

          <button
            onClick={handleSwitchCounter}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-[#1E3A8A] hover:text-blue-900 transition-colors shadow-2xs cursor-pointer active:scale-95"
            title="Switch / Change Counter"
          >
            <ArrowLeftRight className="w-3 h-3 text-blue-600" />
            <span>Switch</span>
          </button>
        </div>

        {/* Draft Bill Pill (Figma Match: Blue Border & Badge) */}
        <button
          onClick={() => dispatch(openModal('draftBills'))}
          className="flex items-center gap-2 bg-blue-50/60 hover:bg-blue-100/70 border border-blue-300 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Draft Bill</span>
          <span className="bg-[#2563EB] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-md leading-none">
            {draftOrders.length}
          </span>
          <ChevronDown className="w-3 h-3 text-blue-500 ml-0.5" />
        </button>

        {/* Recent Transaction Pill */}
        <button
          onClick={() => dispatch(openModal('recentTransactions'))}
          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-2xs"
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Recent Transaction</span>
        </button>

        {/* Completed sell Pill */}
        <button
          onClick={() => dispatch(openModal('completedSales'))}
          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-2xs"
        >
          <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Completed sell</span>
        </button>
      </div>

      {/* Right: Screen & User Profile matching Main Dashboard */}
      <div className="flex items-center gap-3">
        {/* Back to ERP Link */}
        <a
          href="http://localhost:3000/pos/sales"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-blue-200 hover:border-blue-400 bg-blue-50/70 hover:bg-blue-100/70 text-xs font-semibold text-[#1E3A8A] transition-colors shadow-2xs active:scale-95 cursor-pointer"
          title="Return to Main ERP Dashboard"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">VAT Portal</span>
        </a>

        {/* Exit Session Button */}
        <button
          onClick={handleSwitchCounter}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-xs font-medium text-slate-600 hover:text-rose-700 transition-colors shadow-2xs active:scale-95 cursor-pointer"
          title="Exit Session & Return to Counter Selection"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600" />
          <span className="hidden sm:inline">Exit Session</span>
        </button>

        {/* Branch Display */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/90 text-xs text-slate-700 font-semibold shadow-2xs">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span>{branchName}</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <span className="text-xs font-bold text-[#1E3A8A]">
            {session?.operatorName || (typeof window !== 'undefined' ? localStorage.getItem('user_name') : null) || 'Super Admin'}
          </span>
          <div className="w-8 h-8 rounded-full border border-sky-400 text-sky-500 flex items-center justify-center bg-white shadow-2xs">
            <User className="w-4 h-4 stroke-[1.8]" />
          </div>
        </div>
      </div>
    </header>
  );
};
