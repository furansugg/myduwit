
import React, { useState, useEffect } from 'react';
import { TransactionType, CategoryType, Transaction, Account } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';

interface TransactionFormProps {
  accounts: Account[];
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ accounts, onAdd, onClose }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>('Others');
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  // Reset category to 'Others' when switching between Income and Expense
  useEffect(() => {
    setCategory('Others');
  }, [type]);

  const formatDisplay = (val: string) => {
    const number = val.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setError(''); // Clear error when user starts typing
    setAmount(formatDisplay(rawValue));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(/\./g, ''));
    
    if (!accountId) {
      setError('SILAKAN PILIH SUMBER DANA!');
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      setError('JUMLAH HARUS LEBIH DARI NOL (0)!');
      return;
    }

    setError('');
    onAdd({
      amount: numericAmount,
      type,
      category,
      description,
      date,
      accountId,
      createdAt: new Date().toISOString()
    });
  };

  const currentCategories = type === TransactionType.EXPENSE ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div 
        className="border-4 border-stone-900 w-full max-w-md p-8 retro-shadow animate-in fade-in zoom-in duration-200 text-stone-900"
        style={{ backgroundColor: 'var(--retro-bg)' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold uppercase italic tracking-tighter">Catat Baru</h2>
          <button onClick={onClose} className="text-stone-600 hover:text-stone-900 font-bold hover:underline transition-all underline-offset-4">[ TUTUP ]</button>
        </div>

        {error && (
          <div className="mb-4 bg-rose-500 text-white p-3 text-center font-black text-xs border-4 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex border-4 border-stone-900 overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => { setType(TransactionType.EXPENSE); setError(''); }}
              className={`flex-1 py-3 font-bold uppercase transition-colors ${type === TransactionType.EXPENSE ? 'bg-rose-300 text-stone-900 border-r-4 border-stone-900' : 'bg-white text-stone-400 border-r-4 border-stone-900'}`}
            >
              Keluar
            </button>
            <button
              type="button"
              onClick={() => { setType(TransactionType.INCOME); setError(''); }}
              className={`flex-1 py-3 font-bold uppercase transition-colors ${type === TransactionType.INCOME ? 'bg-emerald-300 text-stone-900' : 'bg-white text-stone-400'}`}
            >
              Masuk
            </button>
          </div>

          <div>
            <label className="block text-xs font-black uppercase mb-1">Jumlah (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono-retro font-bold text-stone-400">Rp</span>
              <input 
                required
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={handleAmountChange}
                className={`w-full border-4 border-stone-900 p-3 pl-12 font-mono-retro text-xl outline-none transition-all bg-white ${error && amount === '0' ? 'bg-rose-50 ring-4 ring-rose-200' : 'focus:ring-4 focus:ring-emerald-200'}`}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase mb-1">Sumber Dana</label>
            <select 
              required
              value={accountId}
              onChange={(e) => { setAccountId(e.target.value); setError(''); }}
              className="w-full border-4 border-stone-900 p-3 bg-white outline-none font-bold"
            >
              <option value="" disabled>Pilih Sumber...</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
            {accounts.length === 0 && <p className="text-[10px] text-rose-600 font-bold mt-1 uppercase">* Tambahkan sumber dana dulu di menu Wallets</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase mb-1">Kategori</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full border-4 border-stone-900 p-3 bg-white outline-none font-bold"
              >
                {currentCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase mb-1">Tanggal</label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border-4 border-stone-900 p-3 bg-white outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase mb-1">Keterangan</label>
            <input 
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-4 border-stone-900 p-3 outline-none bg-white"
              placeholder="Keterangan tambahan..."
            />
          </div>

          <button 
            type="submit"
            disabled={accounts.length === 0}
            className="w-full bg-stone-900 text-white py-4 font-bold text-xl retro-shadow-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase border-none"
          >
            Simpan Catatan
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
