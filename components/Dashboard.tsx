
import React, { useState, useEffect } from 'react';
import { SummaryData, User, Transaction, Account } from '../types';
import { Icons } from '../constants';
import { GoogleGenAI } from "@google/genai";
import FinanceCharts from './FinanceCharts';
import CategoryBreakdown from './CategoryBreakdown';
import TransactionList from './TransactionList';

interface DashboardProps {
  summary: SummaryData;
  user: User | null;
  transactions: Transaction[];
  accounts: Account[];
  onDeleteTransaction: (id: string) => void;
  onNavigateToWallets: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  summary, 
  user, 
  transactions, 
  accounts, 
  onDeleteTransaction,
  onNavigateToWallets 
}) => {
  const [aiTip, setAiTip] = useState<string>("Sistem sedang menganalisis dompetmu...");
  const [isLoadingTip, setIsLoadingTip] = useState(true);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Berikan tip keuangan singkat (max 15 kata) untuk pengguna bernama ${user?.name || 'Sobat'}. Saldo mereka saat ini adalah Rp${summary.totalBalance}. Berikan gaya bicara retro santai tapi memotivasi.`,
          config: {
            temperature: 0.8,
            topP: 0.9,
          }
        });
        setAiTip(response.text || "Tetap hemat, tetap keren!");
      } catch (err) {
        setAiTip("Hemat itu keren, boros itu cemen!");
      } finally {
        setIsLoadingTip(false);
      }
    };

    fetchTip();
  }, [user, summary.totalBalance]);

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

  return (
    <div className="space-y-10 relative pb-10">
      {/* AI Greeting Bubble */}
      <div className="flex justify-center md:justify-start mb-12 md:mb-16">
        <div className="bg-stone-900 text-white p-5 sm:p-6 border-4 sm:border-8 border-stone-900 retro-shadow-sm w-full sm:inline-block sm:min-w-[280px] max-w-2xl relative animate-in slide-in-from-left-6 duration-500">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-8 h-8 sm:w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center border-2 sm:border-4 border-white rotate-12 shrink-0">
               <span className="text-[10px] sm:text-xs text-stone-900 font-black">AI</span>
             </div>
             <div>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-yellow-300">DUWIT ASSISTANT PRO</span>
                <div className="h-0.5 sm:h-1 w-full bg-yellow-300 mt-0.5"></div>
             </div>
           </div>
           
           <div className="min-h-[2.5rem] sm:min-h-[3rem] flex items-center">
             {isLoadingTip ? (
               <div className="flex gap-2 sm:gap-3 py-2">
                 <div className="w-2 h-2 sm:w-3 h-3 bg-yellow-300 border-2 border-stone-900 animate-bounce" style={{ animationDelay: '0s' }} />
                 <div className="w-2 h-2 sm:w-3 h-3 bg-yellow-300 border-2 border-stone-900 animate-bounce" style={{ animationDelay: '0.1s' }} />
                 <div className="w-2 h-2 sm:w-3 h-3 bg-yellow-300 border-2 border-stone-900 animate-bounce" style={{ animationDelay: '0.2s' }} />
               </div>
             ) : (
               <p className="font-black italic text-lg sm:text-xl md:text-2xl leading-tight tracking-tight uppercase">
                 "{aiTip}"
               </p>
             )}
           </div>
           
           <div className="absolute -bottom-5 sm:-bottom-6 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 w-0 h-0 border-l-[15px] sm:border-l-[20px] border-l-transparent border-t-[20px] sm:border-t-[30px] border-t-stone-900 border-r-[15px] sm:border-r-[20px] border-r-transparent"></div>
           
           <div className="absolute -top-4 -right-4 sm:top-0 sm:right-0 lg:right-40 bg-rose-400 border-4 border-stone-900 px-3 sm:px-4 py-1 sm:py-2 retro-shadow-sm -rotate-6 font-black uppercase italic text-xs sm:text-sm animate-float">
              Ka-Ching!
           </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        <div 
          onClick={onNavigateToWallets}
          className="bg-white border-4 border-stone-900 overflow-hidden retro-shadow cursor-pointer hover:-translate-y-2 transition-transform group flex flex-col min-h-[160px] sm:min-h-[200px] relative"
        >
          <div className="bg-[#ced4da] border-b-4 border-stone-900 p-3 flex justify-between px-6 items-center group-hover:bg-[#74c0fc] transition-colors shrink-0">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-stone-900">Total Asset</span>
            <Icons.Wallet />
          </div>
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center min-w-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono-retro text-stone-900 tracking-tighter truncate leading-none">
              {formatCurrency(summary.totalBalance, true)}
            </h2>
            <div className="h-1 bg-stone-900 w-1/4 sm:w-1/2 mt-4 opacity-20 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-[9px] sm:text-[10px] font-black uppercase mt-3 sm:mt-4 text-stone-400 group-hover:text-stone-900 transition-colors">Manage Accounts →</p>
          </div>
        </div>

        <div className="bg-white border-4 border-stone-900 overflow-hidden retro-shadow flex flex-col min-h-[160px] sm:min-h-[200px] relative">
          <div className="bg-[#63e6be] border-b-4 border-stone-900 p-3 flex justify-between px-6 items-center shrink-0">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-stone-900">Pemasukan</span>
            <Icons.TrendUp />
          </div>
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center min-w-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono-retro text-emerald-700 tracking-tighter truncate leading-none">
              {formatCurrency(summary.totalIncome, true)}
            </h2>
            <p className="text-[8px] sm:text-[9px] font-black text-emerald-500 uppercase mt-2 tracking-widest">+ Money Maker</p>
          </div>
        </div>

        <div className="bg-white border-4 border-stone-900 overflow-hidden retro-shadow flex flex-col min-h-[160px] sm:min-h-[200px] relative sm:col-span-2 lg:col-span-1">
          <div className="bg-[#ff8787] border-b-4 border-stone-900 p-3 flex justify-between px-6 items-center shrink-0">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-stone-900">Pengeluaran</span>
            <Icons.TrendDown />
          </div>
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center min-w-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono-retro text-rose-700 tracking-tighter truncate leading-none">
              {formatCurrency(summary.totalExpense, true)}
            </h2>
            <p className="text-[8px] sm:text-[9px] font-black text-rose-500 uppercase mt-2 tracking-widest">- Cash Flow</p>
          </div>
        </div>
      </div>
      
      {/* Decorative Divider */}
      <div className="flex items-center gap-4 sm:gap-6 py-6 overflow-hidden">
        <div className="flex-1 h-1 sm:h-2 bg-stone-900 opacity-20 sm:opacity-100"></div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-3 h-3 sm:w-4 h-4 bg-stone-900 rotate-45"></div>
            <h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter bg-stone-900 text-white px-4 sm:px-8 py-2 retro-shadow-sm whitespace-nowrap">Analisis Dompet</h3>
            <div className="w-3 h-3 sm:w-4 h-4 bg-stone-900 rotate-45"></div>
        </div>
        <div className="flex-1 h-1 sm:h-2 bg-stone-900 opacity-20 sm:opacity-100"></div>
      </div>

      {/* Analysis Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        <div className="lg:col-span-2 space-y-8">
           <FinanceCharts transactions={transactions} />
           
           <div className="bg-white border-4 border-stone-900 p-6 retro-shadow">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Aktivitas Terbaru</h3>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-[10px] font-black uppercase underline underline-offset-4"
                >
                  Lihat Semua
                </button>
              </div>
              <TransactionList 
                transactions={transactions.slice(0, 5)} 
                accounts={accounts} 
                onDelete={onDeleteTransaction} 
                showFilters={false} 
              />
           </div>
        </div>

        <div className="lg:col-span-1">
          <CategoryBreakdown transactions={transactions} />
          
          <div className="mt-8 bg-sky-200 border-4 border-stone-900 p-6 retro-shadow rotate-1">
             <h4 className="font-black uppercase italic text-sm mb-2 flex items-center gap-2">
               <Icons.Palette /> Retro Insight
             </h4>
             <p className="text-xs font-bold uppercase leading-tight text-sky-900">
               Jangan lupa untuk selalu mengecek budget bulanan di menu "Budget" agar kondisi keuanganmu tetap stabil dan terkontrol!
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
