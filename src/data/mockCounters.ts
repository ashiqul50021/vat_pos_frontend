import { CounterTerminal } from '../types/counter.types';

export const mockCounters: CounterTerminal[] = [
  {
    id: 'counter-01',
    code: 'POS-T01',
    name: 'Counter 01 (Main Billing)',
    location: 'Ground Floor',
    status: 'available',
    ipAddress: '10.240.12.84',
  },
  {
    id: 'counter-03',
    code: 'POS-T03',
    name: 'Counter 03 (Dairy & Bakery)',
    location: 'Level 1 Food Court',
    status: 'available',
    ipAddress: '10.240.12.86',
  },
  {
    id: 'counter-06',
    code: 'POS-T06',
    name: 'Counter 06 (Quick Kiosk / Backup)',
    location: 'Exit Gate 02',
    status: 'available',
    ipAddress: '10.240.12.89',
  },
  {
    id: 'counter-02',
    code: 'POS-T02',
    name: 'Counter 02 (Fashion & Apparel)',
    location: 'Level 2 West',
    status: 'in-use',
    currentCashier: 'Tanvir Ahmed',
    ipAddress: '10.240.12.85',
  },
  {
    id: 'counter-05',
    code: 'POS-T05',
    name: 'Counter 05 (Electronics & Gadgets)',
    location: 'Level 3 East',
    status: 'in-use',
    currentCashier: 'Nusrat Jahan',
    ipAddress: '10.240.12.88',
  },
  {
    id: 'counter-04',
    code: 'POS-T04',
    name: 'Counter 04 (Cold Storage & Meat)',
    location: 'Basement 1',
    status: 'attention',
    ipAddress: '10.240.12.87',
  },
];
