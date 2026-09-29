import React, { useState } from 'react';
import { CustomerBar } from './cart/CustomerBar';
import { BarcodeScannerInput } from './cart/BarcodeScannerInput';
import { CartItemsTable } from './cart/CartItemsTable';
import { OrderSummaryCard } from './cart/OrderSummaryCard';
import { ActionToolbar } from './actions/ActionToolbar';
import { PaymentKeypad } from './actions/PaymentKeypad';
import { ProductCatalog } from './catalog/ProductCatalog';
import { Toast, ToastMessage } from '../../components/feedback/Toast';

export const PosTerminalView: React.FC = () => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showNotification = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({
      id: String(Date.now()),
      type,
      title: msg,
    });
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-3.5 p-3.5 overflow-hidden bg-[#F1F5F9]">
      {/* Left Column: Cart & Checkout Workspace */}
      <div className="w-full lg:w-[480px] xl:w-[510px] flex flex-col h-full shrink-0 select-none bg-white border border-slate-200/90 rounded-2xl shadow-xs p-3.5 overflow-hidden">
        {/* Customer Bar */}
        <CustomerBar />

        {/* Barcode / SKU Scanner */}
        <BarcodeScannerInput onScanAlert={showNotification} />

        {/* Cart Items Table */}
        <CartItemsTable />

        {/* Order Summary Financials */}
        <OrderSummaryCard />

        {/* Hold [F4], Void [F8], Add Discount */}
        <ActionToolbar onNotify={showNotification} />

        {/* Payment Buttons (Cash F10, Card F11, bKash F12, Split Alt+S) */}
        <PaymentKeypad onSaleComplete={() => showNotification('Sale recorded & Mushak-6.3 generated!')} />
      </div>

      {/* Right Column: Product Search, Category Tabs & Grid in a dedicated workspace panel */}
      <div className="flex-1 h-full min-w-0 bg-white border border-slate-200/90 rounded-2xl shadow-xs p-3.5 flex flex-col overflow-hidden">
        <ProductCatalog onItemAdded={showNotification} />
      </div>

      {/* Toast Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
