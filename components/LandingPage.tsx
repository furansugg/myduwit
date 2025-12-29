
import React from 'react';
import { Icons } from '../constants';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#fffcf0] overflow-x-hidden selection:bg-stone-900 selection:text-white">
      {/* Decorative Navigation */}
      <nav className="p-6 border-b-8 border-stone-900 flex justify-between items-center bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-300 border-4 border-stone-900 retro-shadow-sm flex items-center justify-center -rotate-6">
            <Icons.Wallet />
          </div>
          <span className="text-3xl font-black italic tracking-tighter uppercase leading-none">myDuwit</span>
        </div>
        <button 
          onClick={onStart}
          className="bg-stone-900 text-white px-8 py-3 font-black uppercase italic text-sm retro-shadow-hover transition-all border-none"
        >
          [ Start Session ]
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 flex flex-col items-center text-center overflow-hidden">
        {/* Floating Icons Background */}
        <div className="absolute top-20 left-10 md:left-40 animate-float opacity-40 hidden md:block"><Icons.Cash /></div>
        <div className="absolute bottom-40 right-10 md:right-40 animate-float opacity-40 hidden md:block" style={{ animationDelay: '1s' }}><Icons.Bank /></div>
        <div className="absolute top-1/2 left-20 animate-float opacity-20 hidden md:block" style={{ animationDelay: '2s' }}><Icons.Target /></div>

        <div className="max-w-4xl relative z-10">
          <div className="bg-rose-400 inline-block px-4 py-1 border-4 border-stone-900 mb-6 -rotate-2 retro-shadow-sm">
             <span className="text-sm font-black uppercase italic tracking-widest">Version 2.3.1_RETRO_UPLINK</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.9] text-stone-900 mb-8 drop-shadow-[8px_8px_0px_white]">
            ATUR UANG<br/>JADI LEBIH<br/><span className="text-yellow-400">BERGAYA.</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold uppercase tracking-tight text-stone-600 mb-12 max-w-2xl mx-auto leading-tight">
            Aplikasi pencatat keuangan dengan estetika retro 90-an. Cloud sync, aman, dan tanpa iklan ribet.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={onStart}
              className="bg-[#63e6be] border-[6px] border-stone-900 p-6 text-2xl font-black uppercase italic retro-shadow-hover transition-all active:translate-y-2 active:shadow-none"
            >
              Coba Sekarang — Gratis!
            </button>
            <div className="bg-white border-4 border-stone-900 p-6 flex flex-col items-center justify-center retro-shadow-sm rotate-2">
               <span className="text-[10px] font-black uppercase text-stone-400">TRUSTED BY</span>
               <span className="font-mono-retro font-black text-xl tracking-tighter">5,000+ USERS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="bg-stone-900 py-6 border-y-8 border-stone-900 rotate-1">
        <div className="marquee-container">
          <div className="marquee-content flex gap-12 text-white font-black text-4xl uppercase italic">
            <span>*** Cloud Sync Enabled ***</span>
            <span className="text-yellow-400">Retro UI/UX</span>
            <span>*** 100% Privacy ***</span>
            <span className="text-sky-400">Manage Wallets</span>
            <span>*** Insightful Charts ***</span>
            <span className="text-rose-400">Budget Control</span>
            <span>*** Cloud Sync Enabled ***</span>
            <span className="text-yellow-400">Retro UI/UX</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white border-8 border-stone-900 p-10 retro-shadow relative group hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 bg-sky-300 border-4 border-stone-900 flex items-center justify-center mb-8 -rotate-12 group-hover:rotate-0 transition-transform"><Icons.Smartphone /></div>
            <h3 className="text-3xl font-black uppercase italic mb-4">Multi-Wallet</h3>
            <p className="font-bold text-stone-600 uppercase text-sm leading-relaxed">Pisahkan dana tabungan, bank, hingga e-wallet dalam satu dashboard pusat.</p>
          </div>
          
          <div className="bg-white border-8 border-stone-900 p-10 retro-shadow relative group hover:-translate-y-2 transition-transform translate-y-4">
            <div className="w-16 h-16 bg-rose-300 border-4 border-stone-900 flex items-center justify-center mb-8 rotate-12 group-hover:rotate-0 transition-transform"><Icons.TrendUp /></div>
            <h3 className="text-3xl font-black uppercase italic mb-4">Cloud Sync</h3>
            <p className="font-bold text-stone-600 uppercase text-sm leading-relaxed">Akses data keuanganmu di mana saja, kapan saja. Selalu aman tersimpan di cloud.</p>
          </div>

          <div className="bg-white border-8 border-stone-900 p-10 retro-shadow relative group hover:-translate-y-2 transition-transform translate-y-8">
            <div className="w-16 h-16 bg-yellow-300 border-4 border-stone-900 flex items-center justify-center mb-8 -rotate-6 group-hover:rotate-0 transition-transform"><Icons.Target /></div>
            <h3 className="text-3xl font-black uppercase italic mb-4">Budget Control</h3>
            <p className="font-bold text-stone-600 uppercase text-sm leading-relaxed">Jangan biarkan kantong jebol! Set limit belanja dan pantau tiap bulan.</p>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="px-6 py-20 bg-stone-900 text-white text-center mt-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8 leading-none">
            SIAP UNTUK LEBIH<br/><span className="text-[#63e6be]">DISIPLIN FINANSIAL?</span>
          </h2>
          <button 
            onClick={onStart}
            className="bg-[#ff90e8] text-stone-900 border-[6px] border-white px-12 py-6 text-3xl font-black uppercase italic retro-shadow-hover transition-all"
          >
            Akses Vault Sekarang
          </button>
          <p className="mt-12 text-stone-400 font-mono-retro uppercase text-[10px] tracking-widest">
            NO ADS . NO TRACKING . JUST RETRO TECH . v2.3.1_BUILD
          </p>
        </div>
      </section>

      <footer className="bg-stone-900 p-8 border-t-4 border-stone-700 text-center">
         <p className="text-stone-500 font-black uppercase text-[10px] tracking-[0.5em]">cXrefulTEAM © 2025 - myDuwit Project v2.3.1</p>
      </footer>
    </div>
  );
};

export default LandingPage;
