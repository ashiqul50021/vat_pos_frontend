import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { removeDiscount } from '../../../store/slices/cartSlice';
import { formatBDT } from '../../../utils/currencyFormatter';

export const OrderSummaryCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { subtotal, totalVat, discountAmount, grandTotal, appliedDiscount, items } =
    useAppSelector((state) => state.cart);

  const totalPcs = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-3 mt-2 shadow-2xs space-y-1.5">
      {/* Subtotal */}
      <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
        <span>Subtotal ({items.length} Items / {totalPcs} pcs)</span>
        <span className="font-bold text-slate-800 font-mono">
          {formatBDT(subtotal, false)} BDT
        </span>
      </div>

      {/* Standard VAT */}
      <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
        <span>Standard VAT (Applicable per Item)</span>
        <span className="font-bold text-emerald-600 font-mono">
          +{formatBDT(totalVat, false)} BDT
        </span>
      </div>

      {/* Discount */}
      {appliedDiscount && (
        <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <span>Discount ({appliedDiscount.code || 'PRIVILEGE'})</span>
            <button
              onClick={() => dispatch(removeDiscount())}
              className="text-rose-500 hover:text-rose-700 text-[10px] underline ml-1"
            >
              Remove
            </button>
          </div>
          <span className="font-bold text-emerald-600 font-mono">
            -{formatBDT(discountAmount, false)} BDT
          </span>
        </div>
      )}

      {/* Grand Total */}
      <div className="pt-2 border-t border-slate-200/90 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-black text-slate-900 tracking-wider uppercase">
            GRAND TOTAL PAYABLE
          </p>
          <p className="text-[10px] text-slate-500 font-medium">
            Inclusive of Government VAT (Mushak 6.3)
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-[#1E3A8A] tracking-tight font-mono">
            {formatBDT(grandTotal, false)}
          </span>
          <span className="text-xs font-bold text-slate-600 ml-1.5 font-mono">
            BDT
          </span>
        </div>
      </div>
    </div>
  );
};
