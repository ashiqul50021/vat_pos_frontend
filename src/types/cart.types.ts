import { Product } from './product.types';

export interface CartItem {
  product: Product;
  quantity: number;
  itemDiscount: number; // in BDT
  lineSubtotal: number; // quantity * unitPrice
  lineVat: number; // lineSubtotal * vatRate
  lineTotal: number; // lineSubtotal + lineVat - itemDiscount
}

export type DiscountType = 'percentage' | 'fixed' | 'coupon' | 'loyalty';

export interface AppliedDiscount {
  type: DiscountType;
  value: number; // e.g., 10 for 10% or 150 for 150 BDT
  code?: string;
  calculatedAmount: number;
  reason: string;
  authorizedBy?: string; // supervisor PIN or name
}

export interface CustomerInfo {
  type: 'walk-in' | 'registered' | 'corporate';
  name: string;
  phone?: string;
  taxId?: string; // BIN or TIN (e.g. 9028-BD)
  address?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'mfs' | 'split';

export interface PaymentDetails {
  method: PaymentMethod;
  amountPaid: number;
  changeGiven: number;
  mfsProvider?: 'bkash' | 'nagad' | 'rocket' | 'upay';
  trxId?: string;
  cardLast4?: string;
}
