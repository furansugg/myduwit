import React, { useState } from 'react';
import { Account, AccountType } from '../types';

interface AccountModalProps {
  onSave: (account: Omit<Account, 'id'>) => void;
  onClose: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>(AccountType.BANK);
  const [balance, setBalance] = useState('');

  const formatDisplay = (val: string) => {
    const number = val.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setBalance(formatDisplay(rawValue));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericBalance = parseFloat(balance.replace(/\./g, ''));
    if (!name || isNaN(numericBalance)) return;
    onSave({
      name,
      type,
      initialBalance: numericBalance
    });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[110]">
      <div className="bg-white border-4 border-stone-900 w-full max-w-sm p-8 retro-shadow text-stone-900">
        <h2 className="text-2xl font-bold uppercase italic tracking-tighter mb-6">Tambah Sumber Dana</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase mb-1">Nama Akun</label>
            <input 
              required
              className="w-full border-4 border-stone-900 p-3 bg-white outline-none"
              placeholder="Misal: BCA, Gopay, Dompet"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase mb-1">Tipe</label>
            <select 
              className="w-full border-4 border-stone-900 p-3 bg-white outline-none font-bold"
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
              className="w-full border-4 border-stone-900 p-3 bg-white outline-none font-mono-retro"
              placeholder="0"
              value={balance}
              onChange={handleBalanceChange}
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border-4 border-stone-900 font-bold uppercase hover:bg-stone-100">Batal</button>
            <button type="submit" className="flex-1 py-3 bg-stone-900 text-white font-bold uppercase retro-shadow-hover">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountModal;