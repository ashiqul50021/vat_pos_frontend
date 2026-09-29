import React from 'react';
import { Router, useLocation } from './router';
import { CounterSelectionView } from './features/counter-selection/CounterSelectionView';
import { PosHeader } from './layouts/PosHeader';
import { PosFooter } from './layouts/PosFooter';
import { PosTerminalView } from './features/pos/PosTerminalView';
import { AddDiscountModal } from './features/modals/discount/AddDiscountModal';
import { CompletedSalesModal } from './features/modals/completed-sales/CompletedSalesModal';
import { RecentTransactionsModal } from './features/modals/recent-transactions/RecentTransactionsModal';
import { DraftBillsModal } from './features/modals/draft-bills/DraftBillsModal';
import { Mushak63InvoiceModal } from './features/invoice/Mushak63InvoiceModal';
import { PaymentModal } from './features/modals/payment/PaymentModal';
import { usePosKeyboard } from './hooks/usePosKeyboard';
import { useDatabaseInit } from './hooks/useDatabaseInit';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { hideToast } from './store/slices/modalSlice';
import { Toast } from './components/feedback/Toast';
import { UnauthorizedView } from './features/auth/UnauthorizedView';

const AppContent: React.FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const toast = useAppSelector((state) => state.modal.toast);
  usePosKeyboard();
  useDatabaseInit();

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  if (!token && pathname !== '/auth-bridge') {
    return <UnauthorizedView />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans select-none antialiased">
      {/* Active POS Cashier Billing Terminal */}
      {pathname === '/pos' ? (
        <div className="flex flex-col h-screen overflow-hidden">
          <PosHeader />
          <PosTerminalView />
          <PosFooter />
        </div>
      ) : (
        /* Default: Counter Terminal Selection Page (Select Active POS Counter) */
        <CounterSelectionView />
      )}

      {/* Screen 3: Add Discount Modal */}
      <AddDiscountModal />

      {/* Screen 4: Completed Sales & Z-Report Modal */}
      <CompletedSalesModal />

      {/* Screen 5: Recent Transactions Modal */}
      <RecentTransactionsModal />

      {/* Screen 6: Draft Bills & Held Orders Modal */}
      <DraftBillsModal />

      {/* Screen 7: Authentic Government Mushak 6.3 Tax Invoice Modal */}
      <Mushak63InvoiceModal />

      {/* Screen 8: Multi-Method Payment Settlement Modal (Cash, Card, bKash, Split) */}
      <PaymentModal />

      {/* Global Interactive Notification Toaster */}
      <Toast toast={toast} onClose={() => dispatch(hideToast())} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
