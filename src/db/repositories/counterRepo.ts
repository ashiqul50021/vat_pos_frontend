import { posDB } from '../indexedDB';
import { PosCounter } from '../schema';

export const counterRepo = {
  async getAll(): Promise<PosCounter[]> {
    return posDB.getAll<PosCounter>('pos_counters');
  },

  async getById(id: string): Promise<PosCounter | null> {
    return posDB.getById<PosCounter>('pos_counters', id);
  },

  async create(counter: PosCounter): Promise<PosCounter> {
    return posDB.insert<PosCounter>('pos_counters', counter);
  },
};
