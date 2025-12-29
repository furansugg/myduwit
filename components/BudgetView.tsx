
import React, { useMemo, useState } from 'react';
import { Transaction, TransactionType, Budget } from '../types';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, Icons } from '../constants';
import BudgetModal from './BudgetModal';

interface BudgetViewProps {
  transactions: Transaction[];
  budgets: Budget[];
  onSaveBudget: (category: string, limit: number) => void;
}

const BudgetView: React.FC<BudgetViewProps> = ({ transactions, budgets, onSaveBudget }) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  const currentMonthSpending = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const spending: Record<string, number> = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .forEach(t => {
        spending[t.category] = (spending[t.category] || 0) + t.amount;
      });

    return spending;
  }, [transactions]);

  const stats = useMemo(() => {
    let totalLimit = 0;
    let totalSpent = 0;

    EXPENSE_CATEGORIES.forEach(cat => {
      const budget = budgets.find(b => b.category === cat);
      if (budget && budget.limit > 0) {
        totalLimit += budget.limit;
        totalSpent += (currentMonthSpending[cat] || 0);
      }
    });

    const percentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
    const remaining = totalLimit - totalSpent;

    return { totalLimit, totalSpent, percentage, remaining };
  }, [budgets, currentMonthSpending]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12 pb-10">
      {/* Header & Stats Section */}
      <div className="flex flex-col gap-8">
        <div className="border-b-4 border-stone-900 pb-4">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-stone-900">Budget Manager</h2>
          <p className="text-stone-500 font-bold uppercase text-xs tracking-widest mt-1">Pantau & kendalikan pengeluaran bulananmu</p>
        </div>

        {/* Global Summary Card */}
        <div className="bg-white border-4 border-stone-900 p-8 retro-shadow grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden relative">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Alokasi Budget</p>
            <p className="text-3xl font-black font-mono-retro text-stone-900">{formatCurrency(stats.totalLimit)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Total Pemakaian</p>
            <p className={`text-3xl font-black font-mono-retro ${stats.percentage > 100 ? 'text-rose-600' : 'text-stone-900'}`}>
              {formatCurrency(stats.totalSpent)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Sisa Budget</p>
            <p className={`text-3xl font-black font-mono-retro ${stats.remaining < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {formatCurrency(stats.remaining)}
            </p>
          </div>

          <div className="col-span-1 md:col-span-3 pt-4 border-t-2 border-dashed border-stone-200">
             <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">Kesehatan Dompet</span>
                <span className="text-xs font-black font-mono-retro">{stats.percentage.toFixed(1)}%</span>
             </div>
             <div className="h-6 border-4 border-stone-900 bg-stone-100 overflow-hidden relative">
                <div 
                  className={`h-full transition-all duration-700 border-r-4 border-stone-900 ${
                    stats.percentage > 100 ? 'bg-rose-400' : stats.percentage > 80 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                />
             </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-stone-900/5 rounded-full rotate-45 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {EXPENSE_CATEGORIES.map(category => {
          const budget = budgets.find(b => b.category === category);
          const spending = currentMonthSpending[category] || 0;
          const limit = budget?.limit || 0;
          const percentage = limit > 0 ? (spending / limit) * 100 : 0;
          const isOver = spending > limit && limit > 0;
          const isNear = percentage > 80 && !isOver;

          return (
            <div key={category} className="bg-white border-4 border-stone-900 p-6 retro-shadow flex flex-col group hover:translate-y-[-4px] transition-transform">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 border-4 border-stone-900 flex items-center justify-center font-black text-2xl rotate-2 group-hover:rotate-0 transition-transform"
                    style={{ backgroundColor: CATEGORY_COLORS[category] }}
                  >
                    {category.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-stone-900">{category}</h3>
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Budget Bulanan</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEditingCategory(category)}
                  className="p-2 border-2 border-stone-900 bg-white hover:bg-stone-900 hover:text-white transition-all shadow-[2px_2px_0px_0px_#1c1917] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                >
                  <Icons.Edit />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase text-stone-400">Terpakai</p>
                      <p className="text-lg font-black font-mono-retro">{formatCurrency(spending)}</p>
                   </div>
                   <div className="text-right space-y-1">
                      <p className="text-[9px] font-black uppercase text-stone-400">Limit</p>
                      <p className="text-lg font-black font-mono-retro">{limit > 0 ? formatCurrency(limit) : '∞'}</p>
                   </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black uppercase">
                    <span className="text-stone-500">Pemakaian</span>
                    <span className={isOver ? 'text-rose-600' : isNear ? 'text-amber-600' : 'text-emerald-600'}>
                      {limit > 0 ? `${percentage.toFixed(0)}%` : 'Belum Diatur'}
                    </span>
                  </div>
                  <div className="h-5 border-2 border-stone-900 bg-stone-50 overflow-hidden relative">
                    <div 
                      className={`h-full transition-all duration-500 border-r-2 border-stone-900 ${
                        isOver ? 'bg-rose-400' : isNear ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t-2 border-dashed border-stone-200 flex justify-between items-center">
                 {isOver ? (
                   <span className="text-[10px] font-black text-rose-600 uppercase flex items-center gap-1">
                     <span className="bg-rose-600 text-white w-3 h-3 flex items-center justify-center rounded-full text-[8px]">!</span> Overbudget
                   </span>
                 ) : (
                   <span className="text-[10px] font-black text-stone-400 uppercase">
                     {limit > 0 ? `${formatCurrency(limit - spending)} tersisa` : 'Klik edit untuk pasang limit'}
                   </span>
                 )}
                 <button 
                  onClick={() => setEditingCategory(category)}
                  className="text-[9px] font-black uppercase underline underline-offset-4 hover:text-stone-500"
                 >
                   Adjust Limit
                 </button>
              </div>
            </div>
          );
        })}
      </div>

      {editingCategory && (
        <BudgetModal 
          category={editingCategory}
          currentLimit={budgets.find(b => b.category === editingCategory)?.limit || 0}
          currentSpending={currentMonthSpending[editingCategory] || 0}
          onSave={(limit) => {
            onSaveBudget(editingCategory, limit);
            setEditingCategory(null);
          }}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
};

export default BudgetView;
