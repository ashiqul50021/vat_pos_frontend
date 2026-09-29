import React from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setCurrentView, selectCounter } from '../../store/slices/counterSlice';
import { mockCounters } from '../../data/mockCounters';
import { 
  TrendingUp, 
  Home, 
  ShoppingCart, 
  FileText, 
  Package, 
  Sliders, 
  ArrowLeftRight, 
  BarChart3, 
  Settings, 
  FileCheck2, 
  Download, 
  ChevronRight, 
  Tv, 
  User, 
  Cpu, 
  ShoppingBag, 
  Box, 
  CircleDot,
  DollarSign
} from 'lucide-react';

interface MainDashboardViewProps {
  onOpenPos?: () => void;
}

import { useNavigate } from '../../router';

export const MainDashboardView: React.FC<MainDashboardViewProps> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLaunchPos = () => {
    dispatch(setCurrentView('counter-selection'));
    navigate('/counters');
  };

  const handleDirectPos = () => {
    dispatch(selectCounter(mockCounters[0]));
    navigate('/pos');
  };

  const navMenuItems = [
    { id: 'purchase', label: 'Purchase', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'contractual', label: 'Contractual...', icon: <FileText className="w-4 h-4" /> },
    { id: 'inventories', label: 'Inventories', icon: <Package className="w-4 h-4" /> },
    { id: 'sales', label: 'Sales', icon: <Box className="w-4 h-4 text-emerald-400" />, badge: 'POS' },
    { id: 'adjustments', label: 'Other Adjust...', icon: <Sliders className="w-4 h-4" /> },
    { id: 'transfer', label: 'Transfer', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'dvs', label: 'DVS Records', icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'receive', label: 'Receive', icon: <Download className="w-4 h-4" /> },
  ];

  return (
    <div className="flex h-screen bg-[#F0F4F8] text-slate-800 select-none overflow-hidden font-sans">
      {/* 1. Deep Navy Sidebar matching Screenshot */}
      <aside className="w-56 bg-[#0B192C] text-slate-300 flex flex-col justify-between shrink-0 shadow-xl z-20">
        <div>
          {/* Brand Header */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2563EB]" />
              <span className="text-lg font-black tracking-tight text-white">NEXVAT</span>
            </div>
            <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 cursor-pointer hover:text-white">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            </div>
          </div>

          {/* Active Dashboard Button */}
          <div className="p-3">
            <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-[#2563EB] text-white font-semibold text-xs shadow-md shadow-blue-900/40">
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>

          {/* APPS Section Menu */}
          <div className="px-4 pb-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              APPS
            </p>
            <nav className="space-y-0.5">
              {navMenuItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'sales') {
                      handleLaunchPos();
                    }
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    item.id === 'sales'
                      ? 'text-cyan-400 hover:bg-slate-800/80 hover:text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Quick Launch POS Footer in Sidebar */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <button
            onClick={handleLaunchPos}
            className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/50"
          >
            <DollarSign className="w-4 h-4" />
            <span>Launch POS Terminal</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#2563EB]" />
            <span className="text-base font-black tracking-tight text-slate-900">NEXVAT</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Launch POS Shortcut */}
            <button
              onClick={handleLaunchPos}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2563EB] text-xs font-bold transition-colors shadow-2xs"
            >
              <span>🛒 Open POS Billing</span>
            </button>

            {/* Screen Icon */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Tv className="w-3.5 h-3.5 text-slate-400" />
              <span>Semi</span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <span className="text-xs font-bold text-slate-800">Super Admin</span>
              <div className="w-7 h-7 rounded-full border border-blue-400 text-[#2563EB] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <main className="flex-1 p-6 overflow-y-auto space-y-5">
          {/* Row 1 & Row 2: 6 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Monthly Purchase */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900 font-mono tracking-tight">
                  565,313,000.00 <span className="text-xs font-normal text-slate-500 font-sans">BDT</span>
                </p>
                <p className="text-xs text-[#2563EB] font-medium mt-1">
                  Monthly Purchase
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Cpu className="w-5 h-5" />
              </div>
            </div>

            {/* Card 2: Daily Sales */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900 font-mono tracking-tight">
                  0 <span className="text-xs font-normal text-slate-500 font-sans">BDT</span>
                </p>
                <p className="text-xs text-[#2563EB] font-medium mt-1">
                  Daily Sales
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>

            {/* Card 3: Monthly Sales */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900 font-mono tracking-tight">
                  1,232,400.00 <span className="text-xs font-normal text-slate-500 font-sans">BDT</span>
                </p>
                <p className="text-xs text-[#2563EB] font-medium mt-1">
                  Monthly Sales
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Box className="w-5 h-5" />
              </div>
            </div>

            {/* Card 4: Daily VAT */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900 font-mono tracking-tight">
                  0 <span className="text-xs font-normal text-slate-500 font-sans">BDT</span>
                </p>
                <p className="text-xs text-[#2563EB] font-medium mt-1">
                  Daily VAT
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold">
                $
              </div>
            </div>

            {/* Card 5: Monthly VAT */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900 font-mono tracking-tight">
                  103,387.50 <span className="text-xs font-normal text-slate-500 font-sans">BDT</span>
                </p>
                <p className="text-xs text-[#2563EB] font-medium mt-1">
                  Monthly VAT
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            {/* Card 6: Yearly VAT */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900 font-mono tracking-tight">
                  103,387.50 <span className="text-xs font-normal text-slate-500 font-sans">BDT</span>
                </p>
                <p className="text-xs text-[#2563EB] font-medium mt-1">
                  Yearly VAT
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                $
              </div>
            </div>
          </div>

          {/* Row 3: Two Pie/Donut Charts matching Screenshot */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Chart 1: Monthly Sales Pie */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-800">
                Monthly Sales
              </h3>

              <div className="flex flex-col items-center justify-center py-4">
                {/* Perfect Circular Pie Chart matching Screenshot */}
                <div 
                  className="relative w-48 h-48 rounded-full shadow-sm flex items-center justify-center transition-transform hover:scale-105 duration-200"
                  style={{
                    background: 'conic-gradient(#F97316 0deg 108deg, #5B61F4 108deg 360deg)'
                  }}
                >
                  {/* Percentage Labels on Slices */}
                  <span className="absolute top-[28%] left-[28%] text-white font-bold text-xs font-mono drop-shadow-md">
                    30.0%
                  </span>
                  <span className="absolute bottom-[28%] right-[28%] text-white font-bold text-xs font-mono drop-shadow-md">
                    70.0%
                  </span>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-6 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5B61F4]" />
                    <span>Local Sales</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                    <span>Export</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 2: Monthly Purchase Pie */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-800">
                Monthly Purchase
              </h3>

              <div className="flex flex-col items-center justify-center py-4">
                {/* Perfect Circular Pie Chart matching Screenshot */}
                <div 
                  className="relative w-48 h-48 rounded-full shadow-sm flex items-center justify-center transition-transform hover:scale-105 duration-200"
                  style={{
                    background: 'conic-gradient(#00C49F 0deg 165.24deg, #FFBB28 165.24deg 360deg)'
                  }}
                >
                  {/* Labels on Slices */}
                  <span className="absolute top-[35%] left-[22%] text-white font-bold text-xs font-mono drop-shadow-md">
                    45.9%
                  </span>
                  <span className="absolute bottom-[35%] right-[22%] text-white font-bold text-xs font-mono drop-shadow-md">
                    54.1%
                  </span>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-6 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBB28]" />
                    <span>Local Purchase</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00C49F]" />
                    <span>Import</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                    <span>Debit Note</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Year-wise Monthly Sales 2026 Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Year-wise Monthly Sales 2026
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Fiscal Year: 2025-2026
              </span>
            </div>

            {/* Bar Chart Bars */}
            <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-100">
              {[
                { month: 'Jan', sales: 65, vat: 15 },
                { month: 'Feb', sales: 85, vat: 20 },
                { month: 'Mar', sales: 95, vat: 24 },
                { month: 'Apr', sales: 70, vat: 18 },
                { month: 'May', sales: 110, vat: 28 },
                { month: 'Jun', sales: 130, vat: 32 },
                { month: 'Jul', sales: 115, vat: 27 },
                { month: 'Aug', sales: 125, vat: 30 },
                { month: 'Sep', sales: 142, vat: 35 },
                { month: 'Oct', sales: 105, vat: 26 },
                { month: 'Nov', sales: 120, vat: 29 },
                { month: 'Dec', sales: 150, vat: 38 },
              ].map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1">
                    <div
                      style={{ height: `${(m.sales / 150) * 120}px` }}
                      className="w-full max-w-[14px] bg-[#2563EB] rounded-t-sm group-hover:bg-blue-700 transition-all"
                      title={`${m.month} Sales: ${m.sales}k`}
                    />
                    <div
                      style={{ height: `${(m.vat / 150) * 120}px` }}
                      className="w-full max-w-[10px] bg-emerald-500 rounded-t-sm group-hover:bg-emerald-600 transition-all"
                      title={`${m.month} VAT: ${m.vat}k`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1">{m.month}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#2563EB] rounded-xs" />
                  <span>Gross Sales</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" />
                  <span>VAT Collected (Mushak 6.3)</span>
                </div>
              </div>
              <span>Updated: Real-time NBR SDMS</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
