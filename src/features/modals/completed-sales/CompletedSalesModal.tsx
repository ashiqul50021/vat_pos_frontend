import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { closeModal, openModal, setActiveInvoice } from '../../../store/slices/modalSlice';
import { 
  FileCheck2, 
  X, 
  Search, 
  Printer, 
  Eye, 
  Clock
} from 'lucide-react';
import { formatBDT } from '../../../utils/currencyFormatter';
import { mockSampleInvoice } from '../../../data/mockSalesHistory';
import { Mushak63Invoice } from '../../../types/invoice.types';

interface CompletedSaleItem {
  id: string;
  invoiceNo: string;
  mushakNo: string;
  timeAgo: string;
  paymentLabel: string;
  paymentType: 'cash' | 'mfs' | 'card' | 'split';
  grandTotal: number;
  vatAmount: number;
  customerName: string;
  itemCount: number;
  fullInvoice: Mushak63Invoice;
}

export const CompletedSalesModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.isCompletedSalesModalOpen);
  const [search, setSearch] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'cash' | 'card' | 'mfs' | 'split'>('all');

  const dynamicTransactions = useAppSelector((state) => state.sales.transactions);

  const sales: CompletedSaleItem[] = dynamicTransactions.map((tx) => ({
    id: tx.id,
    invoiceNo: tx.invoiceNo,
    mushakNo: tx.mushakNo,
    timeAgo: tx.timestamp,
    paymentLabel: tx.paymentMethod === 'cash' ? 'Cash' : tx.paymentMethod === 'card' ? 'Card' : tx.paymentMethod === 'mfs' ? 'bKash' : 'Split Pay',
    paymentType: tx.paymentMethod,
    grandTotal: tx.grandTotal,
    vatAmount: tx.vatAmount,
    customerName: tx.customerName || 'Walk-in Customer',
    itemCount: tx.itemCount,
    fullInvoice: tx.fullInvoice,
  }));

  if (!isOpen) return null;

  const filtered = sales.filter((s) => {
    const matchesSearch =
      s.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      s.mushakNo.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase());

    const matchesMethod =
      selectedMethod === 'all'
        ? true
        : selectedMethod === 'cash'
        ? s.paymentType === 'cash'
        : selectedMethod === 'card'
        ? s.paymentType === 'card'
        : selectedMethod === 'mfs'
        ? s.paymentType === 'mfs'
        : s.paymentType === 'split';

    return matchesSearch && matchesMethod;
  });

  const handleOpenInvoice = (invoice: Mushak63Invoice) => {
    dispatch(setActiveInvoice(invoice));
    dispatch(closeModal('completedSales'));
    dispatch(openModal('invoice'));
  };

  const handlePrintZReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto select-none antialiased">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(closeModal('completedSales'))}
      />

      {/* Main Dialog Card */}
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Completed Sales</h3>
                <span className="px-2 py-0.2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                  Today: 142 Orders
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => dispatch(closeModal('completedSales'))}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Method Tabs */}
        <div className="px-5 py-2.5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Invoice #, Mushak or Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A]"
            />
          </div>

          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 overflow-x-auto">
            {(['all', 'cash', 'card', 'mfs', 'split'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-colors ${
                  selectedMethod === method
                    ? 'bg-[#1E3A8A] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Sales List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FileCheck2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">No Sales Found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try a different search keyword.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="pt-2 first:pt-0 flex items-center justify-between gap-3 p-2 hover:bg-slate-50/80 rounded-xl transition-colors"
              >
                {/* Left: Invoice & Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-[#1E3A8A]">
                      {item.invoiceNo}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {item.mushakNo}
                    </span>
                    <span className="font-semibold text-xs text-slate-800 truncate">
                      {item.customerName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timeAgo}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span>{item.itemCount} items</span>
                    <span>•</span>
                    <span className="capitalize font-medium text-slate-700">
                      Paid via {item.paymentLabel}
                    </span>
                    <span>•</span>
                    <span className="text-slate-400 font-mono">VAT: +{formatBDT(item.vatAmount, false)}</span>
                  </div>
                </div>

                {/* Right: Amount & Action Button */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-slate-900 block leading-tight">
                      {formatBDT(item.grandTotal, false)} <span className="text-[10px] text-slate-500 font-sans font-normal">BDT</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenInvoice(item.fullInvoice)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-semibold transition-all shadow-2xs active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Mushak 6.3</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <div>
              <span>Shift Net: </span>
              <strong className="text-slate-900 font-bold font-mono">
                186,420.00 BDT
              </strong>
            </div>
            <div className="hidden sm:block">
              <span>VAT: </span>
              <strong className="text-emerald-600 font-bold font-mono">
                +14,835.50 BDT
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintZReport}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Z-Report</span>
            </button>

            <button
              onClick={() => dispatch(closeModal('completedSales'))}
              className="px-3.5 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-blue-900 text-white font-semibold transition-colors shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
