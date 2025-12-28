
import React from 'react';
import { Icons, THEMES } from '../constants';
import { Theme } from '../types';

interface SidebarProps {
  activeTab: 'dashboard' | 'history' | 'wallets' | 'budgets';
  onTabChange: (tab: 'dashboard' | 'history' | 'wallets' | 'budgets') => void;
  isOpen: boolean;
  onClose: () => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  isOpen, 
  onClose,
  currentTheme,
  onThemeChange
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
          className="p-8 border-b-4 border-stone-900 flex justify-between items-center transition-colors duration-300"
          style={{ backgroundColor: currentTheme.accent1 }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white border-2 border-stone-900 p-1 retro-shadow-sm">
               <Icons.Wallet />
            </div>
            <span className="text-2xl font-black italic tracking-tighter">myDuwit</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 border-2 border-stone-900 bg-white">
            <Icons.X />
          </button>
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
                  {currentTheme.id === t.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-1 bg-stone-900 rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="mt-2 px-2 text-[8px] font-bold text-stone-400 uppercase text-center italic">
              {currentTheme.name}
            </p>
          </div>
        </nav>

        <div 
          className="p-6 border-t-4 border-stone-900 transition-colors duration-300"
          style={{ backgroundColor: currentTheme.accent2 }}
        >
          <p className="text-[10px] font-black uppercase text-stone-900 mb-1 opacity-70">Developed by</p>
          <p className="font-bold text-stone-900 italic tracking-tight">cXrefulTEAM</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
