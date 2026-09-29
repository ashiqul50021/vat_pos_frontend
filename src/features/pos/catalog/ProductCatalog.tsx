import React, { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  setProducts,
  setProductsLoading,
  setCategories,
  setCategoriesLoading,
  setSelectedCategory,
  setSearchQuery,
} from '../../../store/slices/productSlice';
import { addToCart } from '../../../store/slices/cartSlice';
import { ProductGridCard } from './ProductGridCard';
import { Product } from '../../../types/product.types';
import { posClient } from '../../../api/posClient';
import {
  Search,
  Filter,
  X,
  LayoutGrid,
  PackageOpen,
  Tag,
} from 'lucide-react';

interface ProductCatalogProps {
  onItemAdded?: (msg: string) => void;
}

/** Skeleton shimmer for category pills */
const CategorySkeleton = () => (
  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-2 shrink-0">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="h-7 rounded-lg bg-slate-200 animate-pulse shrink-0"
        style={{ width: 90 + i * 12 }}
      />
    ))}
  </div>
);

/** Skeleton shimmer for product grid */
const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="rounded-xl bg-slate-100 animate-pulse" style={{ height: 140 }} />
    ))}
  </div>
);

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onItemAdded }) => {
  const dispatch = useAppDispatch();
  const {
    products,
    categories,
    categoriesLoading,
    selectedCategory,
    searchQuery,
    productsLoading,
  } = useAppSelector((state) => state.product);

  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Load categories on mount ── */
  useEffect(() => {
    const load = async () => {
      dispatch(setCategoriesLoading(true));
      try {
        const res = await posClient.getCategories();
        dispatch(setCategories(res?.data || []));
      } catch (err) {
        console.error('[ProductCatalog] Failed to load categories:', err);
        dispatch(setCategories([]));
      } finally {
        dispatch(setCategoriesLoading(false));
      }
    };
    load();
  }, [dispatch]);

  /* ── Load products when category or search changes ── */
  const fetchProducts = useCallback(
    async (search: string, categoryId: string) => {
      dispatch(setProductsLoading(true));
      try {
        const catId = categoryId === 'all' ? undefined : categoryId;
        const res = await posClient.getProducts(search, catId);
        // Map backend response to frontend Product shape
        const mapped: Product[] = (res?.data || []).map((p: {
          id: number | string;
          sku?: string;
          name: string;
          hs_code?: string;
          pos_category_id?: number;
          category_name?: string;
          total_price?: number;
          price?: number;
          vat_rate?: number;
          sd_rate?: number;
          stock?: number;
        }) => ({
          id: String(p.id),
          sku: p.sku || `POS-${String(p.id).padStart(5, '0')}`,
          name: p.name,
          hs_code: p.hs_code || '',
          pos_category_id: p.pos_category_id,
          category: p.category_name || 'General',
          unitPrice: Number(p.price ?? p.total_price ?? 0),
          totalPrice: Number(p.total_price ?? p.price ?? 0),
          vatRate: (p.vat_rate ?? 15) / 100,
          sdRate: (p.sd_rate ?? 0) / 100,
          stock: p.stock ?? 50,
          unit: 'pcs',
          barcode: p.sku || String(p.id),
        }));
        dispatch(setProducts(mapped));
      } catch (err) {
        console.error('[ProductCatalog] Failed to load products:', err);
        dispatch(setProducts([]));
      } finally {
        dispatch(setProductsLoading(false));
      }
    },
    [dispatch]
  );

  /* ── Debounced search refetch ── */
  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      fetchProducts(searchQuery, selectedCategory);
    }, 350);
    return () => {
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
    };
  }, [searchQuery, selectedCategory, fetchProducts]);

  const handleAdd = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    onItemAdded?.(`Added ${product.name} to cart`);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Search & Filter Bar */}
      <div className="flex items-center gap-2 mb-2.5 shrink-0">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search product name, SKU or HS Code..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50/80 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-2xs active:scale-95 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span>Filter</span>
        </button>
      </div>

      {/* Category Navigation Pills */}
      {categoriesLoading ? (
        <CategorySkeleton />
      ) : (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-2 shrink-0">
          {/* All Products tab */}
          <button
            onClick={() => dispatch(setSelectedCategory('all'))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#1E3A8A] text-white font-semibold shadow-xs'
                : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <LayoutGrid className={`w-3.5 h-3.5 ${selectedCategory === 'all' ? 'text-white' : 'text-slate-500'}`} />
            <span>All Products</span>
          </button>

          {/* Dynamic pos_categories from backend */}
          {categories.map((cat) => {
            const isActive = selectedCategory === String(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => dispatch(setSelectedCategory(String(cat.id)))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white font-semibold shadow-xs'
                    : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <Tag className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{cat.name}</span>
                <span className={`text-[10px] opacity-70 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {cat.hs_code}
                </span>
              </button>
            );
          })}

          {categories.length === 0 && !categoriesLoading && (
            <span className="text-xs text-slate-400 px-2">
              No categories found — Add POS Category in Settings
            </span>
          )}
        </div>
      )}

      {/* Products Grid Area */}
      <div className="flex-1 overflow-y-auto pr-1">
        {productsLoading ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <PackageOpen className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-sm font-semibold text-slate-700">No products found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {searchQuery
                ? `No products found for "${searchQuery}". Try another keyword.`
                : 'No salable products in this category.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => dispatch(setSearchQuery(''))}
                className="mt-3 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {products.map((p) => (
              <ProductGridCard key={p.id} product={p} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="pt-2.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 mt-2 shrink-0">
        <span className="text-slate-600 font-medium">
          {productsLoading
            ? 'Loading...'
            : (<>Total: <strong className="text-slate-900 font-bold">{products.length}</strong> Products</>)
          }
        </span>
        {selectedCategory !== 'all' && (
          <span className="text-blue-600 font-medium">
            Active Filter:{' '}
            <strong>{categories.find(c => String(c.id) === selectedCategory)?.name || selectedCategory}</strong>
          </span>
        )}
      </div>
    </div>
  );
};
