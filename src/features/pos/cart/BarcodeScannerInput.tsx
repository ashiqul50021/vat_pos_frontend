import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addToCart, toggleAutoAdd } from '../../../store/slices/cartSlice';
import { Product } from '../../../types/product.types';
import { ScanBarcode, Plus } from 'lucide-react';

interface BarcodeScannerInputProps {
  onScanAlert?: (msg: string) => void;
}

export const BarcodeScannerInput: React.FC<BarcodeScannerInputProps> = ({ onScanAlert }) => {
  const dispatch = useAppDispatch();
  const autoAdd = useAppSelector((state) => state.cart.autoAddOnScan);
  // Use live products from Redux store instead of mock data
  const liveProducts = useAppSelector((state) => state.product.products);
  const [code, setCode] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleInputChange = (val: string) => {
    setCode(val);
    if (!val.trim()) {
      setSuggestions([]);
      return;
    }
    const matched = liveProducts.filter(
      (p) =>
        p.barcode.includes(val) ||
        p.sku.toLowerCase().includes(val.toLowerCase()) ||
        p.name.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(matched.slice(0, 4));
  };

  const executeAdd = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    onScanAlert?.(`Added ${product.name} to cart`);
    setCode('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!code.trim()) return;

      const matched = liveProducts.find(
        (p) =>
          p.barcode === code.trim() ||
          p.sku.toLowerCase() === code.trim().toLowerCase()
      );

      if (matched) {
        executeAdd(matched);
      } else if (suggestions.length > 0) {
        executeAdd(suggestions[0]);
      } else {
        onScanAlert?.('Product not found for scanned code');
      }
    }
  };

  return (
    <div className="relative mb-2.5">
      <div className="flex items-center gap-2 bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white border border-slate-200 focus-within:border-[#1E3A8A] focus-within:ring-2 focus-within:ring-blue-500/15 rounded-xl px-3 py-2 transition-all shadow-2xs">
        <ScanBarcode className="w-4 h-4 text-[#1E3A8A] shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Scan Barcode / SKU (or press Enter)..."
          value={code}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />

        <div className="flex items-center gap-1.5 shrink-0">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200">
            F2
          </kbd>

          {/* Auto-Add Toggle Pill */}
          <button
            onClick={() => dispatch(toggleAutoAdd())}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors ${
              autoAdd
                ? 'bg-blue-50 border-blue-200 text-[#1E3A8A] font-semibold'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
          >
            Auto-Add
          </button>

          {/* Scan Button */}
          <button
            onClick={() => {
              if (code.trim() && suggestions.length > 0) {
                executeAdd(suggestions[0]);
              }
            }}
            className="px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-md transition-colors"
          >
            Scan
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-30 overflow-hidden divide-y divide-slate-100">
          {suggestions.map((p) => (
            <div
              key={p.id}
              onClick={() => executeAdd(p)}
              className="p-2.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div>
                <p className="text-xs font-semibold text-slate-800">{p.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {p.sku} • Stock: {p.stock}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 font-mono">
                  {(p.totalPrice || p.unitPrice).toFixed(2)} BDT
                </span>
                <span className="p-1 rounded bg-blue-50 text-blue-600">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
