import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Mushak63Invoice } from '../../types/invoice.types';
import { ToastMessage } from '../../components/feedback/Toast';

interface ModalState {
  isDiscountModalOpen: boolean;
  isCompletedSalesModalOpen: boolean;
  isRecentTransactionsModalOpen: boolean;
  isDraftBillsModalOpen: boolean;
  isInvoiceModalOpen: boolean;
  isHoldModalOpen: boolean;
  isPaymentModalOpen: boolean;
  activePaymentMethod: 'cash' | 'card' | 'mfs' | 'split';
  activeInvoice: Mushak63Invoice | null;
  toast: ToastMessage | null;
}

const initialState: ModalState = {
  isDiscountModalOpen: false,
  isCompletedSalesModalOpen: false,
  isRecentTransactionsModalOpen: false,
  isDraftBillsModalOpen: false,
  isInvoiceModalOpen: false,
  isHoldModalOpen: false,
  isPaymentModalOpen: false,
  activePaymentMethod: 'cash',
  activeInvoice: null,
  toast: null,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<
        | 'discount'
        | 'completedSales'
        | 'recentTransactions'
        | 'draftBills'
        | 'invoice'
        | 'hold'
        | 'payment'
      >
    ) => {
      switch (action.payload) {
        case 'discount':
          state.isDiscountModalOpen = true;
          break;
        case 'completedSales':
          state.isCompletedSalesModalOpen = true;
          break;
        case 'recentTransactions':
          state.isRecentTransactionsModalOpen = true;
          break;
        case 'draftBills':
          state.isDraftBillsModalOpen = true;
          break;
        case 'invoice':
          state.isInvoiceModalOpen = true;
          break;
        case 'hold':
          state.isHoldModalOpen = true;
          break;
        case 'payment':
          state.isPaymentModalOpen = true;
          break;
      }
    },
    closeModal: (
      state,
      action: PayloadAction<
        | 'discount'
        | 'completedSales'
        | 'recentTransactions'
        | 'draftBills'
        | 'invoice'
        | 'hold'
        | 'payment'
      >
    ) => {
      switch (action.payload) {
        case 'discount':
          state.isDiscountModalOpen = false;
          break;
        case 'completedSales':
          state.isCompletedSalesModalOpen = false;
          break;
        case 'recentTransactions':
          state.isRecentTransactionsModalOpen = false;
          break;
        case 'draftBills':
          state.isDraftBillsModalOpen = false;
          break;
        case 'invoice':
          state.isInvoiceModalOpen = false;
          break;
        case 'hold':
          state.isHoldModalOpen = false;
          break;
        case 'payment':
          state.isPaymentModalOpen = false;
          break;
      }
    },
    closeAllModals: (state) => {
      state.isDiscountModalOpen = false;
      state.isCompletedSalesModalOpen = false;
      state.isRecentTransactionsModalOpen = false;
      state.isDraftBillsModalOpen = false;
      state.isInvoiceModalOpen = false;
      state.isHoldModalOpen = false;
      state.isPaymentModalOpen = false;
    },
    setActiveInvoice: (state, action: PayloadAction<Mushak63Invoice | null>) => {
      state.activeInvoice = action.payload;
    },
    openPaymentModal: (state, action: PayloadAction<'cash' | 'card' | 'mfs' | 'split'>) => {
      state.activePaymentMethod = action.payload;
      state.isPaymentModalOpen = true;
    },
    setPaymentMethod: (state, action: PayloadAction<'cash' | 'card' | 'mfs' | 'split'>) => {
      state.activePaymentMethod = action.payload;
    },
    showToast: (
      state,
      action: PayloadAction<{ type?: 'success' | 'error' | 'info'; title: string; message?: string }>
    ) => {
      state.toast = {
        id: String(Date.now()),
        type: action.payload.type || 'success',
        title: action.payload.title,
        message: action.payload.message,
      };
    },
    hideToast: (state) => {
      state.toast = null;
    },
  },
});

export const { 
  openModal, 
  closeModal, 
  closeAllModals, 
  setActiveInvoice,
  openPaymentModal,
  setPaymentMethod,
  showToast,
  hideToast,
} = modalSlice.actions;
export default modalSlice.reducer;
