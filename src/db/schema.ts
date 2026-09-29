// Schema based on NEXVAT POS Architecture (NBR Mushak-6.3 Compliant)

export type VatType = 'Including' | 'Excluding';
export type EntityStatus = 'active' | 'inactive';
export type DiscountType = 'Percentage' | 'Fixed' | 'Coupon' | 'None';

/**
 * Table: pos-categories
 * Used in: POS Backend & VAT Backend
 */
export interface PosCategory {
  id: string;
  name: string;
  hs_code: string;       // NBR Harmonized System Tariff Code
  branch_id: string;
  status: EntityStatus;
  created_at?: string;
}

/**
 * Table: pos-counters
 * Used in: POS Backend & VAT Backend
 */
export interface PosCounter {
  id: string;
  name: string;
  branch_id: string;
  status: EntityStatus;
  ip_address?: string;
}

/**
 * Table: pos-products
 * Core Transaction Model
 */
export interface PosProduct {
  id: string;
  name: string;
  category_id: string;   // Foreign Key -> pos-categories.id
  branch_id: string;
  status: EntityStatus;
  
  // Extended POS attributes
  sku: string;
  barcode: string;
  unit_price: number;
  vat_rate: number;      // e.g. 0.15, 0.05, 0.075, 0.00
  stock: number;
  unit: string;
  short_tag?: string;
}

/**
 * Table: pos-sales
 * Core Transaction Master Record
 */
export interface PosSale {
  id: string;
  sales_code: string;           // e.g. "CH-2025-091482"
  sub_total: number;            // Net amount exclusive of VAT
  vat_type: VatType;            // 'Including' | 'Excluding'
  vat: number;                  // Total VAT collected
  sd: number;                   // Supplementary Duty (if applicable)
  discount_type: DiscountType;  // 'Percentage' | 'Fixed' | 'Coupon' | 'None'
  discount: number;             // Discount value (e.g. 10% or 150 BDT)
  discounted_amount: number;    // Calculated discount amount
  total_amount: number;         // Grand Total / Net Payable Gross
  note: string;
  counter_id: string;           // Foreign Key -> pos-counters.id
  branch_id: string;
  user_id: string;              // Cashier / User ID
  
  // Audit & Display fields
  customer_name?: string;
  customer_phone?: string;
  customer_tax_id?: string;
  payment_method?: 'cash' | 'card' | 'mfs' | 'split';
  mushak_challan_no?: string;
  created_at: string;
}

/**
 * Table: pos-sales-details
 * Core Transaction Line-Items (Foreign Key -> pos-sales.id)
 */
export interface PosSaleDetail {
  id: string;
  pos_sales_id: string;         // Foreign Key -> pos-sales.id
  product_id: string;           // Foreign Key -> pos-products.id
  vat_type: VatType;
  
  // item-details:
  qty: number;
  price: number;                // Unit selling price
  counter_id: string;
  branch_id: string;
  
  // Snapshot for historical immutability
  product_name?: string;
  hs_code?: string;
  vat_rate?: number;
  vat_amount?: number;
  line_total?: number;
}
