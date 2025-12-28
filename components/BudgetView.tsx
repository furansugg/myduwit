
import React, { useMemo } from 'react';
import { Transaction, TransactionType, Budget } from '../types';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, Icons } from '../constants';

interface BudgetViewProps {
  transactions: Transaction[];
  budgets: Budget[];
  onSaveBudget: (category: string, limit: number) => void;
}

const BudgetView: React.FC<BudgetViewProps> = ({ transactions, budgets, onSaveBudget }) => {
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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
      <div className="border-b-4 border-stone-900 pb-4">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-stone-900">Monthly Budgets</h2>
        <p className="text-stone-500 font-bold uppercase text-xs tracking-widest mt-1">Set batas pengeluaran bulanan kamu</p>
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
            <div key={category} className="bg-white border-4 border-stone-900 p-6 retro-shadow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 border-2 border-stone-900 flex items-center justify-center font-black"
                    style={{ backgroundColor: CATEGORY_COLORS[category] }}
                  >
                    {category.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-tight text-stone-900">{category}</h3>
                    <p className="text-[10px] font-bold text-stone-500 uppercase">Bulan Ini</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black font-mono-retro">
                    {formatCurrency(spending)}
                  </p>
                  <p className="text-[8px] font-bold uppercase text-stone-400">Terpakai</p>
                </div>
              </div>

              <div className="mb-6 space-y-1">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span>Progress</span>
                  <span className={isOver ? 'text-rose-600' : isNear ? 'text-amber-600' : 'text-emerald-600'}>
                    {limit > 0 ? `${percentage.toFixed(0)}%` : 'No Budget'}
                  </span>
                </div>
                <div className="h-4 border-2 border-stone-900 bg-stone-100 overflow-hidden relative">
                  <div 
                    className={`h-full transition-all duration-500 border-r-2 border-stone-900 ${
                      isOver ? 'bg-rose-400' : isNear ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-auto pt-4 border-t-2 border-dashed border-stone-200">
                <label className="block text-[10px] font-black uppercase text-stone-500 mb-2 tracking-widest">Atur Limit (Rp)</label>
                <div className="flex gap-2">
                  <input 
                    type="number"
                    defaultValue={limit || ''}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      if (val !== limit) onSaveBudget(category, val);
                    }}
                    placeholder="Set limit..."
                    className="flex-1 border-2 border-stone-900 p-2 font-mono-retro text-sm outline-none bg-stone-50 focus:bg-white"
                  />
                  <div className="w-10 h-10 bg-stone-900 flex items-center justify-center text-white">
                    <Icons.Plus />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetView;
