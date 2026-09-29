import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';
import App from './App';
import * as dbApi from './db';

if (typeof window !== 'undefined') {
  (window as unknown as { posApi: typeof dbApi; posDB: typeof dbApi.posDB }).posApi = dbApi;
  (window as unknown as { posApi: typeof dbApi; posDB: typeof dbApi.posDB }).posDB = dbApi.posDB;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
