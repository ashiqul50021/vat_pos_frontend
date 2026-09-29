import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, AppliedDiscount, CustomerInfo } from '../../types/cart.types';
import { Product } from '../../types/product.types';
import { calculateOrderTotals } from '../../utils/vatCalculator';
import { leaveSession, selectCounter } from './counterSlice';

interface CartState {
  items: CartItem[];
  customer: CustomerInfo;
  appliedDiscount: AppliedDiscount | null;
  autoAddOnScan: boolean;
  subtotal: number;
  totalVat: number;
  discountAmount: number;
  grandTotal: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  customer: {
    type: 'walk-in',
    name: 'Walk-in Customer',
    taxId: '',
  },
  appliedDiscount: null,
  autoAddOnScan: true,
  subtotal: 0,
  totalVat: 0,
  discountAmount: 0,
  grandTotal: 0,
  itemCount: 0,
};

const recalculate = (state: CartState) => {
  const totals = calculateOrderTotals(state.items, state.appliedDiscount ?? undefined);
  state.subtotal = totals.subtotal;
  state.totalVat = totals.totalVat;
  state.discountAmount = totals.discountAmount;
  state.grandTotal = totals.grandTotal;
  state.itemCount = totals.itemCount;
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.product.id === product.id);

      if (existing) {
        existing.quantity += quantity;
        existing.lineSubtotal = existing.quantity * product.unitPrice;
        existing.lineVat = existing.lineSubtotal * product.vatRate;
        existing.lineTotal = existing.lineSubtotal;
      } else {
        const lineSubtotal = quantity * product.unitPrice;
        const lineVat = lineSubtotal * product.vatRate;
        state.items.push({
          product,
          quantity,
          itemDiscount: 0,
          lineSubtotal,
          lineVat,
          lineTotal: lineSubtotal,
        });
      }
      recalculate(state);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.product.id === productId);

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          state.items.splice(itemIndex, 1);
        } else {
          const item = state.items[itemIndex];
          item.quantity = quantity;
          item.lineSubtotal = item.quantity * item.product.unitPrice;
          item.lineVat = item.lineSubtotal * item.product.vatRate;
          item.lineTotal = item.lineSubtotal;
        }
      }
      recalculate(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
      recalculate(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.appliedDiscount = null;
      recalculate(state);
    },
    setCustomer: (state, action: PayloadAction<CustomerInfo>) => {
      state.customer = action.payload;
    },
    applyDiscount: (state, action: PayloadAction<AppliedDiscount>) => {
      state.appliedDiscount = action.payload;
      recalculate(state);
    },
    removeDiscount: (state) => {
      state.appliedDiscount = null;
      recalculate(state);
    },
    toggleAutoAdd: (state) => {
      state.autoAddOnScan = !state.autoAddOnScan;
    },
    loadCart: (state, action: PayloadAction<{ items: CartItem[]; customer: CustomerInfo; discount?: AppliedDiscount }>) => {
      state.items = action.payload.items;
      state.customer = action.payload.customer;
      state.appliedDiscount = action.payload.discount || null;
      recalculate(state);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(leaveSession, (state) => {
        state.items = [];
        state.appliedDiscount = null;
        state.customer = {
          type: 'walk-in',
          name: 'Walk-in Customer',
          taxId: '',
        };
        recalculate(state);
      })
      .addCase(selectCounter, (state) => {
        state.items = [];
        state.appliedDiscount = null;
        state.customer = {
          type: 'walk-in',
          name: 'Walk-in Customer',
          taxId: '',
        };
        recalculate(state);
      });
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setCustomer,
  applyDiscount,
  removeDiscount,
  toggleAutoAdd,
  loadCart,
} = cartSlice.actions;

export default cartSlice.reducer;
