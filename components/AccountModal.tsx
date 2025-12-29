
import React, { useState, useEffect } from 'react';
import { Account, AccountType } from '../types';

interface AccountModalProps {
  onSave: (account: Account | Omit<Account, 'id'>) => void;
  onClose: () => void;
  initialData?: Account;
}

const AccountModal: React.FC<AccountModalProps> = ({ onSave, onClose, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState<AccountType>(initialData?.type || AccountType.BANK);
  
  const formatDisplay = (val: string) => {
    const number = val.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const [balance, setBalance] = useState(initialData ? formatDisplay(initialData.initialBalance.toString()) : '');

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setBalance(formatDisplay(rawValue));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericBalance = parseFloat(balance.replace(/\./g, ''));
    if (!name || isNaN(numericBalance)) return;

    if (initialData) {
      onSave({
        ...initialData,
        name,
        type,
        initialBalance: numericBalance
      });
    } else {
      onSave({
        name,
        type,
        initialBalance: numericBalance
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[110]">
      <div className="bg-white border-4 border-stone-900 w-full max-w-sm p-8 retro-shadow text-stone-900 animate-in zoom-in duration-200">
        <h2 className="text-2xl font-bold uppercase italic tracking-tighter mb-6">
          {initialData ? 'Edit Sumber Dana' : 'Tambah Sumber Dana'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase mb-1">Nama Akun</label>
            <input 
              required
              autoFocus
              className="w-full border-4 border-stone-900 p-3 bg-white outline-none focus:bg-yellow-50 transition-colors"
              placeholder="Misal: BCA, Gopay, Dompet"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase mb-1">Tipe</label>
            <select 
              className="w-full border-4 border-stone-900 p-3 bg-white outline-none font-bold focus:bg-yellow-50 transition-colors"
              value={type}
              onChange={e => setType(e.target.value as AccountType)}
            >
              <option value={AccountType.BANK}>Bank</option>
              <option value={AccountType.EWALLET}>E-Wallet</option>
              <option value={AccountType.CASH}>Cash (Tunai)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black uppercase mb-1">Saldo Awal (Rp)</label>
            <input 
              required
              type="text"
              inputMode="numeric"
              className="w-full border-4 border-stone-900 p-3 bg-white outline-none font-mono-retro focus:bg-yellow-50 transition-colors"
              placeholder="0"
              value={balance}
              onChange={handleBalanceChange}
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border-4 border-stone-900 font-bold uppercase hover:bg-stone-100 transition-colors">Batal</button>
            <button type="submit" className="flex-1 py-3 bg-stone-900 text-white font-bold uppercase retro-shadow-hover transition-all">
              {initialData ? 'Perbarui' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountModal;
