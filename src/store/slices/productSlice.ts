import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, PosCategory } from '../../types/product.types';

interface ProductState {
  products: Product[];
  categories: PosCategory[];      // dynamic pos_categories from backend
  categoriesLoading: boolean;
  selectedCategory: string;       // 'all' or pos_category id as string
  searchQuery: string;
  productsLoading: boolean;
}

const initialState: ProductState = {
  products: [],
  categories: [],
  categoriesLoading: false,
  selectedCategory: 'all',
  searchQuery: '',
  productsLoading: false,
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setProductsLoading: (state, action: PayloadAction<boolean>) => {
      state.productsLoading = action.payload;
    },
    setCategories: (state, action: PayloadAction<PosCategory[]>) => {
      state.categories = action.payload;
    },
    setCategoriesLoading: (state, action: PayloadAction<boolean>) => {
      state.categoriesLoading = action.payload;
    },
    updateProductStock: (state, action: PayloadAction<{ id: string; qty: number }>) => {
      const prod = state.products.find(p => p.id === action.payload.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - action.payload.qty);
      }
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setProducts,
  setProductsLoading,
  setCategories,
  setCategoriesLoading,
  updateProductStock,
  setSelectedCategory,
  setSearchQuery,
} = productSlice.actions;
export default productSlice.reducer;
