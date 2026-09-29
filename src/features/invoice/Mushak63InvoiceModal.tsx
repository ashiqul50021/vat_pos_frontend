import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closeModal } from '../../store/slices/modalSlice';
import { 
  Printer, 
  X, 
  CheckCircle2, 
  Receipt,
  Download
} from 'lucide-react';
import { formatBDT } from '../../utils/currencyFormatter';
import { mockSampleInvoice } from '../../data/mockSalesHistory';

import { printElement } from '../../utils/printElement';

export const Mushak63InvoiceModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.isInvoiceModalOpen);
  const activeInvoice = useAppSelector((state) => state.modal.activeInvoice);

  if (!isOpen) return null;

  const invoice = activeInvoice || mockSampleInvoice;

  const handlePrint = () => {
    printElement('printable-mushak-invoice');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto select-none antialiased">
      {/* Backdrop */}
      <div 
        className="no-print fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(closeModal('invoice'))}
      />

      {/* Main Dialog Card */}
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150 print:border-none print:shadow-none print:max-h-none print:rounded-none">
        {/* Header */}
        <div className="no-print flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-[#1E3A8A] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Tax Invoice (Mushak 6.3)</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Mushak 6.3 Synced
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {invoice.invoiceNumber} • {invoice.mushakChallanNo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-semibold transition-all shadow-2xs active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={() => dispatch(closeModal('invoice'))}
              className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div id="printable-mushak-invoice" className="p-6 overflow-y-auto space-y-4 flex-1 bg-white text-slate-800 text-xs">
          {/* Seller / Store Header */}
          <div className="text-center pb-3 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              {invoice.seller?.registeredName || 'NEXVAT SUPERMARKET & RETAIL LTD.'}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {invoice.seller?.address || 'Plot 42, Gulshan Avenue, Dhaka-1212'}
            </p>
            <p className="text-[11px] text-slate-600 font-mono mt-0.5">
              BIN: <strong>{invoice.seller?.bin || '002918274-0101'}</strong> • Tel: {invoice.seller?.phone || '+880 2 9884120'}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[11px]">
            <div>
              <p className="text-slate-400 uppercase text-[10px] font-bold">Customer Details</p>
              <p className="font-bold text-slate-800 mt-0.5">{invoice.buyer.name || 'Walk-in Customer'}</p>
              {invoice.buyer.phone && <p className="text-slate-500 font-mono">{invoice.buyer.phone}</p>}
              {invoice.buyer.taxId && <p className="text-emerald-700 font-mono font-medium">Tax ID: {invoice.buyer.taxId}</p>}
            </div>

            <div className="text-right">
              <p className="text-slate-400 uppercase text-[10px] font-bold">Invoice & Date</p>
              <p className="font-mono font-bold text-slate-800 mt-0.5">{invoice.mushakChallanNo}</p>
              <p className="text-slate-500 font-mono">{invoice.issueDateTime || 'Today'}</p>
              <p className="text-slate-500">Terminal: {invoice.counterCode} • {invoice.cashierName}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200/80 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Item</th>
                  <th className="py-2 px-2 text-center">Qty</th>
                  <th className="py-2 px-2 text-right">Price</th>
                  <th className="py-2 px-2 text-center">VAT</th>
                  <th className="py-2 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3">
                      <p className="font-bold text-slate-800 text-[11px] leading-tight">{item.productName}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">HS: {item.hsCode}</p>
                    </td>
                    <td className="py-2 px-2 text-center font-mono text-[11px]">{item.quantity}</td>
                    <td className="py-2 px-2 text-right font-mono text-[11px]">{formatBDT(item.unitPrice, false)}</td>
                    <td className="py-2 px-2 text-center text-slate-500 text-[11px]">
                      {(item.vatRate * 100).toFixed(0)}%
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 text-[11px]">
                      {formatBDT(item.totalPriceInclusive, false)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal (Net)</span>
              <span className="font-mono font-semibold text-slate-800">{formatBDT(invoice.totalExclusiveAmount, false)} BDT</span>
            </div>

            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount Deduction</span>
                <span className="font-mono font-bold">-{formatBDT(invoice.discountAmount, false)} BDT</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Total VAT (Mushak 6.3)</span>
              <span className="font-mono font-semibold text-emerald-700">+{formatBDT(invoice.totalVatAmount, false)} BDT</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <div>
                <span className="font-black text-slate-900 text-xs tracking-wider uppercase">Net Payable Gross</span>
                <p className="text-[10px] text-slate-400">Inclusive of Government VAT</p>
              </div>
              <span className="text-lg font-black text-[#1E3A8A] font-mono">
                {formatBDT(invoice.payableGrossAmount, false)} <span className="text-xs font-normal text-slate-500 font-sans">BDT</span>
              </span>
            </div>

            {(invoice.amountInEnglishWords || invoice.amountInBengaliWords) && (
              <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                In Words: {invoice.amountInEnglishWords || invoice.amountInBengaliWords}
              </p>
            )}
          </div>

          {/* Footer Note */}
          <div className="pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400 space-y-0.5">
            <p>Thank you for shopping with us!</p>
            <p className="font-mono text-[9px]">Software: NEXVAT POS v4.2</p>
          </div>
        </div>

        {/* Footer */}
        <div className="no-print px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            Press [Esc] to Close
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(closeModal('invoice'))}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition-colors"
            >
              Close
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold transition-all shadow-2xs active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
