import React from 'react';
import { SummaryData } from '../types';
import { Icons } from '../constants';

interface DashboardProps {
  summary: SummaryData;
  onNavigateToWallets: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ summary, onNavigateToWallets }) => {
  /**
   * Formats numbers into a readable currency string.
   * Uses compact notation (e.g., Rp1,2jt, Rp2,5m) for values over 1 million
   * to prevent UI overflow in summary cards.
   */
  const formatCurrency = (val: number, compact = false) => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      notation: compact && Math.abs(val) >= 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: compact ? 1 : 0,
      minimumFractionDigits: 0
    });
    return formatter.format(val);
  };

  const FullBalanceTooltip = ({ value }: { value: number }) => (
    <span className="sr-only sm:not-sr-only text-[10px] font-mono-retro text-stone-400 mt-1">
      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)}
    </span>
  );

  return (
    <div className="space-y-10">
      {/* Top Level Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          onClick={onNavigateToWallets}
          className="bg-white border-4 border-stone-900 overflow-hidden retro-shadow cursor-pointer hover:-translate-y-1 transition-transform group flex flex-col min-h-[160px]"
          title="Klik untuk detail wallet"
        >
          <div className="bg-[#ced4da] border-b-4 border-stone-900 p-2 flex justify-between px-4 items-center group-hover:bg-[#74c0fc] transition-colors shrink-0">
            <span className="text-[10px] font-black uppercase">Total Kekayaan</span>
            <Icons.Wallet />
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center min-w-0">
            <h2 className="text-3xl sm:text-4xl font-black font-mono-retro text-stone-900 tracking-tighter truncate leading-tight">
              {formatCurrency(summary.totalBalance, true)}
            </h2>
            {Math.abs(summary.totalBalance) >= 1000000 && (
              <p className="text-[9px] font-bold text-stone-400 uppercase mt-1">
                {formatCurrency(summary.totalBalance)}
              </p>
            )}
            <p className="text-[9px] font-bold uppercase mt-2 text-stone-400 group-hover:text-stone-900 transition-colors">Klik untuk kelola wallets →</p>
          </div>
        </div>

        <div className="bg-white border-4 border-stone-900 overflow-hidden retro-shadow flex flex-col min-h-[160px]">
          <div className="bg-[#63e6be] border-b-4 border-stone-900 p-2 flex justify-between px-4 items-center shrink-0">
            <span className="text-[10px] font-black uppercase">Total Masuk</span>
            <Icons.TrendUp />
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center min-w-0">
            <h2 className="text-3xl sm:text-4xl font-black font-mono-retro text-emerald-700 tracking-tighter truncate leading-tight">
              {formatCurrency(summary.totalIncome, true)}
            </h2>
            {Math.abs(summary.totalIncome) >= 1000000 && (
              <p className="text-[9px] font-bold text-stone-400 uppercase mt-1">
                {formatCurrency(summary.totalIncome)}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white border-4 border-stone-900 overflow-hidden retro-shadow flex flex-col min-h-[160px]">
          <div className="bg-[#ff8787] border-b-4 border-stone-900 p-2 flex justify-between px-4 items-center shrink-0">
            <span className="text-[10px] font-black uppercase">Total Keluar</span>
            <Icons.TrendDown />
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center min-w-0">
            <h2 className="text-3xl sm:text-4xl font-black font-mono-retro text-rose-700 tracking-tighter truncate leading-tight">
              {formatCurrency(summary.totalExpense, true)}
            </h2>
            {Math.abs(summary.totalExpense) >= 1000000 && (
              <p className="text-[9px] font-bold text-stone-400 uppercase mt-1">
                {formatCurrency(summary.totalExpense)}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Title Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-1 bg-stone-900"></div>
        <h3 className="text-xl font-black uppercase italic tracking-tighter bg-stone-900 text-white px-4 py-1">Analisis & Aktivitas</h3>
        <div className="flex-1 h-1 bg-stone-900"></div>
      </div>
    </div>
  );
};

export default Dashboard;