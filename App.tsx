
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, Account, SummaryData, Theme, Budget, User } from './types';
import { Icons, THEMES } from './constants';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import AccountModal from './components/AccountModal';
import Sidebar from './components/Sidebar';
import WalletsView from './components/WalletsView';
import ConfirmationModal from './components/ConfirmationModal';
import BudgetView from './components/BudgetView';
import LoginView from './components/LoginView';
import LandingPage from './components/LandingPage';
import { supabase, isSupabaseConfigured } from './lib/supabase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('myDuwit_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [viewMode, setViewMode] = useState<'landing' | 'auth' | 'app'>(() => {
    const saved = localStorage.getItem('myDuwit_user');
    return saved ? 'app' : 'landing';
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('myDuwit_theme');
    const themeId = saved || 'classic';
    return THEMES.find(t => t.id === themeId) || THEMES[0];
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'wallets' | 'budgets'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<Account | undefined>(undefined);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [deleteConfig, setDeleteConfig] = useState<{
    type: 'transaction' | 'account';
    id: string;
    isOpen: boolean;
  }>({ type: 'transaction', id: '', isOpen: false });

  const fetchData = async (userId: string) => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    try {
      const [accRes, transRes, budRes] = await Promise.all([
        supabase.from('accounts').select('*').eq('user_id', userId),
        supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
        supabase.from('budgets').select('*').eq('user_id', userId)
      ]);
      if (accRes.error) throw accRes.error;
      if (transRes.error) throw transRes.error;
      if (budRes.error) throw budRes.error;

      setAccounts(accRes.data.map(a => ({ id: a.id, name: a.name, type: a.type, initialBalance: a.initial_balance })));
      // Fix: Renamed account_id to accountId to match Transaction interface
      setTransactions(transRes.data.map(t => ({ id: t.id, amount: t.amount, type: t.type, category: t.category, description: t.description, date: t.date, accountId: t.account_id, createdAt: t.created_at })));
      setBudgets(budRes.data.map(b => ({ category: b.category, limit: b.limit_amount })));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData(user.id);
      localStorage.setItem('myDuwit_user', JSON.stringify(user));
      setViewMode('app');
    } else {
      localStorage.removeItem('myDuwit_user');
      setTransactions([]);
      setAccounts([]);
      setBudgets([]);
      if (viewMode !== 'auth') setViewMode('landing');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('myDuwit_theme', currentTheme.id);
    const root = document.documentElement;
    root.style.setProperty('--retro-bg', currentTheme.bg);
    root.style.setProperty('--retro-black', currentTheme.black);
    root.style.setProperty('--card-bg', currentTheme.cardBg);
  }, [currentTheme]);

  const handleLogin = (u: User) => {
    setUser(u);
    setActiveTab('dashboard');
    setViewMode('app');
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null);
    setIsLogoutModalOpen(false);
    setViewMode('landing');
  };

  const addTransaction = async (t: Omit<Transaction, 'id'>) => {
    if (!user || !isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase.from('transactions').insert([{ user_id: user.id, amount: t.amount, type: t.type, category: t.category, description: t.description, date: t.date, account_id: t.accountId }]).select();
      if (error) throw error;
      setTransactions(prev => [{ ...t, id: data[0].id, createdAt: data[0].created_at }, ...prev]);
      setIsFormOpen(false);
    } catch (err) { console.error(err); }
  };

  const saveAccount = async (acc: Account | Omit<Account, 'id'>) => {
    if (!user || !isSupabaseConfigured) return;
    try {
      if ('id' in acc) {
        // Fix: Renamed acc.initial_balance to acc.initialBalance to match Account interface
        await supabase.from('accounts').update({ name: acc.name, type: acc.type, initial_balance: acc.initialBalance }).eq('id', acc.id);
        setAccounts(prev => prev.map(a => a.id === acc.id ? acc as Account : a));
      } else {
        const { data } = await supabase.from('accounts').insert([{ user_id: user.id, name: acc.name, type: acc.type, initial_balance: acc.initialBalance }]).select();
        setAccounts(prev => [...prev, { ...acc, id: data[0].id }]);
      }
      setIsAccountModalOpen(false);
    } catch (err) { console.error(err); }
  };

  const saveBudget = async (category: string, limit: number) => {
    if (!user || !isSupabaseConfigured) return;
    try {
      const { data: existing } = await supabase.from('budgets').select('id').eq('user_id', user.id).eq('category', category).single();
      if (existing) await supabase.from('budgets').update({ limit_amount: limit }).eq('id', existing.id);
      else await supabase.from('budgets').insert([{ user_id: user.id, category, limit_amount: limit }]);
      setBudgets(prev => [...prev.filter(b => b.category !== category), { category, limit }]);
    } catch (err) { console.error(err); }
  };

  const handleConfirmDelete = async () => {
    if (!isSupabaseConfigured) return;
    try {
      if (deleteConfig.type === 'transaction') {
        await supabase.from('transactions').delete().eq('id', deleteConfig.id);
        setTransactions(prev => prev.filter(t => t.id !== deleteConfig.id));
      } else {
        await supabase.from('accounts').delete().eq('id', deleteConfig.id);
        setTransactions(prev => prev.filter(t => t.accountId !== deleteConfig.id));
        setAccounts(prev => prev.filter(a => a.id !== deleteConfig.id));
      }
    } catch (err) { console.error(err); }
    setDeleteConfig(prev => ({ ...prev, isOpen: false }));
  };

  const summary = useMemo<SummaryData>(() => {
    const accountBalances: Record<string, number> = {};
    accounts.forEach(acc => accountBalances[acc.id] = acc.initialBalance);
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach(t => {
      if (t.type === TransactionType.INCOME) {
        totalIncome += t.amount;
        if (accountBalances[t.accountId] !== undefined) accountBalances[t.accountId] += t.amount;
      } else {
        totalExpense += t.amount;
        if (accountBalances[t.accountId] !== undefined) accountBalances[t.accountId] -= t.amount;
      }
    });
    return { totalIncome, totalExpense, totalBalance: Object.values(accountBalances).reduce((a, b) => a + b, 0), accountBalances };
  }, [transactions, accounts]);

  if (viewMode === 'landing') {
    return <LandingPage onStart={() => setViewMode('auth')} />;
  }

  if (viewMode === 'auth') {
    return <LoginView onLogin={handleLogin} onBack={() => setViewMode('landing')} />;
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative overflow-hidden">
      {!isSupabaseConfigured && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-4">
           <div className="bg-rose-500 text-white p-4 border-4 border-stone-900 shadow-[8px_8px_0px_0px_#1c1917] text-center">
             <p className="font-black uppercase italic tracking-tighter">⚠️ SYSTEM WARNING: SUPABASE CONFIG MISSING</p>
           </div>
        </div>
      )}

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentTheme={currentTheme} onThemeChange={setCurrentTheme} user={user} onLogout={() => setIsLogoutModalOpen(true)} />

        <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 relative z-10 w-full overflow-x-hidden">
          <header className="flex flex-row justify-between items-center mb-8 md:mb-12 pb-4 border-b-8 border-stone-900 gap-4">
            <div className="flex items-center gap-4 md:gap-6 min-w-0">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 sm:p-3 border-4 border-stone-900 bg-white retro-shadow-sm shrink-0"><Icons.Menu /></button>
              <div className="relative min-w-0">
                <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-stone-900 whitespace-nowrap pr-4">
                  {activeTab === 'dashboard' ? 'Overview' : activeTab === 'wallets' ? 'Wallets' : activeTab === 'budgets' ? 'Budget' : 'Riwayat'}
                </h1>
              </div>
            </div>
            {loading && <div className="animate-spin"><Icons.Palette /></div>}
          </header>

          <div className="max-w-[1400px] mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard 
                summary={summary} 
                user={user} 
                transactions={transactions} 
                accounts={accounts} 
                onDeleteTransaction={(id) => setDeleteConfig({type:'transaction', id, isOpen: true})}
                onNavigateToWallets={() => setActiveTab('wallets')}
                onAddTransaction={() => setIsFormOpen(true)}
                isAddDisabled={accounts.length === 0}
              />
            )}
            {activeTab === 'wallets' && <WalletsView accounts={accounts} summary={summary} onAddAccount={() => {setAccountToEdit(undefined); setIsAccountModalOpen(true);}} onEditAccount={(acc) => {setAccountToEdit(acc); setIsAccountModalOpen(true);}} onDeleteAccount={(id) => setDeleteConfig({type:'account', id, isOpen: true})} />}
            {activeTab === 'budgets' && <BudgetView transactions={transactions} budgets={budgets} onSaveBudget={saveBudget} />}
            {activeTab === 'history' && <TransactionList transactions={transactions} accounts={accounts} onDelete={(id) => setDeleteConfig({type:'transaction', id, isOpen: true})} showFilters={true} />}
          </div>
        </main>
      </div>

      {isFormOpen && <TransactionForm accounts={accounts} onAdd={addTransaction} onClose={() => setIsFormOpen(false)} />}
      {isAccountModalOpen && <AccountModal onSave={saveAccount} onClose={() => {setIsAccountModalOpen(false); setAccountToEdit(undefined);}} initialData={accountToEdit} />}
      <ConfirmationModal isOpen={deleteConfig.isOpen} title={deleteConfig.type === 'account' ? 'Hapus Wallet?' : 'Hapus Transaksi?'} message="Apakah kamu yakin ingin menghapus data ini secara permanen dari cloud?" onConfirm={handleConfirmDelete} onCancel={() => setDeleteConfig(prev => ({ ...prev, isOpen: false }))} />
      <ConfirmationModal isOpen={isLogoutModalOpen} title="Logout Sesi?" message="Anda akan keluar dari sesi aman cloud Anda." confirmLabel="Logout" onConfirm={handleLogout} onCancel={() => setIsLogoutModalOpen(false)} variant="warning" />
      <button onClick={() => setIsFormOpen(true)} disabled={accounts.length === 0} className="fixed bottom-6 right-6 lg:hidden bg-[#63e6be] border-4 border-stone-900 w-16 h-16 rounded-none flex items-center justify-center retro-shadow-hover z-50 text-stone-900 disabled:opacity-50"><Icons.Plus /></button>
    </div>
  );
};

export default App;
