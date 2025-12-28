import React, { useMemo, useState, useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip
} from 'recharts';
import { Transaction, TransactionType } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface FinanceChartsProps {
  transactions: Transaction[];
}

const FinanceCharts: React.FC<FinanceChartsProps> = ({ transactions }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pieData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const categoryMap: Record<string, number> = {};
    
    expenses.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    return Object.keys(categoryMap).map(cat => ({
      name: cat,
      value: categoryMap[cat]
    }));
  }, [transactions]);

  const barData = useMemo(() => {
    const dateMap: Record<string, { income: number; expense: number }> = {};
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sorted.forEach(t => {
      if (!dateMap[t.date]) dateMap[t.date] = { income: 0, expense: 0 };
      if (t.type === TransactionType.INCOME) {
        dateMap[t.date].income += t.amount;
      } else {
        dateMap[t.date].expense += t.amount;
      }
    });

    return Object.keys(dateMap).slice(-7).map(date => ({
      date: date.split('-').slice(1).join('/'),
      income: dateMap[date].income,
      expense: dateMap[date].expense
    }));
  }, [transactions]);

  if (!isMounted || transactions.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white border-4 border-stone-800 p-6 retro-shadow">
        <h3 className="text-xl font-bold uppercase mb-4">Distribusi Biaya</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="#292524"
                strokeWidth={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#e7e5e4'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fffbeb', 
                  border: '4px solid #292524',
                  fontFamily: 'Space Grotesk'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border-4 border-stone-800 p-6 retro-shadow">
        <h3 className="text-xl font-bold uppercase mb-4">Arus Kas (7 Sesi Terakhir)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="date" stroke="#292524" fontSize={10} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{ 
                  backgroundColor: '#fffbeb', 
                  border: '4px solid #292524',
                  fontFamily: 'Space Grotesk'
                }}
              />
              <Bar dataKey="income" fill="#a7f3d0" stroke="#292524" strokeWidth={2} />
              <Bar dataKey="expense" fill="#fda4af" stroke="#292524" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinanceCharts;