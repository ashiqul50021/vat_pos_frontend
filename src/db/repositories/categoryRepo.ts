import { posDB } from '../indexedDB';
import { PosCategory } from '../schema';

export const categoryRepo = {
  async getAll(): Promise<PosCategory[]> {
    return posDB.getAll<PosCategory>('pos_categories');
  },

  async getById(id: string): Promise<PosCategory | null> {
    return posDB.getById<PosCategory>('pos_categories', id);
  },

  async create(category: PosCategory): Promise<PosCategory> {
    return posDB.insert<PosCategory>('pos_categories', category);
  },

  async delete(id: string): Promise<void> {
    return posDB.delete('pos_categories', id);
  },
};
