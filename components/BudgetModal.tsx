
import React, { useState } from 'react';

interface BudgetModalProps {
  category: string;
  currentLimit: number;
  currentSpending: number;
  onSave: (limit: number) => void;
  onClose: () => void;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ 
  category, 
  currentLimit, 
  currentSpending, 
  onSave, 
  onClose 
}) => {
  const formatDisplay = (val: string) => {
    const number = val.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const [limit, setLimit] = useState<string>(currentLimit > 0 ? formatDisplay(currentLimit.toString()) : '');

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setLimit(formatDisplay(rawValue));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericLimit = parseFloat(limit.replace(/\./g, ''));
    onSave(isNaN(numericLimit) ? 0 : numericLimit);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
      <div className="bg-white border-4 border-stone-900 w-full max-w-sm p-8 retro-shadow text-stone-900 animate-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-yellow-300 p-2 border-2 border-stone-900 rotate-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Atur Budget</h2>
        </div>

        <div className="mb-6 p-4 bg-stone-50 border-2 border-stone-900/10">
          <p className="text-[10px] font-black uppercase text-stone-400 mb-1">Kategori</p>
          <p className="font-black text-xl uppercase tracking-tight">{category}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-[10px] font-bold text-stone-500 uppercase">Terpakai Bulan Ini:</span>
            <span className="font-mono-retro font-bold text-sm">{formatCurrency(currentSpending)}</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase mb-1 tracking-widest text-stone-600">Limit Budget Baru (Rp)</label>
            <input 
              required
              autoFocus
              type="text"
              inputMode="numeric"
              value={limit}
              onChange={handleLimitChange}
              className="w-full border-4 border-stone-900 p-3 font-mono-retro text-xl outline-none focus:bg-yellow-50 transition-colors bg-white"
              placeholder="0"
            />
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 border-4 border-stone-900 py-3 font-bold uppercase hover:bg-stone-50 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="flex-1 bg-stone-900 text-white py-3 border-4 border-stone-900 font-bold uppercase retro-shadow-hover transition-all"
            >
              Terapkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
