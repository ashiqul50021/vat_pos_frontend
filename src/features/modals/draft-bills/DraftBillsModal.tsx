import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { closeModal } from '../../../store/slices/modalSlice';
import { loadCart } from '../../../store/slices/cartSlice';
import { removeDraftOrder } from '../../../store/slices/salesSlice';
import { 
  FileText, 
  Search, 
  X, 
  Clock, 
  Play, 
  Trash2, 
  Printer
} from 'lucide-react';
import { formatBDT } from '../../../utils/currencyFormatter';
import { DraftOrder } from '../../../types/sales.types';

export const DraftBillsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.isDraftBillsModalOpen);
  const draftOrders = useAppSelector((state) => state.sales.draftOrders);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredDrafts = draftOrders.filter(
    (d) =>
      d.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      d.holdReason.toLowerCase().includes(search.toLowerCase())
  );

  const totalHeldAmount = draftOrders.reduce((sum, d) => sum + d.grandTotal, 0);

  const handleResume = (draft: DraftOrder) => {
    dispatch(
      loadCart({
        items: draft.items,
        customer: draft.customer,
        discount: draft.appliedDiscount,
      })
    );
    dispatch(removeDraftOrder(draft.id));
    dispatch(closeModal('draftBills'));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Discard this held draft order?')) {
      dispatch(removeDraftOrder(id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto select-none antialiased">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(closeModal('draftBills'))}
      />

      {/* Main Dialog Card */}
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-[#1E3A8A] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Draft Bills (On-Hold)</h3>
                <span className="px-2 py-0.2 rounded-full bg-blue-50 border border-blue-200 text-[#1E3A8A] text-[11px] font-semibold">
                  {draftOrders.length}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search draft..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-6 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#1E3A8A]"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => dispatch(closeModal('draftBills'))}
              className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Draft Items List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-slate-100">
          {filteredDrafts.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">No Draft Orders</p>
              <p className="text-[11px] text-slate-400 mt-0.5">No held customer bills found.</p>
            </div>
          ) : (
            filteredDrafts.map((draft) => (
              <div
                key={draft.id}
                className="pt-2 first:pt-0 flex items-center justify-between gap-3 p-2 hover:bg-slate-50/80 rounded-xl transition-colors"
              >
                {/* Left: Token & Customer */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200/70">
                      {draft.orderNumber}
                    </span>
                    <span className="font-semibold text-xs text-slate-800 truncate">
                      {draft.customer.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {draft.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 truncate">
                    <span className="font-medium text-slate-600">{draft.itemCount} items</span> • {draft.holdReason || 'Held at counter'}
                  </p>
                </div>

                {/* Right: Total & Action */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-slate-900 block leading-tight">
                      {formatBDT(draft.grandTotal, false)} <span className="text-[10px] text-slate-500 font-sans font-normal">BDT</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      VAT: {formatBDT(draft.vatAmount, false)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDelete(draft.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Draft"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleResume(draft)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-bold transition-all shadow-2xs active:scale-95"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Resume</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between text-xs text-slate-600">
          <div>
            <span>Total Held: </span>
            <strong className="text-slate-900 font-bold font-mono">
              {formatBDT(totalHeldAmount, false)} BDT
            </strong>
          </div>

          <button
            onClick={() => dispatch(closeModal('draftBills'))}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
