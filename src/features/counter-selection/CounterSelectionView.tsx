import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCounter, setFilterStatus, setCurrentView, setCounters } from '../../store/slices/counterSlice';
import { clearCart } from '../../store/slices/cartSlice';
import { CounterCard } from './CounterCard';
import { CounterCardSkeleton } from './CounterCardSkeleton';
import { Search, Monitor, Headphones, Tv, User, Building2 } from 'lucide-react';
import { CounterTerminal } from '../../types/counter.types';
import { NexvatLogo } from '../../components/common/NexvatLogo';
import { posClient } from '../../api/posClient';

import { useNavigate } from '../../router';

export const CounterSelectionView: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { counters, filterStatus } = useAppSelector((state) => state.counter);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('user_name') : null) || 'Super Admin');
  const [branchName, setBranchName] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('branch_name') : null) || 'Main Branch');

  useEffect(() => {
    posClient.verifyAuth()
      .then((res) => {
        if (res?.user?.name) {
          setUserName(res.user.name);
          localStorage.setItem('user_name', res.user.name);
        }
        if (res?.user?.role?.name) {
          localStorage.setItem('user_role', res.user.role.name);
        }
      })
      .catch((err) => {
        console.warn('Auth verification error:', err);
      });
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    posClient.getCounters()
      .then((res) => {
        if (!isMounted || !res || !res.data) return;
        const liveCounters: CounterTerminal[] = res.data.map((c: any) => ({
          id: String(c.id),
          code: c.counter_number || `POS-T0${c.id}`,
          name: c.name || `Counter ${c.id}`,
          location: c.floor || 'Main Billing Floor',
          status: c.status === 'in_use' ? 'in-use' : (c.status || 'available'),
          currentCashier: c.current_user?.name || undefined,
          ipAddress: c.ip_address || '127.0.0.1',
        }));
        if (liveCounters.length > 0) {
          dispatch(setCounters(liveCounters));
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch live counters:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const total = counters.length;
  const availableCount = counters.filter((c) => c.status === 'available').length;
  const inUseCount = counters.filter((c) => c.status === 'in-use').length;
  const attentionCount = counters.filter((c) => c.status === 'attention').length;

  const filteredCounters = counters.filter((counter) => {
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'available'
        ? counter.status === 'available'
        : filterStatus === 'in-use'
        ? counter.status === 'in-use'
        : counter.status === 'attention';

    const matchesSearch =
      counter.name.toLowerCase().includes(search.toLowerCase()) ||
      counter.code.toLowerCase().includes(search.toLowerCase()) ||
      counter.location.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleSelect = (counter: CounterTerminal) => {
    dispatch(clearCart());
    dispatch(selectCounter(counter));
    navigate('/pos');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col justify-between font-sans select-none antialiased">
      {/* Top Floating Navbar matching user screenshot */}
      <header className="mx-4 sm:mx-6 lg:mx-8 mt-3 sm:mt-4 h-14 bg-white border border-slate-200/90 rounded-xl px-5 sm:px-6 flex items-center justify-between shrink-0 shadow-xs">
        <button onClick={() => navigate('/counters')} className="cursor-pointer text-left">
          <NexvatLogo />
        </button>

        <div className="flex items-center gap-5 sm:gap-6">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>{branchName}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#1E3A8A] hidden sm:inline">
              {userName}
            </span>
            <div className="w-8 h-8 rounded-full border border-sky-400 text-sky-500 flex items-center justify-center bg-white shadow-2xs">
              <User className="w-4 h-4 stroke-[1.8]" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="flex-1 flex flex-col justify-center max-w-6xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-5">
        {/* Header Panel Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
          {/* Top Row: Title on Left, 3 Stat Boxes on Right */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title with Cash Register / POS Icon */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1D4ED8] shadow-xs">
                <Monitor className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Select Active POS Counter
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assign terminal node to begin NBR Mushak-6.3 billing session
                </p>
              </div>
            </div>

            {/* 3 Metric Stat Boxes */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Box 1: Total */}
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-left min-w-[110px] shadow-2xs">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  TOTAL COUNTERS
                </p>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5 font-mono">
                  {loading ? (
                    <span className="inline-block w-6 h-4 bg-slate-200 animate-pulse rounded align-middle" />
                  ) : (
                    String(total).padStart(2, '0')
                  )}{' '}
                  <span className="text-[11px] font-normal text-slate-500 ml-0.5">Nodes</span>
                </p>
              </div>

              {/* Box 2: Available (Green) */}
              <div className="bg-white border border-emerald-200/90 rounded-xl px-4 py-2 text-left min-w-[110px] shadow-2xs">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  AVAILABLE
                </p>
                <p className="text-sm font-extrabold text-emerald-700 mt-0.5 font-mono">
                  {loading ? (
                    <span className="inline-block w-6 h-4 bg-emerald-100 animate-pulse rounded align-middle" />
                  ) : (
                    String(availableCount).padStart(2, '0')
                  )}{' '}
                  <span className="text-[11px] font-semibold text-emerald-600 ml-0.5">Ready</span>
                </p>
              </div>

              {/* Box 3: Currently Use (Blue) */}
              <div className="bg-white border border-blue-200/90 rounded-xl px-4 py-2 text-left min-w-[110px] shadow-2xs">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  CURRENTLY USE
                </p>
                <p className="text-sm font-extrabold text-blue-700 mt-0.5 font-mono">
                  {loading ? (
                    <span className="inline-block w-6 h-4 bg-blue-100 animate-pulse rounded align-middle" />
                  ) : (
                    String(inUseCount).padStart(2, '0')
                  )}{' '}
                  <span className="text-[11px] font-semibold text-blue-600 ml-0.5">In Use</span>
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Bottom Row: Search Box on Left, Filter Tabs on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search counter by ID (POS-T01), name or floor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50/60 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
              <button
                onClick={() => dispatch(setFilterStatus('all'))}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filterStatus === 'all'
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({loading ? '...' : total})
              </button>
              <button
                onClick={() => dispatch(setFilterStatus('available'))}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filterStatus === 'available'
                    ? 'bg-white text-emerald-600 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Available ({loading ? '...' : availableCount})
              </button>
              <button
                onClick={() => dispatch(setFilterStatus('in-use'))}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filterStatus === 'in-use'
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                In Use ({loading ? '...' : inUseCount})
              </button>
              <button
                onClick={() => dispatch(setFilterStatus('attention' as any))}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  (filterStatus as string) === 'attention'
                    ? 'bg-white text-amber-600 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Attention ({loading ? '...' : attentionCount})
              </button>
            </div>
          </div>
        </div>

        {/* 3-Column Counter Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <>
              <CounterCardSkeleton />
              <CounterCardSkeleton />
              <CounterCardSkeleton />
            </>
          ) : filteredCounters.length > 0 ? (
            filteredCounters.map((counter) => (
              <CounterCard key={counter.id} counter={counter} onSelect={handleSelect} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/80">
              <p className="text-sm font-semibold text-slate-600">No active POS counters found</p>
              <p className="text-xs text-slate-400 mt-1">Configure counters from the NEXVAT Settings module.</p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Footer Bar */}
      <footer className="w-full bg-white/70 border-t border-slate-200/80 backdrop-blur-sm py-3 px-6 sm:px-8 flex items-center justify-between text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="font-bold text-slate-700 tracking-wide">NEXVAT POS</span>
          <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">• Version 4.2.1-PROD</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-medium">Helpline: +880 9612-NEXVAT (Ext. 401)</span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400">IP: 10.240.12.84</span>
        </div>
      </footer>
    </div>
  );
};

