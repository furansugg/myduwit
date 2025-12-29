
import React from 'react';
import { Account, AccountType, SummaryData } from '../types';
import { Icons } from '../constants';

interface WalletsViewProps {
  accounts: Account[];
  summary: SummaryData;
  onAddAccount: () => void;
  onEditAccount: (account: Account) => void;
  onDeleteAccount: (id: string) => void;
}

const WalletsView: React.FC<WalletsViewProps> = ({ accounts, summary, onAddAccount, onEditAccount, onDeleteAccount }) => {
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 md:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b-4 border-stone-900 pb-4 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-stone-900">Wallets</h2>
          <p className="text-stone-500 font-bold uppercase text-[10px] md:text-xs tracking-widest mt-1">Kelola sumber dana & saldo awal kamu</p>
        </div>
        <button 
          onClick={onAddAccount}
          className="w-full sm:w-auto text-xs md:text-sm font-black border-4 border-stone-900 px-6 py-3 bg-[#63e6be] hover:bg-white transition-all retro-shadow active:translate-y-1 active:shadow-none uppercase"
        >
          + Tambah Wallet
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {accounts.map(acc => (
          <div 
            key={acc.id}
            className={`${getAccountColor(acc.type)} border-4 border-stone-900 retro-shadow relative group overflow-hidden flex flex-col transition-transform hover:-translate-y-1`}
          >
            <div className="bg-stone-900 text-white p-2.5 sm:p-3 border-b-4 border-stone-900 flex justify-between items-center px-4 shrink-0">
               <div className="flex items-center gap-2">
                 {getAccountIcon(acc.type)}
                 <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider">{acc.type}</span>
               </div>
               <div className="flex items-center gap-3">
                 <button 
                   onClick={() => onEditAccount(acc)}
                   className="hover:text-emerald-400 transition-all"
                   title="Edit Wallet"
                 >
                   <Icons.Edit />
                 </button>
                 <button 
                  onClick={() => onDeleteAccount(acc.id)}
                  className="hover:text-rose-400 transition-all"
                  title="Hapus Wallet"
                >
                  <Icons.Trash />
                </button>
               </div>
            </div>
            
            <div className="p-5 sm:p-6 bg-white/40 backdrop-blur-sm flex-1 flex flex-col">
              <h4 className="text-xl md:text-2xl font-black text-stone-900 mb-4 truncate uppercase tracking-tight" title={acc.name}>
                {acc.name}
              </h4>
              <div className="mt-auto space-y-4">
                <div className="overflow-hidden">
                  <p className="text-[9px] md:text-[10px] font-black uppercase text-stone-600 mb-1">Saldo Saat Ini</p>
                  <p className="text-xl md:text-2xl font-black font-mono-retro text-stone-900 tracking-tighter truncate">
                    {formatCurrency(summary.accountBalances[acc.id] || 0)}
                  </p>
                </div>
                <div className="pt-3 border-t-2 border-stone-900/10 flex justify-between items-center gap-2">
                  <div className="min-w-0">
                    <p className="text-[7px] md:text-[8px] font-black uppercase text-stone-500">Saldo Awal</p>
                    <p className="text-[10px] md:text-xs font-bold font-mono-retro truncate opacity-70">
                      {formatCurrency(acc.initialBalance)}
                    </p>
                  </div>
                  <div className="w-8 h-8 opacity-10 shrink-0">
                    {getAccountIcon(acc.type)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {accounts.length === 0 && (
          <div className="col-span-full border-4 border-dashed border-stone-400 bg-white/50 p-12 md:p-20 text-center">
            <div className="flex justify-center mb-4 md:mb-6 opacity-30">
              <Icons.Wallet />
            </div>
            <p className="text-stone-400 font-black uppercase italic text-lg md:text-xl">Belum ada wallet.<br className="sm:hidden"/> Mulai dengan membuat satu!</p>
          </div>
        )}
      </div>

      <div className="bg-white border-4 border-stone-900 p-6 md:p-8 retro-shadow mt-8 md:mt-12 overflow-hidden relative">
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="bg-[#ffd43b] p-2 border-2 border-stone-900 shrink-0 rotate-3">
            <Icons.Wallet />
          </div>
          <h3 className="text-xl font-black uppercase italic tracking-tighter">Statistik Akun</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
          <div className="p-4 bg-stone-50 border-2 border-stone-900/10 hover:border-stone-900 transition-colors">
            <p className="text-[9px] font-black uppercase text-stone-500 tracking-widest mb-1">Total Akun</p>
            <p className="text-2xl font-black text-stone-900">{accounts.length}</p>
          </div>
          <div className="p-4 bg-stone-50 border-2 border-stone-900/10 sm:col-span-1 md:col-span-3 overflow-hidden hover:border-stone-900 transition-colors">
            <p className="text-[9px] font-black uppercase text-stone-500 tracking-widest mb-1">Saldo Gabungan</p>
            <p className="text-xl md:text-2xl font-black font-mono-retro text-stone-900 tracking-tighter break-words">
              {formatCurrency(summary.totalBalance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletsView;
