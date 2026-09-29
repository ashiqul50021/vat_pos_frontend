import { CartItem, CustomerInfo, AppliedDiscount, PaymentDetails } from './cart.types';
import { Mushak63Invoice } from './invoice.types';

export interface DraftOrder {
  id: string;
  orderNumber: string; // e.g. "#DF-8092"
  tokenTag?: 'active' | 'on-hold';
  timestamp: string; // e.g. "12:42 PM • 18m ago"
  customer: CustomerInfo;
  customerInitials?: string; // e.g. "KU"
  customerTag?: string; // e.g. "Walk-In Customer", "Corporate Account"
  items: CartItem[];
  itemCount: number;
  itemsSummaryText?: string;
  bannerType?: 'hold' | 'tax-protocol';
  bannerText?: string;
  holdReason: string;
  subtotal: number;
  vatAmount: number;
  vatSubtext?: string;
  grandTotal: number;
  appliedDiscount?: AppliedDiscount;
}

export interface ShiftMetrics {
  netSalesAmount: number;
  vatCollectedAmount: number;
  discountGivenAmount: number;
  grossRevenueAmount: number;
  totalTransactionsCount: number;
  averageBasketValue: number;
  nbrSyncSuccessRate: number;
  cashTotal: number;
  cardTotal: number;
  mfsTotal: number;
}

export interface TransactionSummary {
  id: string;
  invoiceNo: string;
  mushakNo: string;
  timestamp: string;
  customerName: string;
  customerTaxId?: string;
  itemCount: number;
  subtotal: number;
  vatAmount: number;
  discountAmount: number;
  grandTotal: number;
  paymentMethod: 'cash' | 'card' | 'mfs' | 'split';
  status: 'completed' | 'refunded' | 'voided';
  nbrSynced: boolean;
  fullInvoice: Mushak63Invoice;
}
