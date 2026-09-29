const BASE_URL = 'http://localhost:8000/api';

const getHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token') || '';
  const branchId = localStorage.getItem('branch_id') || '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (branchId) {
    headers['selected-branch-id'] = branchId;
  }
  return headers;
};

export const posClient = {
  async getCategories() {
    const res = await fetch(`${BASE_URL}/pos/products/categories`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);
    return res.json();
  },

  async getProducts(search = '', posCategoryId?: string | number) {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (posCategoryId && posCategoryId !== 'all') params.set('pos_category_id', String(posCategoryId));
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${BASE_URL}/pos/products${query}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
    return res.json();
  },

  async getCounters() {
    const res = await fetch(`${BASE_URL}/pos/counters`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch counters: ${res.statusText}`);
    return res.json();
  },

  async submitSale(payload: unknown) {
    console.log('[posClient] submitting sale:', payload);
    const res = await fetch(`${BASE_URL}/pos/sales`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    console.log('[posClient] submitSale HTTP status:', res.status);
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.error('[posClient] submitSale error body:', errBody);
      throw new Error(errBody.message || `Failed to submit sale: ${res.statusText}`);
    }
    const data = await res.json();
    console.log('[posClient] submitSale success data:', data);
    return data;
  },

  async getSalesHistory() {
    const res = await fetch(`${BASE_URL}/pos/sales`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch sales: ${res.statusText}`);
    return res.json();
  },

  async getSettings() {
    const res = await fetch(`${BASE_URL}/pos/settings`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch settings: ${res.statusText}`);
    return res.json();
  },

  async verifyAuth() {
    const res = await fetch(`${BASE_URL}/pos/auth/verify`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Auth verification failed`);
    return res.json();
  },
};
