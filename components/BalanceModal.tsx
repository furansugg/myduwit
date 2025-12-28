import React, { useState } from 'react';

interface BalanceModalProps {
  currentInitial: number;
  onSave: (amount: number) => void;
  onClose: () => void;
}

const BalanceModal: React.FC<BalanceModalProps> = ({ currentInitial, onSave, onClose }) => {
  const formatDisplay = (val: string) => {
    const number = val.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const [amount, setAmount] = useState<string>(formatDisplay(currentInitial.toString()));

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setAmount(formatDisplay(rawValue));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(/\./g, ''));
    onSave(numericAmount || 0);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-sky-50 border-4 border-stone-900 w-full max-w-sm p-8 retro-shadow animate-in fade-in zoom-in duration-200 text-stone-900">
        <h2 className="text-2xl font-bold uppercase italic tracking-tighter mb-4">Atur Saldo Awal</h2>
        <p className="text-sm font-bold text-stone-600 mb-6 uppercase">Masukkan modal/saldo awal yang kamu miliki saat ini.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-black uppercase mb-1 text-stone-800">Saldo Awal (Rp)</label>
            <input 
              required
              autoFocus
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={handleAmountChange}
              className="w-full border-4 border-stone-900 p-3 font-mono-retro text-xl outline-none focus:ring-4 focus:ring-sky-200 bg-white"
              placeholder="0"
            />
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 border-4 border-stone-900 py-3 font-bold uppercase hover:bg-stone-200 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="flex-1 bg-stone-900 text-white py-3 font-bold uppercase retro-shadow-hover transition-all border-none"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BalanceModal;