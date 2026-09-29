import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { openPaymentModal } from '../../../store/slices/modalSlice';
import { Banknote, CreditCard, Smartphone, Layers } from 'lucide-react';

interface PaymentKeypadProps {
  onSaleComplete?: () => void;
}

export const PaymentKeypad: React.FC<PaymentKeypadProps> = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const isDisabled = items.length === 0;

  return (
    <div className="grid grid-cols-4 gap-2 mt-2 select-none">
      {/* Cash [F10] */}
      <button
        type="button"
        onClick={() => dispatch(openPaymentModal('cash'))}
        disabled={isDisabled}
        className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-gradient-to-b from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065F46] text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs hover:shadow-md active:scale-95 group"
      >
        <div className="flex items-center gap-1">
          <Banknote className="w-3.5 h-3.5" />
          <span className="text-xs">Cash</span>
        </div>
        <span className="text-[10px] text-emerald-200/90 font-mono font-normal">[F10]</span>
      </button>

      {/* Card [F11] */}
      <button
        type="button"
        onClick={() => dispatch(openPaymentModal('card'))}
        disabled={isDisabled}
        className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-gradient-to-b from-[#1E3A8A] to-[#1D4ED8] hover:from-[#1E3A8A] hover:to-[#172554] text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs hover:shadow-md active:scale-95 group"
      >
        <div className="flex items-center gap-1">
          <CreditCard className="w-3.5 h-3.5" />
          <span className="text-xs">Card</span>
        </div>
        <span className="text-[10px] text-blue-200/90 font-mono font-normal">[F11]</span>
      </button>

      {/* bKash / MFS [F12] */}
      <button
        type="button"
        onClick={() => dispatch(openPaymentModal('mfs'))}
        disabled={isDisabled}
        className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-gradient-to-b from-[#D91A60] to-[#BE123C] hover:from-[#BE123C] hover:to-[#9F1239] text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs hover:shadow-md active:scale-95 group"
      >
        <div className="flex items-center gap-1">
          <Smartphone className="w-3.5 h-3.5" />
          <span className="text-xs">bKash</span>
        </div>
        <span className="text-[10px] text-pink-200/90 font-mono font-normal">[F12]</span>
      </button>

      {/* Split Pay [Alt+S] */}
      <button
        type="button"
        onClick={() => dispatch(openPaymentModal('split'))}
        disabled={isDisabled}
        className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-gradient-to-b from-[#1E293B] to-[#0F172A] hover:from-[#0F172A] hover:to-[#020617] text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs hover:shadow-md active:scale-95 group"
      >
        <div className="flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          <span className="text-xs">Split Pay</span>
        </div>
        <span className="text-[10px] text-slate-300 font-mono font-normal">[Alt+S]</span>
      </button>
    </div>
  );
};

