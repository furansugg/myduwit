import React from 'react';
import { Account, AccountType, SummaryData } from '../types';
import { Icons } from '../constants';

interface WalletsViewProps {
  accounts: Account[];
  summary: SummaryData;
  onAddAccount: () => void;
  onDeleteAccount: (id: string) => void;
}

const WalletsView: React.FC<WalletsViewProps> = ({ accounts, summary, onAddAccount, onDeleteAccount }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case AccountType.BANK: return <Icons.Bank />;
      case AccountType.EWALLET: return <Icons.Smartphone />;
      case AccountType.CASH: return <Icons.Cash />;
    }
  };

  const getAccountColor = (type: AccountType) => {
    switch (type) {
      case AccountType.BANK: return 'bg-[#74c0fc]';
      case AccountType.EWALLET: return 'bg-[#da77f2]';
      case AccountType.CASH: return 'bg-[#ffd43b]';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b-4 border-stone-900 pb-4 gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-stone-900">Wallets</h2>
          <p className="text-stone-500 font-bold uppercase text-xs tracking-widest mt-1">Kelola sumber dana & saldo awal kamu</p>
        </div>
        <button 
          onClick={onAddAccount}
          className="w-full sm:w-auto text-sm font-black border-4 border-stone-900 px-6 py-3 bg-[#63e6be] hover:bg-white transition-all retro-shadow active:translate-y-1 active:shadow-none uppercase"
        >
          + Tambah Wallet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {accounts.map(acc => (
          <div 
            key={acc.id}
            className={`${getAccountColor(acc.type)} border-4 border-stone-900 retro-shadow relative group overflow-hidden flex flex-col`}
          >
            <div className="bg-stone-900 text-white p-3 border-b-4 border-stone-900 flex justify-between items-center px-4 shrink-0">
               <div className="flex items-center gap-2">
                 {getAccountIcon(acc.type)}
                 <span className="text-[10px] font-black uppercase tracking-wider">{acc.type}</span>
               </div>
               <button 
                onClick={() => onDeleteAccount(acc.id)}
                className="p-1 hover:text-rose-400 transition-all"
              >
                <Icons.Trash />
              </button>
            </div>
            
            <div className="p-6 bg-white/40 backdrop-blur-sm flex-1">
              <h4 className="text-2xl font-black text-stone-900 mb-4 truncate uppercase tracking-tight" title={acc.name}>
                {acc.name}
              </h4>
              <div className="space-y-4">
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black uppercase text-stone-600 mb-1">Saldo Saat Ini</p>
                  <p className="text-2xl font-black font-mono-retro text-stone-900 tracking-tighter break-words">
                    {formatCurrency(summary.accountBalances[acc.id] || 0)}
                  </p>
                </div>
                <div className="pt-4 border-t-2 border-stone-900/10 flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="text-[8px] font-black uppercase text-stone-500">Saldo Awal</p>
                    <p className="text-xs font-bold font-mono-retro truncate">
                      {formatCurrency(acc.initialBalance)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decoration */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-stone-900/5 rounded-full rotate-12 pointer-events-none" />
          </div>
        ))}

        {accounts.length === 0 && (
          <div className="col-span-full border-4 border-dashed border-stone-400 bg-white/50 p-20 text-center">
            <div className="flex justify-center mb-6 opacity-30">
              <Icons.Wallet />
            </div>
            <p className="text-stone-400 font-black uppercase italic text-xl">Belum ada wallet. Mulai dengan membuat satu!</p>
          </div>
        )}
      </div>

      {/* Quick Summary Card */}
      <div className="bg-white border-4 border-stone-900 p-6 md:p-8 retro-shadow mt-12 overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-[#ffd43b] p-2 border-2 border-stone-900 shrink-0">
            <Icons.Wallet />
          </div>
          <h3 className="text-xl font-black uppercase italic tracking-tighter">Statistik Akun</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 bg-stone-50 border-2 border-stone-900/10">
            <p className="text-[10px] font-black uppercase text-stone-500 tracking-widest mb-1">Total Akun</p>
            <p className="text-2xl font-black text-stone-900">{accounts.length}</p>
          </div>
          <div className="p-4 bg-stone-50 border-2 border-stone-900/10 sm:col-span-1 md:col-span-3 overflow-hidden">
            <p className="text-[10px] font-black uppercase text-stone-500 tracking-widest mb-1">Saldo Gabungan</p>
            <p className="text-2xl font-black font-mono-retro text-stone-900 tracking-tighter break-words">
              {formatCurrency(summary.totalBalance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletsView;