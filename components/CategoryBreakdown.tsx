import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ transactions }) => {
  const breakdown = useMemo(() => {
    const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const categoryTotals: Record<string, number> = {};
    let totalExpenditure = 0;

    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      totalExpenditure += t.amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpenditure > 0 ? (amount / totalExpenditure) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  if (breakdown.length === 0) return null;

  return (
    <div className="bg-white border-4 border-stone-900 p-6 retro-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#ff90e8] p-1 border-2 border-stone-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
        </div>
        <h3 className="text-xl font-black uppercase italic tracking-tighter">Ranking Pengeluaran</h3>
      </div>

      <div className="space-y-4">
        {breakdown.map((item) => (
          <div key={item.name} className="group">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] font-black uppercase text-stone-500 tracking-widest">{item.name}</span>
              <span className="font-mono-retro font-bold text-xs">{formatCurrency(item.amount)}</span>
            </div>
            <div className="h-4 border-2 border-stone-900 bg-stone-100 overflow-hidden relative">
              <div 
                className="h-full transition-all duration-1000 ease-out border-r-2 border-stone-900"
                style={{ 
                  width: `${item.percentage}%`, 
                  backgroundColor: CATEGORY_COLORS[item.name] || '#ced4da' 
                }}
              />
              <span className="absolute inset-0 flex items-center justify-end pr-2 text-[8px] font-black text-stone-900 opacity-60">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t-2 border-dashed border-stone-300">
        <p className="text-[9px] font-bold text-stone-400 uppercase italic">
          * Diurutkan dari pengeluaran terbanyak
        </p>
      </div>
    </div>
  );
};

export default CategoryBreakdown;