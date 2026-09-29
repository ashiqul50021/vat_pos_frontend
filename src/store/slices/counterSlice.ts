import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CounterTerminal, CashierSession } from '../../types/counter.types';

const STORAGE_COUNTER_KEY = 'nexvat_pos_active_counter';
const STORAGE_SESSION_KEY = 'nexvat_pos_session';

const getSavedCounter = (): CounterTerminal | null => {
  try {
    const raw = localStorage.getItem(STORAGE_COUNTER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getSavedSession = (): CashierSession | null => {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const savedCounter = getSavedCounter();
const savedSession = getSavedSession();

interface CounterState {
  counters: CounterTerminal[];
  activeCounter: CounterTerminal | null;
  session: CashierSession | null;
  filterStatus: 'all' | 'available' | 'in-use' | 'attention';
  currentView: 'dashboard' | 'counter-selection' | 'pos';
}

const initialState: CounterState = {
  counters: [],
  activeCounter: savedCounter,
  session: savedSession,
  filterStatus: 'all',
  currentView: savedCounter ? 'pos' : 'counter-selection',
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<'dashboard' | 'counter-selection' | 'pos'>) => {
      state.currentView = action.payload;
    },
    selectCounter: (state, action: PayloadAction<CounterTerminal>) => {
      state.activeCounter = action.payload;
      state.currentView = 'pos';
      const sessionData: CashierSession = {
        operatorName: (typeof window !== 'undefined' && localStorage.getItem('user_name')) || 'Super Admin',
        role: (typeof window !== 'undefined' && localStorage.getItem('user_role')) || 'Operator',
        counterId: action.payload.id,
        counterName: action.payload.name,
        shiftStartTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        nbrCloudLatencyMs: 24,
        mushakAutoGeneration: true,
      };
      state.session = sessionData;

      try {
        localStorage.setItem(STORAGE_COUNTER_KEY, JSON.stringify(action.payload));
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
      } catch (err) {
        console.error('Failed to save counter session:', err);
      }
    },
    leaveSession: (state) => {
      state.activeCounter = null;
      state.session = null;
      state.currentView = 'counter-selection';
      try {
        localStorage.removeItem(STORAGE_COUNTER_KEY);
        localStorage.removeItem(STORAGE_SESSION_KEY);
      } catch (err) {
        console.error('Failed to clear counter session:', err);
      }
    },
    setCounters: (state, action: PayloadAction<CounterTerminal[]>) => {
      state.counters = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<'all' | 'available' | 'in-use' | 'attention'>) => {
      state.filterStatus = action.payload;
    },
  },
});

export const { setCurrentView, selectCounter, leaveSession, setCounters, setFilterStatus } = counterSlice.actions;
export default counterSlice.reducer;
