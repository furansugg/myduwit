
import React from 'react';
import { Icons, THEMES } from '../constants';
import { Theme, User } from '../types';

interface SidebarProps {
  activeTab: 'dashboard' | 'history' | 'wallets' | 'budgets';
  onTabChange: (tab: 'dashboard' | 'history' | 'wallets' | 'budgets') => void;
  isOpen: boolean;
  onClose: () => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  user: User | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  isOpen, 
  onClose,
  currentTheme,
  onThemeChange,
  user,
  onLogout
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Icons.Home />, color: 'bg-[#ffd43b]' },
    { id: 'wallets', label: 'Wallets', icon: <Icons.Wallet />, color: 'bg-[#74c0fc]' },
    { id: 'budgets', label: 'Budget', icon: <Icons.Target />, color: 'bg-[#63e6be]' },
    { id: 'history', label: 'Riwayat', icon: <Icons.History />, color: 'bg-[#ff90e8]' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 left-0 h-full bg-[#fdfdfd] border-r-4 border-stone-900 z-50
        w-64 transition-transform duration-300 transform flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div 
          className="p-6 border-b-4 border-stone-900 flex flex-col gap-4 transition-colors duration-300"
          style={{ backgroundColor: currentTheme.accent1 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white border-2 border-stone-900 p-1 retro-shadow-sm">
                 <Icons.Wallet />
              </div>
              <span className="text-xl font-black italic tracking-tighter">myDuwit</span>
            </div>
            <button onClick={onClose} className="lg:hidden p-1 border-2 border-stone-900 bg-white">
              <Icons.X />
            </button>
          </div>

          {/* User Profile Info */}
          <div className="bg-white/80 p-3 border-4 border-stone-900 flex items-center gap-3">
             <div className="w-10 h-10 bg-stone-900 text-white flex items-center justify-center font-black text-xl border-2 border-white">
               {user?.name.charAt(0)}
             </div>
             <div className="min-w-0">
               <p className="text-[10px] font-black uppercase text-stone-400 leading-none mb-1">Signed in as</p>
               <p className="font-bold text-xs truncate uppercase tracking-tighter">{user?.name}</p>
             </div>
          </div>
        </div>

        <nav className="p-4 space-y-4 mt-4 flex-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id as 'dashboard' | 'history' | 'wallets' | 'budgets');
                onClose();
              }}
              className={`
                w-full flex items-center gap-4 p-4 font-bold uppercase tracking-tight transition-all
                border-4 border-stone-900 relative group
                ${activeTab === item.id 
                  ? `${item.color} retro-shadow` 
                  : 'bg-white hover:translate-x-1'
                }
              `}
            >
              <span className="text-stone-900">
                {item.icon}
              </span>
              {item.label}
              {activeTab === item.id && (
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-stone-900 rotate-45" />
              )}
            </button>
          ))}

          <div className="pt-6 border-t-2 border-stone-900/10">
            <div className="flex items-center gap-2 mb-4 px-2">
              <Icons.Palette />
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Theme Palette</span>
            </div>
            <div className="grid grid-cols-5 gap-2 px-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onThemeChange(t)}
                  title={t.name}
                  className={`
                    w-8 h-8 border-2 border-stone-900 transition-all relative
                    ${currentTheme.id === t.id ? 'ring-2 ring-stone-900 ring-offset-2' : 'hover:scale-110'}
                  `}
                  style={{ backgroundColor: t.accent1 }}
                >
                  <div 
                    className="absolute inset-0 opacity-40" 
                    style={{ backgroundColor: t.bg }}
                  />
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div 
          className="p-6 border-t-4 border-stone-900 transition-colors duration-300 flex flex-col gap-4"
          style={{ backgroundColor: currentTheme.accent2 }}
        >
          <button 
            onClick={onLogout}
            className="flex items-center justify-center gap-2 bg-white border-4 border-stone-900 py-2 px-4 font-black uppercase text-[10px] retro-shadow-sm hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            <Icons.LogOut /> Logout Sesi
          </button>
          <div className="text-center flex flex-col items-center">
            <p className="text-[8px] font-black uppercase text-stone-900 opacity-60">cXrefulTEAM 2025</p>
            <p className="text-[7px] font-bold text-stone-900 opacity-40 mt-1 uppercase tracking-widest">Version 2.3.1</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
