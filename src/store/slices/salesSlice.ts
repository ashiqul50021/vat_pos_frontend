import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransactionSummary, ShiftMetrics, DraftOrder } from '../../types/sales.types';

interface SalesState {
  transactions: TransactionSummary[];
  draftOrders: DraftOrder[];
  metrics: ShiftMetrics;
}

const loadSavedDrafts = (): DraftOrder[] => {
  try {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('pos_draft_orders') : null;
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState: SalesState = {
  transactions: [],
  draftOrders: loadSavedDrafts(),
  metrics: {
    totalTransactionsCount: 0,
    grossRevenueAmount: 0,
    netSalesAmount: 0,
    vatCollectedAmount: 0,
    discountGivenAmount: 0,
    averageBasketValue: 0,
    cashTotal: 0,
    cardTotal: 0,
    mfsTotal: 0,
    splitTotal: 0,
  },
};

export const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<TransactionSummary[]>) => {
      state.transactions = action.payload;
    },
    setMetrics: (state, action: PayloadAction<ShiftMetrics>) => {
      state.metrics = action.payload;
    },
    addTransaction: (state, action: PayloadAction<TransactionSummary>) => {
      state.transactions.unshift(action.payload);
      // Update shift metrics
      state.metrics.totalTransactionsCount += 1;
      state.metrics.netSalesAmount += action.payload.subtotal;
      state.metrics.vatCollectedAmount += action.payload.vatAmount;
      state.metrics.discountGivenAmount += action.payload.discountAmount;
      state.metrics.grossRevenueAmount += action.payload.grandTotal;
      state.metrics.averageBasketValue = Number(
        (state.metrics.grossRevenueAmount / state.metrics.totalTransactionsCount).toFixed(2)
      );
      if (action.payload.paymentMethod === 'cash') {
        state.metrics.cashTotal += action.payload.grandTotal;
      } else if (action.payload.paymentMethod === 'card') {
        state.metrics.cardTotal += action.payload.grandTotal;
      } else {
        state.metrics.mfsTotal += action.payload.grandTotal;
      }
    },
    addDraftOrder: (state, action: PayloadAction<DraftOrder>) => {
      state.draftOrders.unshift(action.payload);
      try {
        localStorage.setItem('pos_draft_orders', JSON.stringify(state.draftOrders));
      } catch (err) {
        console.error(err);
      }
    },
    removeDraftOrder: (state, action: PayloadAction<string>) => {
      state.draftOrders = state.draftOrders.filter((draft) => draft.id !== action.payload);
      try {
        localStorage.setItem('pos_draft_orders', JSON.stringify(state.draftOrders));
      } catch (err) {
        console.error(err);
      }
    },
  },
});

export const { setTransactions, setMetrics, addTransaction, addDraftOrder, removeDraftOrder } = salesSlice.actions;
export default salesSlice.reducer;
