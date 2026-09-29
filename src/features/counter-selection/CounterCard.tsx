import React from 'react';
import { CounterTerminal } from '../../types/counter.types';
import { 
  MapPin, 
  ArrowRight, 
  ShoppingCart, 
  Shirt, 
  Coffee, 
  Snowflake, 
  Smartphone, 
  Zap
} from 'lucide-react';

interface CounterCardProps {
  counter: CounterTerminal;
  onSelect: (counter: CounterTerminal) => void;
}

// Map each counter to a tailored category icon
const getCounterCategoryMeta = (id: string, name: string) => {
  if (id.includes('01') || name.includes('Billing')) {
    return {
      label: 'Main Billing',
      icon: <ShoppingCart className="w-4 h-4" />,
    };
  }
  if (id.includes('02') || name.includes('Fashion')) {
    return {
      label: 'Fashion & Apparel',
      icon: <Shirt className="w-4 h-4" />,
    };
  }
  if (id.includes('03') || name.includes('Bakery')) {
    return {
      label: 'Dairy & Bakery',
      icon: <Coffee className="w-4 h-4" />,
    };
  }
  if (id.includes('04') || name.includes('Cold')) {
    return {
      label: 'Cold Storage & Meat',
      icon: <Snowflake className="w-4 h-4" />,
    };
  }
  if (id.includes('05') || name.includes('Electronics')) {
    return {
      label: 'Electronics & Gadgets',
      icon: <Smartphone className="w-4 h-4" />,
    };
  }
  return {
    label: 'Quick Kiosk / Backup',
    icon: <Zap className="w-4 h-4" />,
  };
};

export const CounterCard: React.FC<CounterCardProps> = ({ counter, onSelect }) => {
  const isAvailable = counter.status === 'available';
  const isInUse = counter.status === 'in-use';
  const isAttention = counter.status === 'attention';

  const categoryMeta = getCounterCategoryMeta(counter.id, counter.name);

  // Status Badge with pulsing dot & guaranteed single line (whitespace-nowrap)
  const statusBadge = isAvailable ? (
    <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-200/90 bg-emerald-50 text-emerald-700 font-bold text-[10px] tracking-wide shadow-2xs">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
      AVAILABLE
    </span>
  ) : isInUse ? (
    <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-blue-200/90 bg-blue-50 text-blue-700 font-bold text-[10px] tracking-wide shadow-2xs">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 animate-pulse" />
      IN USE
    </span>
  ) : (
    <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-200/90 bg-amber-50 text-amber-700 font-bold text-[10px] tracking-wide shadow-2xs">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
      ATTENTION
    </span>
  );

  // Accent styling for top bar & category icon box
  const accentTheme = isAvailable
    ? {
        topGradient: 'from-emerald-400 via-teal-500 to-emerald-500',
        iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
        glowHover: 'group-hover:border-emerald-300',
        btnBg: 'bg-[#1D4ED8] hover:bg-[#1E40AF]',
        btnText: 'Open Terminal & Start Session',
      }
    : isInUse
    ? {
        topGradient: 'from-blue-500 via-indigo-500 to-blue-600',
        iconBg: 'bg-blue-50 text-blue-600 border-blue-200/80',
        glowHover: 'group-hover:border-blue-300',
        btnBg: 'bg-[#0F172A] hover:bg-slate-800',
        btnText: 'Switch / Resume Session',
      }
    : {
        topGradient: 'from-amber-400 via-orange-500 to-amber-500',
        iconBg: 'bg-amber-50 text-amber-600 border-amber-200/80',
        glowHover: 'group-hover:border-amber-300',
        btnBg: 'bg-[#B45309] hover:bg-amber-800',
        btnText: 'Inspect & Open Terminal',
      };

  // Clean Counter display title without redundant parentheses
  const counterNumberMatch = counter.name.match(/Counter\s+\d+/i);
  const counterNumber = counterNumberMatch ? counterNumberMatch[0] : counter.name;

  return (
    <div
      className={`relative bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between select-none group overflow-hidden ${accentTheme.glowHover}`}
    >
      {/* Top 3.5px Vibrant Accent Gradient Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentTheme.topGradient}`} />

      <div>
        {/* Row 1: Category Icon, Counter Title & Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            {/* Category Tinted Icon Box */}
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105 ${accentTheme.iconBg}`}>
              {categoryMeta.icon}
            </div>

            {/* Counter Title & Department Subtitle */}
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-blue-700 transition-colors truncate">
                {counterNumber}
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate">
                {categoryMeta.label}
              </p>
            </div>
          </div>

          {/* Guaranteed Non-Wrapping Badge */}
          <div className="shrink-0 pt-0.5">
            {statusBadge}
          </div>
        </div>

        {/* Row 2: Code Pill, Floor Location & IP */}
        <div className="flex items-center gap-2 mb-4 flex-wrap text-xs">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#1D4ED8] border border-blue-200/80 shadow-2xs">
            {counter.code}
          </span>

          <div className="flex items-center gap-1 text-slate-600 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{counter.location}</span>
          </div>

          <span className="text-slate-300 ml-auto hidden sm:inline">•</span>

          <span className="text-[11px] font-mono text-slate-400">
            {counter.ipAddress}
          </span>
        </div>
      </div>

      {/* Action Button (CTA) */}
      <button
        onClick={() => onSelect(counter)}
        className={`w-full py-2.5 px-4 rounded-xl ${accentTheme.btnBg} active:scale-[0.99] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-md group/btn`}
      >
        <span>{accentTheme.btnText}</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
      </button>
    </div>
  );
};
