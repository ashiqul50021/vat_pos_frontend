// PosCategory represents a dynamic category fetched from pos_categories table
export interface PosCategory {
  id: number;
  name: string;
  hs_code: string;
  vat: number;
  sd: number;
  status: string;
}

// ProductCategory type is now a string to support dynamic pos_category ids + 'all'
export type ProductCategory = string;

export interface Product {
  id: string;
  sku: string;
  name: string;
  shortTag?: string;
  category: ProductCategory;      // pos_category name from backend
  pos_category_id?: number;       // matched pos_category id
  hs_code: string;
  unitPrice: number;
  vatRate: number;
  sdRate: number;
  stock: number;
  unit: string;
  barcode: string;
}
