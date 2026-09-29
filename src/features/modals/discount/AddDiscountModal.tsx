import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { applyDiscount, removeDiscount } from '../../../store/slices/cartSlice';
import { closeModal } from '../../../store/slices/modalSlice';
import { 
  Percent, 
  DollarSign, 
  Ticket, 
  X, 
  Check, 
  Trash2
} from 'lucide-react';
import { formatBDT } from '../../../utils/currencyFormatter';

export const AddDiscountModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.isDiscountModalOpen);
  const { subtotal, appliedDiscount } = useAppSelector((state) => state.cart);

  const [discountType, setDiscountType] = useState<'percent' | 'fixed' | 'coupon'>('percent');
  const [percentValue, setPercentValue] = useState<number>(10);
  const [fixedValue, setFixedValue] = useState<number>(100);
  const [couponCode, setCouponCode] = useState<string>('PRIVILEGE');
  const [customInput, setCustomInput] = useState<string>('');

  if (!isOpen) return null;

  // Calculate discount amount based on active mode
  let calculatedDiscount = 0;
  if (discountType === 'percent') {
    const pct = customInput ? Math.min(100, Math.max(0, parseFloat(customInput) || 0)) : percentValue;
    calculatedDiscount = (subtotal * pct) / 100;
  } else if (discountType === 'fixed') {
    const amt = customInput ? Math.max(0, parseFloat(customInput) || 0) : fixedValue;
    calculatedDiscount = Math.min(subtotal, amt);
  } else if (discountType === 'coupon') {
    const code = couponCode.trim().toUpperCase();
    if (code === 'PRIVILEGE') calculatedDiscount = Math.min(subtotal, 150);
    else if (code === 'SAVE10') calculatedDiscount = (subtotal * 10) / 100;
    else if (code === 'EID2026') calculatedDiscount = (subtotal * 15) / 100;
    else calculatedDiscount = Math.min(subtotal, 50);
  }

  const finalTotal = Math.max(0, subtotal - calculatedDiscount);

  const handleApply = () => {
    dispatch(
      applyDiscount({
        type: discountType === 'percent' ? 'percentage' : discountType === 'fixed' ? 'fixed' : 'coupon',
        value: discountType === 'percent' ? (customInput ? parseFloat(customInput) || 0 : percentValue) : calculatedDiscount,
        code: discountType === 'coupon' ? couponCode.trim().toUpperCase() : undefined,
        calculatedAmount: calculatedDiscount,
        reason: 'Counter Discount',
        authorizedBy: 'Super Admin',
      })
    );
    dispatch(closeModal('discount'));
  };

  const handleRemove = () => {
    dispatch(removeDiscount());
    dispatch(closeModal('discount'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none antialiased">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(closeModal('discount'))}
      />

      {/* Clean Compact Card */}
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Add Discount</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Current Subtotal: <strong className="text-slate-800 font-mono">{formatBDT(subtotal, false)} BDT</strong>
            </p>
          </div>

          <button
            onClick={() => dispatch(closeModal('discount'))}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Segmented Control for Discount Type */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => {
                setDiscountType('percent');
                setCustomInput('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                discountType === 'percent'
                  ? 'bg-white text-[#1E3A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Percentage</span>
            </button>

            <button
              onClick={() => {
                setDiscountType('fixed');
                setCustomInput('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                discountType === 'fixed'
                  ? 'bg-white text-[#1E3A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Fixed (BDT)</span>
            </button>

            <button
              onClick={() => {
                setDiscountType('coupon');
                setCustomInput('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                discountType === 'coupon'
                  ? 'bg-white text-[#1E3A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Coupon</span>
            </button>
          </div>

          {/* Option Content */}
          {discountType === 'percent' && (
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-700 block">Select Percentage</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => {
                      setPercentValue(pct);
                      setCustomInput('');
                    }}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      percentValue === pct && !customInput
                        ? 'bg-blue-50 border-[#1E3A8A] text-[#1E3A8A] shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Or enter custom % (e.g. 8)"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          {discountType === 'fixed' && (
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-700 block">Select Amount (BDT)</label>
              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 150, 200].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setFixedValue(amt);
                      setCustomInput('');
                    }}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all font-mono ${
                      fixedValue === amt && !customInput
                        ? 'bg-blue-50 border-[#1E3A8A] text-[#1E3A8A] shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {amt} BDT
                  </button>
                ))}
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Or enter custom amount in BDT"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          {discountType === 'coupon' && (
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-700 block">Coupon / Voucher Code</label>
              <input
                type="text"
                placeholder="Enter coupon code (e.g. PRIVILEGE)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-blue-500/20"
              />

              {/* Quick Coupon Chips */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400">Available:</span>
                {['PRIVILEGE', 'SAVE10', 'EID2026'].map((code) => (
                  <button
                    key={code}
                    onClick={() => setCouponCode(code)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-[10px] font-mono font-semibold text-slate-600 transition-colors"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Simple Calculation Summary Box */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Cart Subtotal</span>
              <span className="font-mono font-semibold text-slate-800">{formatBDT(subtotal, false)} BDT</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Discount Deduction</span>
              <span className="font-mono font-bold">-{formatBDT(calculatedDiscount, false)} BDT</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-bold text-slate-900">New Payable Total</span>
              <span className="text-base font-black text-[#1E3A8A] font-mono">
                {formatBDT(finalTotal, false)} <span className="text-xs font-normal text-slate-500 font-sans">BDT</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-white flex items-center justify-between gap-2">
          {appliedDiscount ? (
            <button
              onClick={handleRemove}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Discount</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(closeModal('discount'))}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={calculatedDiscount <= 0}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Apply Discount</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
