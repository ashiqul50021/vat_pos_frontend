import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { closeModal, openModal, setActiveInvoice } from '../../../store/slices/modalSlice';
import { setTransactions } from '../../../store/slices/salesSlice';
import { posClient } from '../../../api/posClient';
import { 
  Receipt, 
  Search, 
  X, 
  Clock, 
  FileText, 
  Printer, 
  Eye,
  Loader2
} from 'lucide-react';
import { formatBDT } from '../../../utils/currencyFormatter';
import { Mushak63Invoice } from '../../../types/invoice.types';

interface RecentTransactionItem {
  id: string;
  invoiceNo: string;
  timeAgo: string;
  mushakNo: string;
  customerName: string;
  itemCount: number;
  paymentType: 'cash' | 'card' | 'mfs' | 'split';
  paymentLabel: string;
  grandTotal: number;
  vatAmount: number;
  fullInvoice: Mushak63Invoice;
}

export const RecentTransactionsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.isRecentTransactionsModalOpen);
  const [search, setSearch] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'cash' | 'card' | 'mfs'>('all');
  const [loading, setLoading] = useState(false);

  const dynamicTransactions = useAppSelector((state) => state.sales.transactions);

  useEffect(() => {
    if (!isOpen) return;
    const fetchSales = async () => {
      try {
        setLoading(true);
        const res = await posClient.getSalesHistory();
        if (res?.data && Array.isArray(res.data)) {
          const mapped = res.data.map((item: any) => {
            const saleItems = Array.isArray(item.items) && item.items.length > 0
              ? item.items
              : [
                  {
                    serialNo: 1,
                    productName: 'POS Sold Product',
                    hsCode: 'N/A',
                    unit: 'pcs',
                    quantity: item.item_count || 1,
                    unitPrice: Number(item.sub_total) || Number(item.total_amount),
                    totalPriceExclusive: Number(item.sub_total) || 0,
                    supplementaryDutyRate: 0,
                    supplementaryDutyAmount: 0,
                    vatRate: 0.15,
                    vatAmount: Number(item.vat) || 0,
                    totalPriceInclusive: Number(item.total_amount) || 0,
                  },
                ];

            const fullInvoice: Mushak63Invoice = {
              invoiceNumber: item.invoice_no || item.sales_code,
              mushakChallanNo: item.challan_no || `NBR-M6.3-${item.sales_code}`,
              sdmsCloudTxId: `SDMS-${item.sales_code}`,
              qrVerificationUrl: `https://vat.nbr.gov.bd/sdms/verify?id=${item.sales_code}`,
              issueDateTime: item.challan_date || 'Earlier today',
              counterCode: item.counter_name || 'POS-T01',
              cashierName: 'Super Admin',
              seller: item.seller || {
                registeredName: 'NEXVAT SUPERSTORE',
                bin: '000000000-0000',
                address: 'Dhaka, Bangladesh',
                circleName: 'Circle-04 (Gulshan)',
                commissionerate: 'Customs, Excise & VAT Commissionerate',
                phone: '+880 2 000000',
              },
              buyer: {
                type: item.user_type === 'walk_in' ? 'walk_in' : 'registered',
                name: item.customer_name || 'Walk-In Regular Customer',
                phone: item.customer_phone || '',
                taxId: item.customer_tax_id || '',
              },
              items: saleItems,
              totalExclusiveAmount: Number(item.sub_total) || 0,
              totalSupplementaryDuty: Number(item.sd) || 0,
              totalVatAmount: Number(item.vat) || 0,
              discountAmount: 0,
              payableGrossAmount: Number(item.total_amount) || 0,
              amountInBengaliWords: '',
              amountInEnglishWords: '',
              payment: {
                method: (item.payment_method?.toLowerCase() === 'card' ? 'card' : item.payment_method?.toLowerCase() === 'mfs' || item.payment_method?.toLowerCase() === 'bkash' ? 'mfs' : item.payment_method?.toLowerCase() === 'split' ? 'split' : 'cash') as any,
                amountPaid: Number(item.total_amount) || 0,
                changeGiven: 0,
              },
              isNbrSynced: true,
            };

            return {
              id: String(item.id),
              invoiceNo: item.invoice_no || item.sales_code,
              mushakNo: item.challan_no || `NBR-M6.3-${item.sales_code}`,
              timestamp: item.challan_date || 'Earlier today',
              customerName: item.customer_name || 'Walk-In Regular Customer',
              subtotal: Number(item.sub_total) || 0,
              vatAmount: Number(item.vat) || 0,
              discountAmount: 0,
              grandTotal: Number(item.total_amount) || 0,
              paymentMethod: (item.payment_method?.toLowerCase() === 'card' ? 'card' : item.payment_method?.toLowerCase() === 'mfs' || item.payment_method?.toLowerCase() === 'bkash' ? 'mfs' : item.payment_method?.toLowerCase() === 'split' ? 'split' : 'cash') as any,
              itemCount: item.item_count || 1,
              items: [],
              fullInvoice,
            };
          });
          dispatch(setTransactions(mapped));
        }
      } catch (err) {
        console.error('Failed to fetch sales history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [isOpen, dispatch]);

  const transactions: RecentTransactionItem[] = dynamicTransactions.map((tx) => ({
    id: tx.id,
    invoiceNo: tx.invoiceNo,
    timeAgo: tx.timestamp,
    mushakNo: tx.mushakNo,
    customerName: tx.customerName || 'Walk-in Customer',
    itemCount: tx.itemCount,
    paymentType: tx.paymentMethod,
    paymentLabel: tx.paymentMethod === 'cash' ? 'Cash' : tx.paymentMethod === 'card' ? 'Card' : tx.paymentMethod === 'mfs' ? 'bKash / MFS' : 'Split Pay',
    grandTotal: tx.grandTotal,
    vatAmount: tx.vatAmount,
    fullInvoice: tx.fullInvoice,
  }));

  if (!isOpen) return null;

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      tx.mushakNo.toLowerCase().includes(search.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(search.toLowerCase());

    const matchesMethod =
      selectedMethod === 'all'
        ? true
        : selectedMethod === 'cash'
        ? tx.paymentType === 'cash'
        : selectedMethod === 'card'
        ? tx.paymentType === 'card'
        : tx.paymentType === 'mfs';

    return matchesSearch && matchesMethod;
  });

  const handleOpenChallan = (invoice: Mushak63Invoice) => {
    dispatch(setActiveInvoice(invoice));
    dispatch(closeModal('recentTransactions'));
    dispatch(openModal('invoice'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto select-none antialiased">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(closeModal('recentTransactions'))}
      />

      {/* Main Dialog Card */}
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-[#1E3A8A] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
                <span className="px-2 py-0.2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                  Today: {transactions.length}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => dispatch(closeModal('recentTransactions'))}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-5 py-2.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
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

          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
            {(['all', 'cash', 'card', 'mfs'] as const).map((method) => (
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

        {/* Transactions List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <Loader2 className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-600">Loading transactions...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">No Transactions Found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try searching with a different keyword.</p>
            </div>
          ) : (
            filtered.map((tx) => (
              <div
                key={tx.id}
                className="pt-2 first:pt-0 flex items-center justify-between gap-3 p-2 hover:bg-slate-50/80 rounded-xl transition-colors"
              >
                {/* Left: Invoice & Customer */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-[#1E3A8A] whitespace-nowrap shrink-0">
                      {tx.invoiceNo}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap shrink-0">
                      {tx.mushakNo}
                    </span>
                    <span className="font-semibold text-xs text-slate-800 truncate">
                      {tx.customerName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 whitespace-nowrap shrink-0">
                      <Clock className="w-3 h-3" />
                      {tx.timeAgo}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span>{tx.itemCount} items</span>
                    <span>•</span>
                    <span className="capitalize font-medium text-slate-700">
                      Paid via {tx.paymentLabel}
                    </span>
                    <span>•</span>
                    <span className="text-slate-400 font-mono">VAT: +{formatBDT(tx.vatAmount, false)}</span>
                  </div>
                </div>

                {/* Right: Total & Action Button */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-slate-900 block leading-tight">
                      {formatBDT(tx.grandTotal, false)} <span className="text-[10px] text-slate-500 font-sans font-normal">BDT</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenChallan(tx.fullInvoice)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-blue-200 text-xs font-semibold transition-all shadow-2xs active:scale-95"
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
          <div>
            <span>Shift Sales: </span>
            <strong className="text-slate-900 font-bold font-mono">
              {formatBDT(transactions.reduce((acc, t) => acc + t.grandTotal, 0), false)} BDT
            </strong>
          </div>

          <button
            onClick={() => dispatch(closeModal('recentTransactions'))}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
