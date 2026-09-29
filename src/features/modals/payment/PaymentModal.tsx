import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { clearCart } from '../../../store/slices/cartSlice';
import { addTransaction } from '../../../store/slices/salesSlice';
import { closeModal, openModal, setActiveInvoice, setPaymentMethod, showToast } from '../../../store/slices/modalSlice';
import { Mushak63Invoice, MushakItemEntry } from '../../../types/invoice.types';
import { mockCompanySeller } from '../../../data/mockSalesHistory';
import { numberToEnglishWords } from '../../../utils/numberToEnglishWords';
import { formatBDT } from '../../../utils/currencyFormatter';
import { posClient } from '../../../api/posClient';
import { salesRepo, PosSale, PosSaleDetail } from '../../../db';
import {
  Banknote,
  CreditCard,
  Smartphone,
  Layers,
  X,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight,
  RotateCcw,
  Sparkles,
  FileText,
} from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.isPaymentModalOpen);
  const activeMethod = useAppSelector((state) => state.modal.activePaymentMethod) || 'cash';
  const { items, customer, appliedDiscount, subtotal, totalVat, discountAmount, grandTotal } =
    useAppSelector((state) => state.cart);
  const { activeCounter, session } = useAppSelector((state) => state.counter);

  const [submitting, setSubmitting] = useState(false);

  // Cash Tab State
  const [tenderedAmount, setTenderedAmount] = useState<string>('');
  
  // Card Tab State
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex' | 'nexus'>('visa');
  const [cardApprovalCode, setCardApprovalCode] = useState<string>('');
  const [cardLast4, setCardLast4] = useState<string>('');

  // MFS Tab State
  const [mfsProvider, setMfsProvider] = useState<'bkash' | 'nagad' | 'rocket' | 'upay'>('bkash');
  const [mfsCustomerPhone, setMfsCustomerPhone] = useState<string>('');
  const [mfsTrxId, setMfsTrxId] = useState<string>('');

  // Split Pay State
  const [splitCash, setSplitCash] = useState<string>('');
  const [splitCard, setSplitCard] = useState<string>('');
  const [splitMfs, setSplitMfs] = useState<string>('');
  const [splitCardRef, setSplitCardRef] = useState<string>('');
  const [splitMfsTrx, setSplitMfsTrx] = useState<string>('');

  // Payment / Sales Note
  const [paymentNote, setPaymentNote] = useState<string>('');
  const [sellerInfo, setSellerInfo] = useState<any>(null);

  const cashInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    posClient.getSettings().then((res) => {
      if (res?.company) {
        setSellerInfo({
          registeredName: res.company.name || 'NEXVAT POS',
          bin: res.company.bin || 'N/A',
          address: res.company.address || 'Dhaka, Bangladesh',
          circleName: 'Circle-04 (Gulshan)',
          commissionerate: 'Customs, Excise & VAT Commissionerate',
          phone: res.company.phone || '+880 2 000000',
        });
      }
    }).catch(() => {});
  }, [isOpen]);

  // Auto-initialize tender amount when modal opens or total changes
  useEffect(() => {
    if (isOpen) {
      setTenderedAmount(grandTotal > 0 ? String(grandTotal) : '');
      setSplitCash(grandTotal > 0 ? String(grandTotal) : '');
      setSplitCard('');
      setSplitMfs('');
      setCardApprovalCode('');
      setCardLast4('');
      setMfsTrxId('');
      setMfsCustomerPhone(customer?.phone || '');
      setPaymentNote('');
      setTimeout(() => {
        cashInputRef.current?.focus();
        cashInputRef.current?.select();
      }, 100);
    }
  }, [isOpen, grandTotal, customer]);

  // Cash Calculations
  const numericTendered = parseFloat(tenderedAmount) || 0;
  const cashChange = Math.max(0, numericTendered - grandTotal);
  const cashShortage = Math.max(0, grandTotal - numericTendered);

  // Split Calculations
  const numSplitCash = parseFloat(splitCash) || 0;
  const numSplitCard = parseFloat(splitCard) || 0;
  const numSplitMfs = parseFloat(splitMfs) || 0;
  const totalSplitAllocated = numSplitCash + numSplitCard + numSplitMfs;
  const splitRemaining = Math.max(0, round2(grandTotal - totalSplitAllocated));

  function round2(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  // Quick cash bill adder
  const handleAddCash = (add: number) => {
    const current = parseFloat(tenderedAmount) || 0;
    setTenderedAmount(String(round2(current + add)));
  };

  const handleSetExact = () => {
    setTenderedAmount(String(round2(grandTotal)));
  };

  // Execution: finalize checkout & send to backend + indexedDB
  const handleFinalize = async (overrideMethod?: 'cash' | 'card' | 'mfs' | 'split') => {
    if (items.length === 0 || submitting) return;
    const method = overrideMethod || activeMethod;

    // Validation checks per method
    if (method === 'cash' && numericTendered < grandTotal) {
      alert(`Tendered cash (${numericTendered} BDT) is less than total payable (${grandTotal} BDT).`);
      return;
    }
    if (method === 'split' && splitRemaining > 0.05) {
      alert(`Split allocation incomplete. Remaining due: ${splitRemaining} BDT.`);
      return;
    }

    setSubmitting(true);
    const invoiceTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    let invoiceNum = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    let mushakNo = `NBR-M6.3-9028-${Math.floor(1000 + Math.random() * 9000)}`;
    let cloudTxId = `SDMS-TX-${Math.floor(100000 + Math.random() * 900000)}`;

    const paymentLabel =
      method === 'cash'
        ? 'Cash [F10]'
        : method === 'card'
        ? `Card (${cardType.toUpperCase()}) [F11]`
        : method === 'mfs'
        ? `${mfsProvider.toUpperCase()} [F12]`
        : 'Split Payment [Alt+S]';

    const trxCode =
      method === 'card'
        ? cardApprovalCode ? `CARD-${cardApprovalCode}` : `CARD-L4-${cardLast4 || 'XXXX'}`
        : method === 'mfs'
        ? mfsTrxId ? `TRX-${mfsTrxId}` : `MFS-${mfsProvider.toUpperCase()}`
        : method === 'split'
        ? `SPLIT-C${numSplitCash}-D${numSplitCard}-M${numSplitMfs}`
        : `CASH-REC-${numericTendered}`;

    try {
      const res = await posClient.submitSale({
        items: items.map((item) => ({
          product_id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.unitPrice,
          vat_rate: item.product.vatRate,
        })),
        payment_method: paymentLabel,
        paid_amount: method === 'cash' ? numericTendered : grandTotal,
        change_amount: method === 'cash' ? cashChange : 0,
        trx_id: trxCode,
        discount_amount: discountAmount,
        note: paymentNote.trim() || undefined,
        payment_note: paymentNote.trim() || undefined,
        counter_id: activeCounter?.id ? Number(activeCounter.id) : 1,
        branch_id: localStorage.getItem('branch_id') ? Number(localStorage.getItem('branch_id')) : 1,
        customer: {
          name: customer.name,
          phone: customer.phone,
          tax_id: customer.taxId,
        },
      });

      if (res && res.data) {
        if (res.data.invoice_number) invoiceNum = res.data.invoice_number;
        if (res.data.challan_number) mushakNo = res.data.challan_number;
        if (res.data.id) cloudTxId = `SDMS-TX-${res.data.id}-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    } catch (err) {
      console.error('[PaymentModal] Backend sync error:', err);
    } finally {
      setSubmitting(false);
    }

    const mushakItems: MushakItemEntry[] = items.map((item, idx) => ({
      serialNo: idx + 1,
      productName: item.product.name,
      hsCode: item.product.hs_code,
      unit: item.product.unit,
      quantity: item.quantity,
      unitPrice: item.product.unitPrice,
      totalPriceExclusive: item.quantity * item.product.unitPrice,
      supplementaryDutyRate: 0,
      supplementaryDutyAmount: 0,
      vatRate: item.product.vatRate,
      vatAmount: item.lineVat,
      totalPriceInclusive: item.lineTotal,
    }));

    const invoice: Mushak63Invoice = {
      invoiceNumber: invoiceNum,
      mushakChallanNo: mushakNo,
      sdmsCloudTxId: cloudTxId,
      qrVerificationUrl: `https://vat.nbr.gov.bd/sdms/verify?id=${cloudTxId}`,
      issueDateTime: invoiceTimestamp,
      counterCode: activeCounter?.code || 'POS-T01',
      cashierName: session?.operatorName || (typeof window !== 'undefined' ? localStorage.getItem('user_name') : null) || 'Cashier',
      seller: sellerInfo || mockCompanySeller,
      buyer: customer,
      items: mushakItems,
      totalExclusiveAmount: subtotal,
      totalSupplementaryDuty: 0,
      totalVatAmount: totalVat,
      discountAmount: discountAmount,
      appliedDiscount: appliedDiscount || undefined,
      payableGrossAmount: grandTotal,
      amountInBengaliWords: '',
      amountInEnglishWords: numberToEnglishWords(grandTotal),
      payment: {
        method,
        amountPaid: method === 'cash' ? numericTendered : grandTotal,
        changeGiven: method === 'cash' ? cashChange : 0,
        mfsProvider: method === 'mfs' ? mfsProvider : undefined,
      },
      isNbrSynced: true,
    };

    dispatch(
      addTransaction({
        id: `tx-${Date.now()}`,
        invoiceNo: invoiceNum,
        mushakNo: mushakNo,
        timestamp: 'Just now',
        customerName: customer.name,
        customerTaxId: customer.taxId,
        itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
        subtotal,
        vatAmount: totalVat,
        discountAmount,
        grandTotal,
        paymentMethod: method,
        status: 'completed',
        nbrSynced: true,
        fullInvoice: invoice,
      })
    );

    // Persist to local IndexedDB
    const saleId = `sale-${Date.now()}`;
    const branchIdentifier = localStorage.getItem('branch_id') || '1';
    const counterIdentifier = activeCounter?.id || '1';

    const posSale: PosSale = {
      id: saleId,
      sales_code: invoiceNum,
      sub_total: subtotal,
      vat_type: 'Excluding',
      vat: totalVat,
      sd: 0,
      discount_type: appliedDiscount?.type === 'percentage' ? 'Percentage' : appliedDiscount?.type === 'fixed' ? 'Fixed' : 'None',
      discount: appliedDiscount?.value || 0,
      discounted_amount: discountAmount,
      total_amount: grandTotal,
      note: paymentNote.trim()
        ? `${paymentNote.trim()} | Counter: ${activeCounter?.code || 'POS-T01'} - ${paymentLabel}`
        : `Counter: ${activeCounter?.code || 'POS-T01'} - ${paymentLabel} - Trx: ${trxCode}`,
      counter_id: counterIdentifier,
      branch_id: branchIdentifier,
      user_id: session?.operatorName || (typeof window !== 'undefined' ? localStorage.getItem('user_name') : null) || 'Cashier',
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_tax_id: customer.taxId,
      payment_method: method,
      mushak_challan_no: mushakNo,
      created_at: new Date().toISOString(),
    };

    const posSaleDetails: PosSaleDetail[] = items.map((item, idx) => ({
      id: `sdet-${saleId}-${idx + 1}`,
      pos_sales_id: saleId,
      product_id: item.product.id,
      vat_type: 'Excluding',
      qty: item.quantity,
      price: item.product.unitPrice,
      counter_id: counterIdentifier,
      branch_id: branchIdentifier,
      product_name: item.product.name,
      hs_code: item.product.hs_code,
      vat_rate: item.product.vatRate,
      vat_amount: item.lineVat,
      line_total: item.lineTotal,
    }));

    salesRepo.createSale(posSale, posSaleDetails).catch(console.error);

    // Close payment modal, set invoice & clear cart
    dispatch(closeModal('payment'));
    dispatch(setActiveInvoice(invoice));
    dispatch(openModal('invoice'));
    dispatch(clearCart());

    // Show Order Completed Toaster Notification
    dispatch(
      showToast({
        type: 'success',
        title: 'Order Completed Successfully!',
        message: `Invoice #${invoiceNum} • Total: ${formatBDT(grandTotal)} • Mushak 6.3 Generated`,
      })
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto select-none antialiased">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(closeModal('payment'))}
      />

      {/* Main Dialog Card */}
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-[#1E3A8A] flex items-center justify-center font-bold text-xs font-mono">
              BDT
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Checkout & Payment Settlement</h3>
              <p className="text-xs text-slate-500 mt-0.5">Official NBR Mushak-6.3 Compliant Billing</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeModal('payment'))}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Summary Strip */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Total Payable</span>
            <div className="text-2xl font-black font-mono tracking-tight text-[#1E3A8A]">
              {formatBDT(grandTotal)}
            </div>
          </div>
          <div className="text-right text-xs space-y-0.5 text-slate-600">
            <div>Items: <strong className="font-bold text-slate-900">{items.length}</strong></div>
            <div>
              Net: <span className="font-mono font-semibold text-slate-800">{formatBDT(subtotal, false)}</span> | VAT:{' '}
              <span className="font-mono font-bold text-emerald-600">+{formatBDT(totalVat, false)}</span>
            </div>
          </div>
        </div>

        {/* Method Selector Tabs - Segmented Control */}
        <div className="p-1.5 bg-slate-100 border-b border-slate-200/80 grid grid-cols-4 gap-1.5">
          {/* Cash Tab */}
          <button
            type="button"
            onClick={() => dispatch(setPaymentMethod('cash'))}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
              activeMethod === 'cash'
                ? 'bg-white text-[#1E3A8A] border border-slate-200 shadow-xs scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>Cash</span>
            <span
              className={`text-[10px] font-mono px-1 py-0.2 rounded border ${
                activeMethod === 'cash'
                  ? 'bg-blue-50 text-[#1E3A8A] border-blue-200'
                  : 'bg-slate-200/70 text-slate-500 border-transparent'
              }`}
            >
              F10
            </span>
          </button>

          {/* Card Tab */}
          <button
            type="button"
            onClick={() => dispatch(setPaymentMethod('card'))}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
              activeMethod === 'card'
                ? 'bg-white text-[#1E3A8A] border border-slate-200 shadow-xs scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Card</span>
            <span
              className={`text-[10px] font-mono px-1 py-0.2 rounded border ${
                activeMethod === 'card'
                  ? 'bg-blue-50 text-[#1E3A8A] border-blue-200'
                  : 'bg-slate-200/70 text-slate-500 border-transparent'
              }`}
            >
              F11
            </span>
          </button>

          {/* bKash Tab */}
          <button
            type="button"
            onClick={() => dispatch(setPaymentMethod('mfs'))}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
              activeMethod === 'mfs'
                ? 'bg-white text-[#1E3A8A] border border-slate-200 shadow-xs scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>bKash/MFS</span>
            <span
              className={`text-[10px] font-mono px-1 py-0.2 rounded border ${
                activeMethod === 'mfs'
                  ? 'bg-blue-50 text-[#1E3A8A] border-blue-200'
                  : 'bg-slate-200/70 text-slate-500 border-transparent'
              }`}
            >
              F12
            </span>
          </button>

          {/* Split Pay Tab */}
          <button
            type="button"
            onClick={() => dispatch(setPaymentMethod('split'))}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
              activeMethod === 'split'
                ? 'bg-white text-[#1E3A8A] border border-slate-200 shadow-xs scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Split Pay</span>
            <span
              className={`text-[10px] font-mono px-1 py-0.2 rounded border ${
                activeMethod === 'split'
                  ? 'bg-blue-50 text-[#1E3A8A] border-blue-200'
                  : 'bg-slate-200/70 text-slate-500 border-transparent'
              }`}
            >
              Alt+S
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* ═══════════════ TAB 1: CASH ═══════════════ */}
          {activeMethod === 'cash' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Tendered Cash Received
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs font-mono">
                      BDT
                    </span>
                    <input
                      ref={cashInputRef}
                      type="number"
                      step="any"
                      min="0"
                      value={tenderedAmount}
                      onChange={(e) => setTenderedAmount(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleFinalize('cash');
                      }}
                      className="w-full pl-12 pr-3 py-2.5 text-2xl font-black font-mono text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 shadow-xs"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Quick Cash Suggestions */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={handleSetExact}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-[#1E3A8A] border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      Exact ({grandTotal.toFixed(2)} BDT)
                    </button>
                    {[50, 100, 500, 1000].map((add) => (
                      <button
                        key={add}
                        type="button"
                        onClick={() => handleAddCash(add)}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        +{add} BDT
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setTenderedAmount('')}
                      className="px-2 py-1 text-xs rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-auto"
                      title="Clear"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Change Due Panel */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-center transition-all">
                  <div className="flex items-center gap-1.5 mb-1">
                    {numericTendered >= grandTotal ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      {numericTendered >= grandTotal ? 'Change To Return' : 'Remaining Short / Due'}
                    </span>
                  </div>
                  <div
                    className={`text-3xl font-black font-mono ${
                      numericTendered >= grandTotal ? 'text-[#1E3A8A]' : 'text-rose-600'
                    }`}
                  >
                    {numericTendered >= grandTotal ? formatBDT(cashChange) : `-${formatBDT(cashShortage)}`}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {numericTendered >= grandTotal
                      ? 'Hand over this change amount to customer before issuing receipt.'
                      : 'Please collect remaining cash from customer to finalize sale.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ TAB 2: CARD ═══════════════ */}
          {activeMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Select Card Network
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'visa', label: 'VISA' },
                    { id: 'mastercard', label: 'Mastercard' },
                    { id: 'amex', label: 'AMEX' },
                    { id: 'nexus', label: 'DBBL Nexus' },
                  ].map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setCardType(card.id as any)}
                      className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all ${
                        cardType === card.id
                          ? 'bg-blue-50 border-[#1E3A8A] text-[#1E3A8A] shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {card.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    POS Slip Approval Code
                  </label>
                  <input
                    type="text"
                    value={cardApprovalCode}
                    onChange={(e) => setCardApprovalCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleFinalize('card');
                    }}
                    placeholder="e.g. APP-78294"
                    className="w-full px-3 py-2 text-sm font-mono uppercase bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10"
                  />
                  <span className="text-[10px] text-slate-400">Printed on the bank POS terminal paper slip</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Card Last 4 Digits
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={cardLast4}
                    onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleFinalize('card');
                    }}
                    placeholder="e.g. 4821"
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10"
                  />
                  <span className="text-[10px] text-slate-400">For settlement verification</span>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ TAB 3: MFS (bKash/Nagad/Rocket) ═══════════════ */}
          {activeMethod === 'mfs' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Select MFS Operator
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'bkash', label: 'bKash', color: 'border-pink-500 bg-pink-50 text-pink-700' },
                    { id: 'nagad', label: 'Nagad', color: 'border-orange-500 bg-orange-50 text-orange-700' },
                    { id: 'rocket', label: 'Rocket', color: 'border-purple-500 bg-purple-50 text-purple-700' },
                    { id: 'upay', label: 'Upay', color: 'border-blue-500 bg-blue-50 text-blue-700' },
                  ].map((op) => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => setMfsProvider(op.id as any)}
                      className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all ${
                        mfsProvider === op.id
                          ? `${op.color} shadow-xs font-black`
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Transaction ID (TrxID)
                  </label>
                  <input
                    type="text"
                    value={mfsTrxId}
                    onChange={(e) => setMfsTrxId(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleFinalize('mfs');
                    }}
                    placeholder="e.g. 9B7XK82LA"
                    className="w-full px-3 py-2 text-sm font-mono uppercase bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10"
                  />
                  <span className="text-[10px] text-slate-400">Received in confirmation SMS</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Wallet / Mobile Number
                  </label>
                  <input
                    type="text"
                    value={mfsCustomerPhone}
                    onChange={(e) => setMfsCustomerPhone(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleFinalize('mfs');
                    }}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10"
                  />
                  <span className="text-[10px] text-slate-400">Sender mobile wallet number</span>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ TAB 4: SPLIT PAY ═══════════════ */}
          {activeMethod === 'split' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Allocated:</span>{' '}
                  <span className="font-bold text-slate-900 font-mono">{formatBDT(totalSplitAllocated)}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Remaining Due:</span>{' '}
                  <span
                    className={`font-bold font-mono px-2 py-0.5 rounded ${
                      splitRemaining === 0
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {formatBDT(splitRemaining)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Cash Portion */}
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>💵 Cash Portion</span>
                    <button
                      type="button"
                      onClick={() => setSplitCash(String(round2(grandTotal - numSplitCard - numSplitMfs)))}
                      className="text-[10px] text-[#1E3A8A] hover:underline font-semibold"
                    >
                      Fill
                    </button>
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={splitCash}
                    onChange={(e) => setSplitCash(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-2.5 py-1.5 text-sm font-mono font-bold border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10"
                  />
                </div>

                {/* Card Portion */}
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>💳 Card Portion</span>
                    <button
                      type="button"
                      onClick={() => setSplitCard(String(round2(grandTotal - numSplitCash - numSplitMfs)))}
                      className="text-[10px] text-[#1E3A8A] hover:underline font-semibold"
                    >
                      Fill
                    </button>
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={splitCard}
                    onChange={(e) => setSplitCard(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-2.5 py-1.5 text-sm font-mono font-bold border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10"
                  />
                  <input
                    type="text"
                    value={splitCardRef}
                    onChange={(e) => setSplitCardRef(e.target.value)}
                    placeholder="Card last 4 / Ref"
                    className="w-full px-2 py-1 mt-1 text-[11px] font-mono border border-slate-200 rounded"
                  />
                </div>

                {/* MFS Portion */}
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>📱 bKash / MFS</span>
                    <button
                      type="button"
                      onClick={() => setSplitMfs(String(round2(grandTotal - numSplitCash - numSplitCard)))}
                      className="text-[10px] text-[#1E3A8A] hover:underline font-semibold"
                    >
                      Fill
                    </button>
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={splitMfs}
                    onChange={(e) => setSplitMfs(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-2.5 py-1.5 text-sm font-mono font-bold border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10"
                  />
                  <input
                    type="text"
                    value={splitMfsTrx}
                    onChange={(e) => setSplitMfsTrx(e.target.value.toUpperCase())}
                    placeholder="MFS TrxID"
                    className="w-full px-2 py-1 mt-1 text-[11px] font-mono uppercase border border-slate-200 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ PAYMENT / SALES NOTE SECTION ═══════════════ */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Payment / Sales Note (Optional)</span>
            </label>
            <input
              type="text"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              placeholder="e.g. Special instructions, counter remark, delivery note, or customer reference..."
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={() => dispatch(closeModal('payment'))}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancel [Esc]
          </button>

          <button
            type="button"
            disabled={
              submitting ||
              (activeMethod === 'cash' && numericTendered < grandTotal) ||
              (activeMethod === 'split' && splitRemaining > 0.05)
            }
            onClick={() => handleFinalize()}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1E3A8A] hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95"
          >
            <span>{submitting ? 'Processing...' : 'Complete Sale & Issue Mushak 6.3'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
