import { posDB } from '../indexedDB';
import { PosProduct } from '../schema';

export const productRepo = {
  async getAll(): Promise<PosProduct[]> {
    return posDB.getAll<PosProduct>('pos_products');
  },

  async getById(id: string): Promise<PosProduct | null> {
    return posDB.getById<PosProduct>('pos_products', id);
  },

  async getByCategory(categoryId: string): Promise<PosProduct[]> {
    return posDB.getByIndex<PosProduct>('pos_products', 'category_id', categoryId);
  },

  async create(product: PosProduct): Promise<PosProduct> {
    return posDB.insert<PosProduct>('pos_products', product);
  },

  async updateStock(id: string, qtySold: number): Promise<void> {
    const product = await this.getById(id);
    if (product) {
      product.stock = Math.max(0, product.stock - qtySold);
      await posDB.insert('pos_products', product);
    }
  },

  async delete(id: string): Promise<void> {
    return posDB.delete('pos_products', id);
  },
};
