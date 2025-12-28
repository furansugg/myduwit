
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Account, CategoryType } from '../types';
import { Icons, CATEGORY_COLORS, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  accounts: Account[];
  onDelete: (id: string) => void;
  showFilters?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  accounts, 
  onDelete,
  showFilters = true 
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const allCategories = useMemo(() => {
    return ['All', ...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  }, []);

  // Mengecek apakah ada filter (selain search) yang aktif
  const hasActiveAdvancedFilters = selectedCategory !== 'All' || selectedAccountId !== 'All' || startDate !== '' || endDate !== '';
  const hasAnyFilter = searchQuery !== '' || hasActiveAdvancedFilters;

  const filteredTransactions = useMemo(() => {
    if (!showFilters) return transactions;
    
    return transactions.filter(t => {
      const matchesSearch = (t.description || t.category).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const matchesAccount = selectedAccountId === 'All' || t.accountId === selectedAccountId;
      
      const transactionDate = new Date(t.date).getTime();
      const matchesStartDate = !startDate || transactionDate >= new Date(startDate).getTime();
      const matchesEndDate = !endDate || transactionDate <= new Date(endDate).getTime();

      return matchesSearch && matchesCategory && matchesAccount && matchesStartDate && matchesEndDate;
    });
  }, [transactions, searchQuery, selectedCategory, selectedAccountId, startDate, endDate, showFilters]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'Waktu tidak tercatat';
    return new Date(isoString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const getAccountName = (id: string) => {
    return accounts.find(a => a.id === id)?.name || 'Akun Dihapus';
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedAccountId('All');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Search Section */}
      <div className="flex flex-col gap-4 border-b-4 border-stone-900 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-stone-900 flex items-center">
             <span className="bg-[#da77f2] px-2 border-2 border-stone-900 mr-2 shadow-[2px_2px_0px_0px_#1c1917]">#</span>
             {showFilters ? 'Riwayat Transaksi' : 'Aktivitas Terakhir'}
          </h3>
          
          {showFilters && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
               {hasAnyFilter && (
                <button 
                  onClick={resetFilters}
                  className="text-[10px] font-black px-4 py-2 border-4 border-stone-900 bg-rose-300 hover:bg-rose-400 transition-colors uppercase retro-shadow-sm active:translate-y-1 active:shadow-none"
                >
                  Reset
                </button>
              )}
              <span className="text-[10px] font-black px-4 py-2 border-4 border-stone-900 bg-white uppercase retro-shadow-sm whitespace-nowrap">
                {filteredTransactions.length} Data
              </span>
            </div>
          )}
        </div>

        {/* Global Search Bar (Selalu terlihat jika showFilters=true) */}
        {showFilters && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari transaksi..."
                className="w-full border-4 border-stone-900 p-3 font-bold text-sm bg-white outline-none focus:ring-4 focus:ring-[#74c0fc]/30 transition-all"
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-center gap-2 px-6 border-4 border-stone-900 transition-all font-black uppercase text-xs retro-shadow-sm active:translate-y-1 active:shadow-none ${isFilterOpen || hasActiveAdvancedFilters ? 'bg-yellow-300' : 'bg-white'}`}
            >
              <Icons.Palette />
              <span className="hidden sm:inline">Filter</span>
              {hasActiveAdvancedFilters && <span className="w-2 h-2 bg-rose-500 rounded-full ml-1" />}
            </button>
          </div>
        )}
      </div>

      {/* Collapsible Advanced Filter Panel (Dropdown Kategori, Wallet, Tanggal) */}
      {showFilters && isFilterOpen && (
        <div className="bg-white border-4 border-stone-900 p-6 retro-shadow animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase text-stone-500">Pilih Kategori</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border-2 border-stone-900 p-2 font-bold text-sm bg-stone-50 outline-none focus:bg-white"
              >
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase text-stone-500">Pilih Wallet</label>
              <select 
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full border-2 border-stone-900 p-2 font-bold text-sm bg-stone-50 outline-none focus:bg-white"
              >
                <option value="All">Semua Wallet</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase text-stone-500">Rentang Waktu</label>
              <div className="flex items-center gap-1">
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border-2 border-stone-900 p-1 font-bold text-[10px] bg-stone-50 outline-none focus:bg-white"
                />
                <span className="text-stone-400 font-black">-</span>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border-2 border-stone-900 p-1 font-bold text-[10px] bg-stone-50 outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t-2 border-dashed border-stone-200 flex justify-end">
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="text-[10px] font-black text-stone-900 hover:underline uppercase transition-all"
            >
              [ Simpan & Tutup ]
            </button>
          </div>
        </div>
      )}

      {/* Status Bar for Active Filter (Small Indicator) */}
      {!isFilterOpen && hasActiveAdvancedFilters && (
        <div className="flex flex-wrap gap-2">
           {selectedCategory !== 'All' && (
             <span className="bg-stone-900 text-white px-2 py-0.5 text-[9px] font-black uppercase border-2 border-stone-900">Kat: {selectedCategory}</span>
           )}
           {selectedAccountId !== 'All' && (
             <span className="bg-stone-900 text-white px-2 py-0.5 text-[9px] font-black uppercase border-2 border-stone-900">Wallet: {getAccountName(selectedAccountId)}</span>
           )}
           {(startDate || endDate) && (
             <span className="bg-stone-900 text-white px-2 py-0.5 text-[9px] font-black uppercase border-2 border-stone-900">Rentang Waktu Aktif</span>
           )}
        </div>
      )}

      {/* List Content */}
      {filteredTransactions.length === 0 ? (
        <div className="border-4 border-dashed border-stone-400 bg-white/50 p-16 text-center">
          <p className="text-stone-400 font-black uppercase italic text-xl">
            {transactions.length === 0 ? "Belum ada transaksi." : "Hasil tidak ditemukan."}
          </p>
          {hasAnyFilter && (
            <button onClick={resetFilters} className="mt-4 text-xs font-black uppercase text-stone-900 underline underline-offset-4">Bersihkan Semua Pencarian</button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map(t => (
            <div 
              key={t.id}
              className="bg-white border-4 border-stone-900 flex flex-col retro-shadow-sm hover:translate-x-1 transition-all overflow-hidden group"
            >
              <div className="h-2 w-full" style={{ backgroundColor: CATEGORY_COLORS[t.category] }} />
              
              <div className="flex flex-col md:flex-row md:items-stretch">
                <div className="p-4 flex-1 flex items-start gap-4 sm:gap-6">
                  <div 
                    className="hidden sm:flex shrink-0 w-14 h-14 border-4 border-stone-900 items-center justify-center font-black text-2xl text-stone-900 rotate-3 shadow-[4px_4px_0px_0px_#1c1917] group-hover:rotate-0 transition-transform mt-1"
                    style={{ backgroundColor: CATEGORY_COLORS[t.category] }}
                  >
                    {t.category.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[8px] font-mono-retro font-bold bg-stone-100 px-1.5 py-0.5 border-2 border-stone-900/10 text-stone-400 uppercase">
                        ID: {t.id.split('-')[0]}
                      </span>
                      <span className="text-[9px] bg-stone-900 text-white px-2 py-0.5 font-black uppercase">
                        {t.category}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <h4 className="font-black text-xl leading-none text-stone-900 uppercase tracking-tight truncate">
                        {t.description || "Tanpa Keterangan"}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[9px] sm:text-[10px] bg-yellow-300 px-2 py-0.5 font-black uppercase text-stone-900 border-2 border-stone-900">
                        {getAccountName(t.accountId)}
                      </span>
                      <div className="flex items-center gap-2">
                        <p className="text-[9px] sm:text-[10px] text-stone-500 uppercase font-black tracking-widest flex items-center gap-1">
                          <Icons.History /> {t.date}
                        </p>
                        <span className="text-stone-300">|</span>
                        <p className="text-[9px] sm:text-[10px] text-stone-400 uppercase font-bold flex items-center gap-1">
                           {formatDateTime(t.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t-4 md:border-t-0 md:border-l-4 border-stone-900 bg-stone-50 flex items-center justify-between md:justify-center flex-row md:flex-col gap-4 md:min-w-[200px]">
                  <span className={`font-mono-retro font-black text-xl sm:text-2xl truncate ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(t.amount)}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="p-2 border-2 border-stone-900 bg-white hover:bg-rose-400 transition-all shadow-[2px_2px_0px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                      title="Hapus Transaksi"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
