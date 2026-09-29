import { CartItem, AppliedDiscount } from '../types/cart.types';

export interface OrderCalculationResult {
  subtotal: number;
  totalVat: number;
  discountAmount: number;
  grandTotal: number;
  itemCount: number;
}

export const calculateOrderTotals = (
  items: CartItem[],
  appliedDiscount?: AppliedDiscount
): OrderCalculationResult => {
  let subtotal = 0;
  let totalVat = 0;
  let itemCount = 0;

  items.forEach((item) => {
    const lineSubtotal = item.quantity * item.product.unitPrice;
    const lineVat = lineSubtotal * item.product.vatRate;

    subtotal += lineSubtotal;
    totalVat += lineVat;
    itemCount += item.quantity;
  });

  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === 'percentage') {
      discountAmount = (subtotal * appliedDiscount.value) / 100;
    } else {
      discountAmount = appliedDiscount.value;
    }
  }

  // Ensure discount does not exceed subtotal
  discountAmount = Math.min(discountAmount, subtotal);
  const grandTotal = Math.max(0, subtotal + totalVat - discountAmount);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    totalVat: Number(totalVat.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
    itemCount,
  };
};
