import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { clearCart } from '../../../store/slices/cartSlice';
import { openModal } from '../../../store/slices/modalSlice';
import { addDraftOrder } from '../../../store/slices/salesSlice';

import { Clock, Trash2, Tag } from 'lucide-react';

interface ActionToolbarProps {
  onNotify?: (msg: string) => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({ onNotify }) => {
  const dispatch = useAppDispatch();
  const { items, customer, appliedDiscount, subtotal, totalVat, grandTotal } =
    useAppSelector((state) => state.cart);

  const handleHoldOrder = () => {
    if (items.length === 0) {
      onNotify?.('Cart is empty. Nothing to hold.');
      return;
    }

    const orderNumber = `HLD-${Date.now().toString().slice(-4)}`;
    dispatch(
      addDraftOrder({
        id: `draft-${Date.now()}`,
        orderNumber,
        timestamp: 'Just now',
        holdReason: 'Customer requested hold at counter',
        customer,
        items,
        appliedDiscount: appliedDiscount || undefined,
        subtotal,
        vatAmount: totalVat,
        grandTotal,
        itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
      })
    );

    dispatch(clearCart());
    onNotify?.(`Order held successfully as ${orderNumber}`);
  };

  const handleVoidCart = () => {
    if (items.length === 0) return;
    if (window.confirm('Are you sure you want to void this cart? [F8]')) {
      dispatch(clearCart());
      onNotify?.('Cart voided');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {/* Hold Order [F4] */}
      <button
        onClick={handleHoldOrder}
        disabled={items.length === 0}
        className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed text-center shadow-2xs active:scale-95"
      >
        <Clock className="w-3.5 h-3.5 text-slate-500" />
        <span>Hold [F4]</span>
      </button>

      {/* Void Cart [F8] */}
      <button
        onClick={handleVoidCart}
        disabled={items.length === 0}
        className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-600 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed text-center shadow-2xs active:scale-95"
      >
        <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-rose-500" />
        <span>Void [F8]</span>
      </button>

      {/* Discount feature hidden temporarily upon request - can be re-enabled anytime */}
      {/* 
      <button
        onClick={() => dispatch(openModal('discount'))}
        disabled={items.length === 0}
        className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-blue-50 hover:border-blue-200 text-slate-700 hover:text-[#1E3A8A] text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed text-center shadow-2xs active:scale-95"
      >
        <Tag className="w-3.5 h-3.5 text-slate-500" />
        <span>Discount</span>
      </button>
      */}
    </div>
  );
};
