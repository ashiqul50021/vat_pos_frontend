import { PosCategory, PosCounter, PosProduct, PosSale, PosSaleDetail } from './schema';

const DB_NAME = 'NexvatPOS_Database';
const DB_VERSION = 1;

export class PosIndexedDB {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  public async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. pos-categories
        if (!db.objectStoreNames.contains('pos_categories')) {
          const catStore = db.createObjectStore('pos_categories', { keyPath: 'id' });
          catStore.createIndex('branch_id', 'branch_id', { unique: false });
        }

        // 2. pos-counters
        if (!db.objectStoreNames.contains('pos_counters')) {
          const counterStore = db.createObjectStore('pos_counters', { keyPath: 'id' });
          counterStore.createIndex('branch_id', 'branch_id', { unique: false });
        }

        // 3. pos-products
        if (!db.objectStoreNames.contains('pos_products')) {
          const prodStore = db.createObjectStore('pos_products', { keyPath: 'id' });
          prodStore.createIndex('category_id', 'category_id', { unique: false });
          prodStore.createIndex('branch_id', 'branch_id', { unique: false });
          prodStore.createIndex('barcode', 'barcode', { unique: false });
        }

        // 4. pos-sales
        if (!db.objectStoreNames.contains('pos_sales')) {
          const salesStore = db.createObjectStore('pos_sales', { keyPath: 'id' });
          salesStore.createIndex('sales_code', 'sales_code', { unique: true });
          salesStore.createIndex('counter_id', 'counter_id', { unique: false });
          salesStore.createIndex('created_at', 'created_at', { unique: false });
        }

        // 5. pos-sales-details
        if (!db.objectStoreNames.contains('pos_sales_details')) {
          const detailsStore = db.createObjectStore('pos_sales_details', { keyPath: 'id' });
          detailsStore.createIndex('pos_sales_id', 'pos_sales_id', { unique: false });
          detailsStore.createIndex('product_id', 'product_id', { unique: false });
        }
      };

      request.onsuccess = async () => {
        this.db = request.result;
        await this.seedInitialData();
        resolve(this.db);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.initPromise;
  }

  // Generic Operations
  public async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  }

  public async getById<T>(storeName: string, id: string): Promise<T | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  public async getByIndex<T>(storeName: string, indexName: string, value: IDBValidKey): Promise<T[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const req = index.getAll(value);
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  }

  public async insert<T>(storeName: string, item: T): Promise<T> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  }

  public async delete(storeName: string, id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async executeAtomicTransaction(
    storeNames: string[],
    callback: (tx: IDBTransaction) => Promise<void>
  ): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction(storeNames, 'readwrite');
    await callback(tx);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  // Pre-seed default data if DB is newly created
  private async seedInitialData(): Promise<void> {
    const categoriesCount = await this.count('pos_categories');
    if (categoriesCount === 0) {
      await this.seedCategories();
      await this.seedCounters();
      await this.seedProducts();
      await this.seedInitialSales();
    }
  }

  private async count(storeName: string): Promise<number> {
    if (!this.db) return 0;
    return new Promise((resolve) => {
      const tx = this.db!.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(0);
    });
  }

  private async seedCategories(): Promise<void> {
    const categories: PosCategory[] = [
      { id: 'cat-01', name: 'Dairy & Milk', hs_code: '0405.90.00', branch_id: 'BR-DHK-01', status: 'active' },
      { id: 'cat-02', name: 'Groceries & Staples', hs_code: '1507.90.10', branch_id: 'BR-DHK-01', status: 'active' },
      { id: 'cat-03', name: 'Beverages & Juices', hs_code: '2009.89.00', branch_id: 'BR-DHK-01', status: 'active' },
      { id: 'cat-04', name: 'Spices & Condiments', hs_code: '0910.91.00', branch_id: 'BR-DHK-01', status: 'active' },
      { id: 'cat-05', name: 'Bakery & Snacks', hs_code: '1905.90.00', branch_id: 'BR-DHK-01', status: 'active' },
      { id: 'cat-06', name: 'Household & Cleaning', hs_code: '3402.20.00', branch_id: 'BR-DHK-01', status: 'active' },
    ];
    for (const cat of categories) {
      await this.insert('pos_categories', cat);
    }
  }

  private async seedCounters(): Promise<void> {
    const counters: PosCounter[] = [
      { id: 'cnt-01', name: 'Counter 01 (Main Billing)', branch_id: 'BR-DHK-01', status: 'active', ip_address: '192.168.1.101' },
      { id: 'cnt-02', name: 'Counter 02 (Express Checkout)', branch_id: 'BR-DHK-01', status: 'active', ip_address: '192.168.1.102' },
      { id: 'cnt-03', name: 'Counter 03 (Customer Care)', branch_id: 'BR-DHK-01', status: 'active', ip_address: '192.168.1.103' },
    ];
    for (const cnt of counters) {
      await this.insert('pos_counters', cnt);
    }
  }

  private async seedProducts(): Promise<void> {
    const products: PosProduct[] = [
      {
        id: 'prod-01',
        name: 'Aarong Dairy Pure Ghee 900g',
        category_id: 'cat-01',
        branch_id: 'BR-DHK-01',
        status: 'active',
        sku: 'NEX-880291',
        barcode: '894110880291',
        unit_price: 1450.00,
        vat_rate: 0.15,
        stock: 48,
        unit: 'pcs',
        short_tag: 'Aarong Ghee',
      },
      {
        id: 'prod-02',
        name: 'Pran Frooto Mango Juice 1L',
        category_id: 'cat-03',
        branch_id: 'BR-DHK-01',
        status: 'active',
        sku: 'NEX-110482',
        barcode: '894110110482',
        unit_price: 95.00,
        vat_rate: 0.075,
        stock: 120,
        unit: 'pcs',
        short_tag: 'Frooto 1L',
      },
      {
        id: 'prod-03',
        name: 'Radhuni Roast Masala 35g',
        category_id: 'cat-04',
        branch_id: 'BR-DHK-01',
        status: 'active',
        sku: 'NEX-558381',
        barcode: '894110558381',
        unit_price: 45.00,
        vat_rate: 0.05,
        stock: 85,
        unit: 'pcs',
        short_tag: 'Roast Masala',
      },
      {
        id: 'prod-04',
        name: 'Teer Fortified Soyabean Oil 5L',
        category_id: 'cat-02',
        branch_id: 'BR-DHK-01',
        status: 'active',
        sku: 'NEX-004921',
        barcode: '894110004921',
        unit_price: 890.00,
        vat_rate: 0.00,
        stock: 12,
        unit: 'bottle',
        short_tag: 'Soyabean 5L',
      },
      {
        id: 'prod-05',
        name: 'Chashi Premium Miniket Rice 5kg',
        category_id: 'cat-02',
        branch_id: 'BR-DHK-01',
        status: 'active',
        sku: 'NEX-772109',
        barcode: '894110772109',
        unit_price: 420.00,
        vat_rate: 0.05,
        stock: 250,
        unit: 'bag',
        short_tag: 'Miniket Rice',
      },
      {
        id: 'prod-06',
        name: 'Fresh Refined White Sugar 1kg',
        category_id: 'cat-02',
        branch_id: 'BR-DHK-01',
        status: 'active',
        sku: 'NEX-339201',
        barcode: '894110339201',
        unit_price: 140.00,
        vat_rate: 0.00,
        stock: 95,
        unit: 'kg',
        short_tag: 'Sugar 1kg',
      },
      {
        id: 'prod-07',
        name: 'Dano Daily Pushti Milk Powder 500g',
        category_id: 'cat-01',
        branch_id: 'BR-DHK-01',
        status: 'active',
        sku: 'NEX-991204',
        barcode: '894110991204',
        unit_price: 380.00,
        vat_rate: 0.15,
        stock: 64,
        unit: 'packet',
        short_tag: 'Dano Milk',
      },
      {
        id: 'prod-08',
        name: 'Ispahani Mirzapore Best Leaf Tea 400g',
        category_id: 'cat-03',
        branch_id: 'BR-DHK-01',
        status: 'active',
        sku: 'NEX-662810',
        barcode: '894110662810',
        unit_price: 245.00,
        vat_rate: 0.15,
        stock: 4,
        unit: 'box',
        short_tag: 'Mirzapore Tea',
      },
    ];
    for (const prod of products) {
      await this.insert('pos_products', prod);
    }
  }

  private async seedInitialSales(): Promise<void> {
    const saleId = 'sale-001';
    const sale: PosSale = {
      id: saleId,
      sales_code: 'CH-2025-091482',
      sub_total: 4305.00,
      vat_type: 'Excluding',
      vat: 470.25,
      sd: 0,
      discount_type: 'Fixed',
      discount: 150.00,
      discounted_amount: 150.00,
      total_amount: 4625.25,
      note: 'POS Terminal Counter 01 checkout',
      counter_id: 'cnt-01',
      branch_id: 'BR-DHK-01',
      user_id: 'usr-01',
      customer_name: 'Tanvir Ahmed',
      customer_phone: '01711-xxxxxx',
      payment_method: 'card',
      mushak_challan_no: 'NBR-M6.3-9028-0102',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    };
    await this.insert('pos_sales', sale);

    const details: PosSaleDetail[] = [
      {
        id: 'sdet-001',
        pos_sales_id: saleId,
        product_id: 'prod-01',
        vat_type: 'Excluding',
        qty: 2,
        price: 1450.00,
        counter_id: 'cnt-01',
        branch_id: 'BR-DHK-01',
        product_name: 'Aarong Dairy Pure Ghee 900g',
        hs_code: '0405.90.00',
        vat_rate: 0.15,
        vat_amount: 435.00,
        line_total: 2900.00,
      },
      {
        id: 'sdet-002',
        pos_sales_id: saleId,
        product_id: 'prod-02',
        vat_type: 'Excluding',
        qty: 4,
        price: 95.00,
        counter_id: 'cnt-01',
        branch_id: 'BR-DHK-01',
        product_name: 'Pran Frooto Mango Juice 1L',
        hs_code: '2009.89.00',
        vat_rate: 0.075,
        vat_amount: 28.50,
        line_total: 380.00,
      },
    ];

    for (const d of details) {
      await this.insert('pos_sales_details', d);
    }
  }
}

export const posDB = new PosIndexedDB();
