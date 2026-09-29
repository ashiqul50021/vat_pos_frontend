import React from 'react';
import { Product } from '../../../types/product.types';
import { formatBDT } from '../../../utils/currencyFormatter';
import { 
  Plus, 
  Milk, 
  CupSoda, 
  Flame, 
  ShoppingBag, 
  Cookie, 
  Sparkles,
  Package
} from 'lucide-react';

interface ProductGridCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const getCategoryVisuals = (category: string) => {
  const lower = category.toLowerCase();
  if (lower.includes('dairy') || lower.includes('egg') || lower.includes('milk'))
    return { bg: 'bg-gradient-to-br from-sky-50 to-blue-50/90', text: 'text-sky-600', border: 'border-sky-100', icon: Milk };
  if (lower.includes('bever') || lower.includes('juice') || lower.includes('drink') || lower.includes('tea') || lower.includes('water'))
    return { bg: 'bg-gradient-to-br from-amber-50 to-orange-50/90', text: 'text-amber-600', border: 'border-amber-100', icon: CupSoda };
  if (lower.includes('spice') || lower.includes('oil') || lower.includes('masala'))
    return { bg: 'bg-gradient-to-br from-rose-50 to-orange-50/90', text: 'text-rose-600', border: 'border-rose-100', icon: Flame };
  if (lower.includes('grocer') || lower.includes('rice') || lower.includes('sugar') || lower.includes('flour'))
    return { bg: 'bg-gradient-to-br from-emerald-50 to-teal-50/90', text: 'text-emerald-600', border: 'border-emerald-100', icon: ShoppingBag };
  if (lower.includes('baker') || lower.includes('snack') || lower.includes('biscuit') || lower.includes('bread'))
    return { bg: 'bg-gradient-to-br from-amber-50 to-yellow-50/90', text: 'text-amber-700', border: 'border-amber-100', icon: Cookie };
  if (lower.includes('house') || lower.includes('clean') || lower.includes('soap') || lower.includes('detergent'))
    return { bg: 'bg-gradient-to-br from-indigo-50 to-purple-50/90', text: 'text-indigo-600', border: 'border-indigo-100', icon: Sparkles };
  return { bg: 'bg-gradient-to-br from-slate-50 to-slate-100', text: 'text-slate-600', border: 'border-slate-200', icon: Package };
};

export const ProductGridCard: React.FC<ProductGridCardProps> = ({ product, onAdd }) => {
  const visuals = getCategoryVisuals(product.category);
  const IconComponent = visuals.icon;

  const isLowStock = product.stock <= 5;
  const isMediumStock = product.stock <= 20;

  return (
    <div
      onClick={() => onAdd(product)}
      className="bg-white border border-slate-200/80 hover:border-[#1E3A8A] rounded-xl p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group select-none relative"
    >
      <div>
        {/* Visual Category / Product Display Area */}
        <div
          className={`relative w-full h-24 ${visuals.bg} border ${visuals.border} rounded-lg flex flex-col items-center justify-center mb-2 overflow-hidden transition-transform duration-200 group-hover:scale-[1.02]`}
        >
          {/* Subtle Watermark Category Icon in background */}
          <IconComponent
            className={`w-14 h-14 ${visuals.text} opacity-15 absolute -bottom-1 -right-1 pointer-events-none`}
          />

          {/* Centered Product Short Tag Chip */}
          <div className="flex flex-col items-center gap-1 z-10 px-2 text-center">
            <div className={`w-8 h-8 rounded-full bg-white/90 shadow-2xs border border-white flex items-center justify-center ${visuals.text}`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-2xs border border-white/60 line-clamp-1 max-w-[130px]">
              {product.shortTag || product.name.split(' ').slice(0, 2).join(' ')}
            </span>
          </div>

          {/* Stock Tag on Top Right */}
          <div className="absolute top-1.5 right-1.5 z-10">
            {isLowStock ? (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/90 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Stock: {product.stock}
              </span>
            ) : isMediumStock ? (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/90 shadow-2xs">
                Stock: {product.stock}
              </span>
            ) : (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-2xs">
                Stock: {product.stock}
              </span>
            )}
          </div>
        </div>

        {/* Product Title */}
        <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#1E3A8A] transition-colors line-clamp-2 leading-snug min-h-[30px]">
          {product.name}
        </h4>

        {/* SKU & Tax Rate */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>{product.sku}</span>
          <span className="text-slate-500 font-sans font-medium">
            {(product.vatRate * 100).toFixed(0)}% VAT
          </span>
        </div>
      </div>

      {/* Price & Add Button */}
      <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-black text-[#1E3A8A] font-mono tracking-tight">
              {formatBDT(product.totalPrice || (product.unitPrice * (1 + product.vatRate)), false)}
            </span>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200/60 leading-none">
              Incl. VAT
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Base: {formatBDT(product.unitPrice, false)} BDT
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
          className="w-7 h-7 rounded-lg border border-blue-200 bg-blue-50/80 group-hover:bg-[#1E3A8A] group-hover:text-white group-hover:border-[#1E3A8A] text-[#1E3A8A] flex items-center justify-center transition-all shadow-2xs active:scale-95 shrink-0"
          title="Add to cart"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
