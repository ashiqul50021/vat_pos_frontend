import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateQuantity, removeFromCart } from '../../../store/slices/cartSlice';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { formatBDT } from '../../../utils/currencyFormatter';

export const CartItemsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-xl my-1 select-none">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E3A8A] mb-3 shadow-2xs">
          <ShoppingCart className="w-6 h-6 stroke-[1.8]" />
        </div>
        <p className="text-xs font-bold text-slate-700">Cart is Empty</p>
        <p className="text-[11px] text-slate-400 mt-1 max-w-[220px]">
          Scan product barcode or click items from the catalog to start billing.
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-mono">F2: Scan Barcode</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-2xs">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-slate-50/90 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider z-10">
          <tr>
            <th className="py-2.5 px-3">ITEM DESCRIPTION</th>
            <th className="py-2.5 px-2 text-right">PRICE</th>
            <th className="py-2.5 px-2 text-center">QTY</th>
            <th className="py-2.5 px-2 text-center">VAT</th>
            <th className="py-2.5 px-3 text-right">TOTAL (BDT)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {items.map((item) => {
            const vatPercent = (item.product.vatRate * 100).toString();
            return (
              <tr key={item.product.id} className="hover:bg-slate-50/60 transition-colors group">
                {/* Item Description */}
                <td className="py-3 px-3">
                  <p className="font-bold text-slate-800 text-xs leading-tight">
                    {item.product.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-normal">
                    SKU: {item.product.sku}
                  </p>
                </td>

                {/* Price */}
                <td className="py-3 px-2 text-right font-medium text-slate-700 font-mono text-xs">
                  {formatBDT(item.product.unitPrice, false)}
                </td>

                {/* Qty Controls */}
                <td className="py-3 px-2">
                  <div className="flex items-center justify-center gap-1.5 border border-slate-200 rounded-md bg-white px-1.5 py-0.5 w-max mx-auto shadow-2xs">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.product.id,
                            quantity: item.quantity - 1,
                          })
                        )
                      }
                      className="text-slate-400 hover:text-slate-700 px-0.5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-xs text-slate-800 min-w-[16px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.product.id,
                            quantity: item.quantity + 1,
                          })
                        )
                      }
                      className="text-slate-400 hover:text-slate-700 px-0.5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </td>

                {/* VAT */}
                <td className="py-3 px-2 text-center text-xs text-slate-600 font-medium">
                  {vatPercent}%
                </td>

                {/* Total & Remove */}
                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="font-bold text-slate-900 font-mono text-xs">
                      {formatBDT(item.lineTotal, false)}
                    </span>
                    <button
                      onClick={() => dispatch(removeFromCart(item.product.id))}
                      className="text-slate-300 hover:text-rose-500 transition-colors ml-1"
                      title="Remove Item"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
