export type CounterStatus = 'available' | 'in-use' | 'attention' | 'offline';

export interface CounterTerminal {
  id: string;
  code: string; // e.g. "POS-T01"
  name: string; // e.g. "Counter 01 (Main Billing)"
  location: string; // e.g. "Ground Floor", "Level 1 Food Court", "Exit Gate 02"
  status: CounterStatus;
  currentCashier?: string;
  ipAddress: string;
}

export interface CashierSession {
  operatorName: string;
  role: string;
  counterId: string;
  counterName: string;
  shiftStartTime: string;
  nbrCloudLatencyMs: number;
  mushakAutoGeneration: boolean;
}
