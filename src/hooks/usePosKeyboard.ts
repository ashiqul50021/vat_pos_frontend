import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearCart } from '../store/slices/cartSlice';
import { openModal, closeAllModals, openPaymentModal } from '../store/slices/modalSlice';
import { addDraftOrder } from '../store/slices/salesSlice';

export const usePosKeyboard = () => {
  const dispatch = useAppDispatch();
  const { items, customer, appliedDiscount, subtotal, totalVat, grandTotal } =
    useAppSelector((state) => state.cart);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input unless it's a dedicated function key or Esc or Alt combo
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

      if (e.key === 'Escape') {
        e.preventDefault();
        dispatch(closeAllModals());
        return;
      }

      // Alt+S: Split Payment
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        if (items.length > 0) {
          dispatch(openPaymentModal('split'));
        }
        return;
      }

      if (e.key === 'F10') {
        e.preventDefault();
        if (items.length > 0) {
          dispatch(openPaymentModal('cash'));
        }
        return;
      }

      if (e.key === 'F11') {
        e.preventDefault();
        if (items.length > 0) {
          dispatch(openPaymentModal('card'));
        }
        return;
      }

      if (e.key === 'F12') {
        e.preventDefault();
        if (items.length > 0) {
          dispatch(openPaymentModal('mfs'));
        }
        return;
      }

      if (e.key === 'F4') {
        e.preventDefault();
        if (items.length > 0) {
          const orderNumber = `HLD-${Date.now().toString().slice(-4)}`;
          dispatch(
            addDraftOrder({
              id: `draft-${Date.now()}`,
              orderNumber,
              timestamp: 'Just now',
              holdReason: 'Cashier pressed F4 Quick Hold',
              customer,
              items,
              appliedDiscount: appliedDiscount || undefined,
              subtotal,
              vatAmount: totalVat,
              grandTotal,
              itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
            })
          );
          dispatch(clearCart());
        }
      } else if (e.key === 'F8') {
        e.preventDefault();
        if (items.length > 0) {
          if (window.confirm('Void current cart? [F8]')) {
            dispatch(clearCart());
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, items, customer, appliedDiscount, subtotal, totalVat, grandTotal]);
};
