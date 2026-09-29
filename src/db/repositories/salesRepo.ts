import { posDB } from '../indexedDB';
import { PosSale, PosSaleDetail } from '../schema';
import { productRepo } from './productRepo';

export interface SaleWithDetails {
  sale: PosSale;
  items: PosSaleDetail[];
}

export const salesRepo = {
  /**
   * Saves a sale and its line items atomically in pos_sales and pos_sales_details
   */
  async createSale(sale: PosSale, details: PosSaleDetail[]): Promise<SaleWithDetails> {
    await posDB.executeAtomicTransaction(
      ['pos_sales', 'pos_sales_details'],
      async (tx) => {
        const salesStore = tx.objectStore('pos_sales');
        salesStore.put(sale);

        const detailsStore = tx.objectStore('pos_sales_details');
        for (const item of details) {
          detailsStore.put(item);
        }
      }
    );

    // Update product stock for sold items
    for (const item of details) {
      await productRepo.updateStock(item.product_id, item.qty);
    }

    return { sale, items: details };
  },

  async getAllSales(): Promise<PosSale[]> {
    const sales = await posDB.getAll<PosSale>('pos_sales');
    // Sort descending by created_at
    return sales.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getSaleById(id: string): Promise<PosSale | null> {
    return posDB.getById<PosSale>('pos_sales', id);
  },

  async getSaleDetails(saleId: string): Promise<PosSaleDetail[]> {
    return posDB.getByIndex<PosSaleDetail>('pos_sales_details', 'pos_sales_id', saleId);
  },

  async getSaleWithDetails(saleId: string): Promise<SaleWithDetails | null> {
    const sale = await this.getSaleById(saleId);
    if (!sale) return null;
    const items = await this.getSaleDetails(saleId);
    return { sale, items };
  },

  async getTodayMetrics() {
    const sales = await this.getAllSales();
    let netSalesAmount = 0;
    let vatCollectedAmount = 0;
    let discountGivenAmount = 0;
    let grossRevenueAmount = 0;
    let cashTotal = 0;
    let cardTotal = 0;
    let mfsTotal = 0;

    for (const s of sales) {
      netSalesAmount += s.sub_total;
      vatCollectedAmount += s.vat;
      discountGivenAmount += s.discounted_amount || 0;
      grossRevenueAmount += s.total_amount;

      if (s.payment_method === 'cash') cashTotal += s.total_amount;
      else if (s.payment_method === 'card') cardTotal += s.total_amount;
      else if (s.payment_method === 'mfs') mfsTotal += s.total_amount;
      else cashTotal += s.total_amount;
    }

    return {
      netSalesAmount,
      vatCollectedAmount,
      discountGivenAmount,
      grossRevenueAmount,
      totalTransactionsCount: sales.length,
      averageBasketValue: sales.length > 0 ? grossRevenueAmount / sales.length : 0,
      nbrSyncSuccessRate: 100,
      cashTotal,
      cardTotal,
      mfsTotal,
    };
  },
};
