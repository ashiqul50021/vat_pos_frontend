import { CartItem, CustomerInfo, AppliedDiscount, PaymentDetails } from './cart.types';

export interface MushakItemEntry {
  serialNo: number;
  productName: string;
  hsCode: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPriceExclusive: number;
  supplementaryDutyRate: number;
  supplementaryDutyAmount: number;
  vatRate: number; // usually 15% (0.15)
  vatAmount: number;
  totalPriceInclusive: number;
}

export interface Mushak63Invoice {
  invoiceNumber: string; // e.g. "INV-2026-09281"
  mushakChallanNo: string; // e.g. "NBR-M6.3-9028-0041"
  sdmsCloudTxId: string; // e.g. "SDMS-TX-984210"
  qrVerificationUrl: string;
  issueDateTime: string;
  counterCode: string;
  cashierName: string;
  
  // Registered Business Details (Seller)
  seller: {
    registeredName: string;
    bin: string; // Business Identification Number (13 or 9 digits)
    address: string;
    circleName: string;
    commissionerate: string;
    phone: string;
  };
  
  // Buyer Details
  buyer: CustomerInfo;
  
  // Items & Calculations
  items: MushakItemEntry[];
  totalExclusiveAmount: number;
  totalSupplementaryDuty: number;
  totalVatAmount: number;
  discountAmount: number;
  appliedDiscount?: AppliedDiscount;
  payableGrossAmount: number;
  amountInBengaliWords: string;
  amountInEnglishWords: string;
  
  payment: PaymentDetails;
  isNbrSynced: boolean;
}
