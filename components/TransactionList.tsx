
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Account, AccountType } from '../types';
import { Icons, CATEGORY_COLORS, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  accounts: Account[];
  onDelete: (id: string) => void;
  showFilters?: boolean;
}

type SortType = 'dateDesc' | 'dateAsc' | 'amountDesc' | 'amountAsc';

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
  const [sortType, setSortType] = useState<SortType>('dateDesc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const allCategories = useMemo(() => {
    return ['All', ...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  }, []);

  const hasActiveAdvancedFilters = selectedCategory !== 'All' || selectedAccountId !== 'All' || startDate !== '' || endDate !== '' || sortType !== 'dateDesc';
  const hasAnyFilter = searchQuery !== '' || hasActiveAdvancedFilters;

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (showFilters) {
      result = result.filter(t => {
        const matchesSearch = (t.description || t.category).toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
        const matchesAccount = selectedAccountId === 'All' || t.accountId === selectedAccountId;
        
        const transactionDate = new Date(t.date).getTime();
        const matchesStartDate = !startDate || transactionDate >= new Date(startDate).getTime();
        const matchesEndDate = !endDate || transactionDate <= new Date(endDate).getTime();

        return matchesSearch && matchesCategory && matchesAccount && matchesStartDate && matchesEndDate;
      });
    }

    // Sorting logic
    result.sort((a, b) => {
      switch (sortType) {
        case 'amountDesc':
          return b.amount - a.amount;
        case 'amountAsc':
          return a.amount - b.amount;
        case 'dateAsc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'dateDesc':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return result;
  }, [transactions, searchQuery, selectedCategory, selectedAccountId, startDate, endDate, sortType, showFilters]);

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
      hour12: false,
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAccount = (id: string) => {
    return accounts.find(a => a.id === id);
  };

  const getAccountIcon = (type?: AccountType) => {
    switch (type) {
      case AccountType.BANK: return <Icons.Bank />;
      case AccountType.EWALLET: return <Icons.Smartphone />;
      case AccountType.CASH: return <Icons.Cash />;
      default: return <Icons.Wallet />;
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedAccountId('All');
    setStartDate('');
    setEndDate('');
    setSortType('dateDesc');
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Search Section */}
      <div className="flex flex-col gap-4 border-b-4 border-stone-900 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-stone-900 flex items-center">
             <span className="bg-[#da77f2] px-2 border-2 border-stone-900 mr-2 shadow-[2px_2px_0px_0px_#1c1917]">#</span>
             {showFilters ? 'Riwayat Transaksi' : 'Aktivitas Terakhir'}
          </h3>
          
          {showFilters && (
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1">
               {hasAnyFilter && (
                <button 
                  onClick={resetFilters}
                  className="text-[9px] md:text-[10px] font-black px-3 md:px-4 py-2 border-4 border-stone-900 bg-rose-300 hover:bg-rose-400 transition-colors uppercase retro-shadow-sm active:translate-y-1 active:shadow-none whitespace-nowrap"
                >
                  Reset
                </button>
              )}
              <span className="text-[9px] md:text-[10px] font-black px-3 md:px-4 py-2 border-4 border-stone-900 bg-white uppercase retro-shadow-sm whitespace-nowrap">
                {filteredAndSortedTransactions.length} Data
              </span>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="flex gap-2">
            <div className="relative flex-1 min-w-0">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari..."
                className="w-full border-4 border-stone-900 p-2 md:p-3 font-bold text-sm bg-white outline-none focus:ring-4 focus:ring-[#74c0fc]/30 transition-all truncate"
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-center gap-2 px-4 md:px-6 border-4 border-stone-900 transition-all font-black uppercase text-xs retro-shadow-sm active:translate-y-1 active:shadow-none shrink-0 ${isFilterOpen || hasActiveAdvancedFilters ? 'bg-yellow-300' : 'bg-white'}`}
            >
              <Icons.Palette />
              <span className="hidden sm:inline">Filter & Sort</span>
              {hasActiveAdvancedFilters && <span className="w-2 h-2 bg-rose-500 rounded-full ml-1" />}
            </button>
          </div>
        )}
      </div>

      {showFilters && isFilterOpen && (
        <div className="bg-white border-4 border-stone-900 p-4 md:p-6 retro-shadow animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="space-y-1">
              <label className="block text-[9px] font-black uppercase text-stone-500 tracking-widest">Kategori</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border-2 border-stone-900 p-2 font-bold text-xs md:text-sm bg-stone-50 outline-none focus:bg-white"
              >
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-black uppercase text-stone-500 tracking-widest">Wallet</label>
              <select 
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full border-2 border-stone-900 p-2 font-bold text-xs md:text-sm bg-stone-50 outline-none focus:bg-white"
              >
                <option value="All">Semua Wallet</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-black uppercase text-stone-500 tracking-widest">Urutkan</label>
              <select 
                value={sortType}
                onChange={(e) => setSortType(e.target.value as SortType)}
                className="w-full border-2 border-stone-900 p-2 font-bold text-xs md:text-sm bg-stone-50 outline-none focus:bg-white"
              >
                <option value="dateDesc">Terbaru</option>
                <option value="dateAsc">Terlama</option>
                <option value="amountDesc">Jumlah (Terbesar)</option>
                <option value="amountAsc">Jumlah (Terkecil)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-black uppercase text-stone-500 tracking-widest">Rentang Waktu</label>
              <div className="flex items-center gap-1">
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border-2 border-stone-900 p-1 font-bold text-[9px] md:text-[10px] bg-stone-50 outline-none focus:bg-white"
                />
                <span className="text-stone-400 font-black">-</span>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border-2 border-stone-900 p-1 font-bold text-[9px] md:text-[10px] bg-stone-50 outline-none focus:bg-white"
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

      {filteredAndSortedTransactions.length === 0 ? (
        <div className="border-4 border-dashed border-stone-400 bg-white/50 p-12 md:p-16 text-center">
          <p className="text-stone-400 font-black uppercase italic text-lg md:text-xl">
            {transactions.length === 0 ? "Belum ada transaksi." : "Hasil tidak ditemukan."}
          </p>
          {hasAnyFilter && (
            <button onClick={resetFilters} className="mt-4 text-[10px] font-black uppercase text-stone-900 underline underline-offset-4">Bersihkan Pencarian</button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedTransactions.map(t => {
            const isExpanded = expandedId === t.id;
            const account = getAccount(t.accountId);
            
            return (
              <div 
                key={t.id}
                onClick={() => toggleExpand(t.id)}
                className={`bg-white border-4 border-stone-900 flex flex-col retro-shadow-sm hover:translate-x-1 cursor-pointer transition-all overflow-hidden group ${isExpanded ? 'ring-4 ring-stone-900 ring-offset-2' : ''}`}
              >
                <div className="h-1.5 md:h-2 w-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[t.category] }} />
                
                <div className="flex flex-col md:flex-row md:items-stretch">
                  <div className="p-4 flex-1 flex items-start gap-4">
                    <div 
                      className="shrink-0 w-12 h-12 md:w-14 md:h-14 border-4 border-stone-900 flex items-center justify-center font-black text-xl md:text-2xl text-stone-900 rotate-3 shadow-[3px_3px_0px_0px_#1c1917] md:shadow-[4px_4px_0px_0px_#1c1917] group-hover:rotate-0 transition-transform mt-1"
                      style={{ backgroundColor: CATEGORY_COLORS[t.category] }}
                    >
                      {t.category.charAt(0)}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1 md:space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                        <span className="text-[7px] md:text-[8px] font-mono-retro font-bold bg-stone-100 px-1.5 py-0.5 border-2 border-stone-900/10 text-stone-400 uppercase">
                          ID: {t.id.split('-')[0]}
                        </span>
                        <span className="text-[8px] md:text-[9px] bg-stone-900 text-white px-2 py-0.5 font-black uppercase">
                          {t.category}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <h4 className="font-black text-lg md:text-xl leading-tight text-stone-900 uppercase tracking-tight truncate">
                          {t.description || "Tanpa Keterangan"}
                        </h4>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[8px] md:text-[10px] bg-yellow-300 px-2 py-0.5 font-black uppercase text-stone-900 border-2 border-stone-900 flex items-center gap-1">
                          {getAccountIcon(account?.type)}
                          <span className="truncate max-w-[80px] sm:max-w-none">{account?.name || 'Akun Dihapus'}</span>
                        </span>
                        <p className="text-[8px] md:text-[10px] text-stone-500 uppercase font-black tracking-widest flex items-center gap-1">
                          <Icons.History /> {t.date}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 md:p-4 border-t-4 md:border-t-0 md:border-l-4 border-stone-900 bg-stone-50 flex items-center justify-between md:justify-center flex-row md:flex-col gap-3 md:min-w-[180px] lg:min-w-[220px]">
                    <span className={`font-mono-retro font-black text-xl md:text-2xl truncate ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(t.amount)}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(t.id);
                        }}
                        className="p-1.5 md:p-2 border-2 border-stone-900 bg-white hover:bg-rose-400 transition-all shadow-[2px_2px_0px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        title="Hapus Transaksi"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content - Symmetric Padding */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-5 md:p-6 border-t-4 border-stone-900 bg-stone-900 text-white animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-[9px] md:text-[10px] font-black uppercase text-yellow-300 tracking-widest mb-1">Catatan Detail</p>
                          <p className="text-xs md:text-sm font-bold leading-relaxed opacity-90">
                            {t.description || "Tidak ada rincian tambahan untuk transaksi ini."}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <div className="p-2 bg-white/10 border border-white/20 flex-1">
                            <p className="text-[7px] md:text-[8px] font-black uppercase text-white/50 mb-1">Tipe Wallet</p>
                            <div className="flex items-center gap-2">
                              {getAccountIcon(account?.type)}
                              <span className="text-[9px] md:text-[10px] font-black uppercase">{account?.type || 'UNKNOWN'}</span>
                            </div>
                          </div>
                          <div className="p-2 bg-white/10 border border-white/20 flex-1">
                            <p className="text-[7px] md:text-[8px] font-black uppercase text-white/50 mb-1">Arah Dana</p>
                            <span className={`text-[9px] md:text-[10px] font-black uppercase ${t.type === TransactionType.INCOME ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {t.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4 flex flex-col justify-between">
                        <div>
                          <p className="text-[9px] md:text-[10px] font-black uppercase text-yellow-300 tracking-widest mb-1">Dicatat Pada</p>
                          <p className="font-mono-retro text-xs md:text-sm uppercase opacity-90">
                            {formatDateTime(t.createdAt)}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-white/10">
                          <p className="text-[7px] md:text-[8px] font-black uppercase text-white/50 mb-1">UUID Transaksi</p>
                          <p className="font-mono-retro text-[7px] md:text-[8px] break-all opacity-30">{t.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
