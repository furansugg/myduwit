
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, Account, SummaryData, Theme, Budget } from './types';
import { Icons, THEMES } from './constants';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import FinanceCharts from './components/FinanceCharts';
import AccountModal from './components/AccountModal';
import Sidebar from './components/Sidebar';
import WalletsView from './components/WalletsView';
import ConfirmationModal from './components/ConfirmationModal';
import CategoryBreakdown from './components/CategoryBreakdown';
import BudgetView from './components/BudgetView';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('myDuwit_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('myDuwit_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('myDuwit_budgets');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('myDuwit_theme');
    const themeId = saved || 'classic';
    return THEMES.find(t => t.id === themeId) || THEMES[0];
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'wallets' | 'budgets'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Deletion state
  const [deleteConfig, setDeleteConfig] = useState<{
    type: 'transaction' | 'account';
    id: string;
    isOpen: boolean;
  }>({ type: 'transaction', id: '', isOpen: false });

  useEffect(() => {
    localStorage.setItem('myDuwit_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('myDuwit_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('myDuwit_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('myDuwit_theme', currentTheme.id);
    const root = document.documentElement;
    root.style.setProperty('--retro-bg', currentTheme.bg);
    root.style.setProperty('--retro-black', currentTheme.black);
    root.style.setProperty('--card-bg', currentTheme.cardBg);
  }, [currentTheme]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = { 
      ...t, 
      id: crypto.randomUUID(),
      createdAt: t.createdAt || new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setIsFormOpen(false);
  };

  const addAccount = (acc: Omit<Account, 'id'>) => {
    const newAcc: Account = { ...acc, id: crypto.randomUUID() };
    setAccounts(prev => [...prev, newAcc]);
    setIsAccountModalOpen(false);
  };

  const saveBudget = (category: string, limit: number) => {
    setBudgets(prev => {
      const filtered = prev.filter(b => b.category !== category);
      return [...filtered, { category, limit }];
    });
  };

  const initiateDelete = (type: 'transaction' | 'account', id: string) => {
    setDeleteConfig({ type, id, isOpen: true });
  };

  const handleConfirmDelete = () => {
    if (deleteConfig.type === 'transaction') {
      setTransactions(prev => prev.filter(t => t.id !== deleteConfig.id));
    } else {
      // Clean up transactions associated with this account
      setTransactions(prev => prev.filter(t => t.accountId !== deleteConfig.id));
      setAccounts(prev => prev.filter(a => a.id !== deleteConfig.id));
    }
    setDeleteConfig(prev => ({ ...prev, isOpen: false }));
  };

  const summary = useMemo<SummaryData>(() => {
    const accountBalances: Record<string, number> = {};
    accounts.forEach(acc => {
      accountBalances[acc.id] = acc.initialBalance;
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      const amount = t.amount;
      if (t.type === TransactionType.INCOME) {
        totalIncome += amount;
        if (accountBalances[t.accountId] !== undefined) {
          accountBalances[t.accountId] += amount;
        }
      } else {
        totalExpense += amount;
        if (accountBalances[t.accountId] !== undefined) {
          accountBalances[t.accountId] -= amount;
        }
      }
    });

    const totalBalance = Object.values(accountBalances).reduce((a, b) => a + b, 0);

    return { totalIncome, totalExpense, totalBalance, accountBalances };
  }, [transactions, accounts]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Dashboard summary={summary} onNavigateToWallets={() => setActiveTab('wallets')} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-10">
                <FinanceCharts transactions={transactions} />
                <TransactionList 
                  transactions={transactions.slice(0, 5)} 
                  accounts={accounts}
                  onDelete={(id) => initiateDelete('transaction', id)}
                  showFilters={false}
                />
                {transactions.length > 5 && (
                  <button 
                    onClick={() => setActiveTab('history')}
                    className="w-full py-4 border-4 border-dashed border-stone-400 font-bold uppercase text-stone-500 hover:text-stone-900 hover:border-stone-900 transition-all bg-white/50"
                  >
                    Lihat Seluruh Riwayat
                  </button>
                )}
              </div>
              
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  <button 
                    onClick={() => setIsFormOpen(true)}
                    disabled={accounts.length === 0}
                    className="w-full bg-[#63e6be] border-4 border-stone-900 p-6 retro-shadow-hover transition-all flex items-center justify-center gap-3 text-xl font-bold text-stone-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icons.Plus /> CATAT BARU
                  </button>
                  
                  <div className="bg-[#74c0fc] border-4 border-stone-900 p-6 retro-shadow">
                    <h3 className="text-xl font-bold mb-2 uppercase">Status Keuangan</h3>
                    <p className="text-stone-900 italic font-medium">
                      {summary.totalBalance > 0 
                        ? "Kerja bagus! Saldo kamu positif. Tetap jaga pengeluaran ya!"
                        : "Aduh, saldo lagi tipis nih. Yuk mulai berhemat hari ini."}
                    </p>
                  </div>

                  <CategoryBreakdown transactions={transactions} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'wallets':
        return (
          <WalletsView 
            accounts={accounts} 
            summary={summary} 
            onAddAccount={() => setIsAccountModalOpen(true)}
            onDeleteAccount={(id) => initiateDelete('account', id)}
          />
        );
      case 'budgets':
        return (
          <BudgetView 
            transactions={transactions} 
            budgets={budgets} 
            onSaveBudget={saveBudget} 
          />
        );
      case 'history':
        return (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TransactionList 
              transactions={transactions} 
              accounts={accounts}
              onDelete={(id) => initiateDelete('transaction', id)} 
              showFilters={true}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex">
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
      />

      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <header className="flex justify-between items-center mb-8 pb-4 border-b-4 border-stone-900">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 border-4 border-stone-900 bg-white"
            >
              <Icons.Menu />
            </button>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-stone-900">
              {activeTab === 'dashboard' ? 'Overview' : activeTab === 'wallets' ? 'My Wallets' : activeTab === 'budgets' ? 'My Budgets' : 'Riwayat'}
            </h1>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-xs font-black uppercase tracking-widest bg-stone-900 text-white px-2 py-1 border-2 border-stone-900">
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </header>

        {renderActiveView()}
      </main>

      {isFormOpen && (
        <TransactionForm 
          accounts={accounts}
          onAdd={addTransaction} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}

      {isAccountModalOpen && (
        <AccountModal 
          onSave={addAccount}
          onClose={() => setIsAccountModalOpen(false)}
        />
      )}

      <ConfirmationModal
        isOpen={deleteConfig.isOpen}
        title={deleteConfig.type === 'account' ? 'Hapus Wallet?' : 'Hapus Transaksi?'}
        message={
          deleteConfig.type === 'account' 
            ? 'Menghapus wallet ini juga akan menghapus semua riwayat transaksi yang terkait dengannya. Tindakan ini tidak bisa dibatalkan.'
            : 'Apakah kamu yakin ingin menghapus catatan transaksi ini? Data akan hilang selamanya.'
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfig(prev => ({ ...prev, isOpen: false }))}
      />

      <button 
        onClick={() => setIsFormOpen(true)}
        disabled={accounts.length === 0}
        className="fixed bottom-6 right-6 lg:hidden bg-[#63e6be] border-4 border-stone-900 w-16 h-16 rounded-none flex items-center justify-center retro-shadow-hover z-50 text-stone-900 disabled:opacity-50"
      >
        <Icons.Plus />
      </button>
    </div>
  );
};

export default App;
