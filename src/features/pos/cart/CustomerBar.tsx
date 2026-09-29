import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setCustomer } from '../../../store/slices/cartSlice';
import { User, Plus } from 'lucide-react';

export const CustomerBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const customer = useAppSelector((state) => state.cart.customer);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(customer.name);
  const [taxId, setTaxId] = useState(customer.taxId || '9028-BD');

  const handleSave = () => {
    dispatch(
      setCustomer({
        type: taxId ? 'registered' : 'walk-in',
        name: name || 'Walk-in Regular Customer',
        taxId: taxId || undefined,
      })
    );
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-2.5 mb-2.5 shadow-2xs">
      {isEditing ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Customer Name</label>
              <input
                type="text"
                placeholder="Walk-in Regular Customer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-300 text-xs rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">BIN / Tax ID</label>
              <input
                type="text"
                placeholder="Tax ID (e.g. 9028-BD)"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full bg-white border border-slate-300 text-xs rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-blue-500/20 font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1 border-t border-slate-200/70">
            <button
              onClick={() => setIsEditing(false)}
              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3.5 py-1 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-blue-100/70 border border-blue-200/80 text-blue-700 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800 text-xs truncate">
                  {customer.name || 'Walk-in Regular Customer'}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-600 font-medium">
                  {customer.taxId ? 'Registered' : 'Walk-in'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-2 py-0.5 rounded-md border border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold font-mono text-[11px] shadow-2xs">
              Tax ID: {customer.taxId || '9028-BD'}
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="w-6 h-6 rounded-lg border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all shadow-2xs"
              title="Edit Customer / Tax ID"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
