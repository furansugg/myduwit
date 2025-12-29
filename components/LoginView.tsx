
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Icons } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface LoginViewProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onBack }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>(['SYSTEM_READY', 'WAITING_FOR_UPLINK...']);

  // Animasi log sistem
  useEffect(() => {
    const messages = [
      'ENCRYPTING_VAULT...',
      'SCANNING_BIOMETRICS...',
      'CONNECTING_TO_SAT_LINK...',
      'CHECKING_LEDGER_INTEGRITY...',
      'STABILIZING_CURRENCY_FLUX...'
    ];
    
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, messages[Math.floor(Math.random() * messages.length)]];
        return newLogs.slice(-6);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLogs(prev => [...prev, isRegister ? 'INITIATING_REGISTRATION...' : 'ATTEMPTING_VAULT_ACCESS...']);

    if (!isSupabaseConfigured) {
      setError('CONFIG_ERROR: API KEY TIDAK TERDETEKSI.');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password,
          options: {
            data: { full_name: name.toUpperCase() }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          onLogin({
            id: authData.user.id,
            name: name.toUpperCase(),
            email: email.toLowerCase(),
            loginTime: new Date().toISOString()
          });
        }
      } else {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password
        });

        if (authError) throw authError;

        if (authData.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', authData.user.id)
            .single();

          onLogin({
            id: authData.user.id,
            name: profile?.full_name || 'USER',
            email: authData.user.email || '',
            loginTime: new Date().toISOString()
          });
        }
      }
    } catch (err: any) {
      setError(err.message?.toUpperCase() || 'ERROR: SYSTEM_FAILURE');
      setLogs(prev => [...prev, 'ERROR: REQUEST_DENIED']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-[#fffcf0] overflow-hidden">
      {/* 3D Moving Grid Background */}
      <style>{`
        @keyframes grid-move {
          0% { transform: perspective(500px) rotateX(25deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(25deg) translateY(40px); }
        }
        .retro-grid {
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background-image: 
            linear-gradient(rgba(28, 25, 23, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(28, 25, 23, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: grid-move 2s linear infinite;
          z-index: 0;
        }
        .grid-mask {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 20%, #fffcf0 80%);
          z-index: 1;
        }
      `}</style>
      
      <div className="retro-grid"></div>
      <div className="grid-mask"></div>

      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]" 
           style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}>
      </div>

      <div className="absolute top-8 left-8 z-50">
        <button 
          onClick={onBack}
          className="bg-white border-4 border-stone-900 px-4 py-2 font-black uppercase text-xs retro-shadow-sm hover:translate-x-1 transition-all"
        >
          ← Kembali ke Beranda
        </button>
      </div>

      <div className="flex items-center gap-8 relative z-10 w-full max-w-4xl">
        
        {/* Left Side: System Log Terminal */}
        <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0 animate-in slide-in-from-left-8 duration-700">
           <div className="bg-stone-900 border-4 border-stone-900 retro-shadow-sm p-4 text-emerald-400 font-mono-retro text-[10px] space-y-2">
              <div className="flex justify-between border-b border-emerald-900 pb-2 mb-2">
                <span className="font-black text-white uppercase italic">System_Log</span>
                <span className="animate-pulse">● LIVE</span>
              </div>
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="opacity-40">[{1024 + i}]</span>
                  <span className="truncate">{log}</span>
                </div>
              ))}
           </div>

           <div className="bg-yellow-300 border-4 border-stone-900 p-4 retro-shadow-sm rotate-2">
              <p className="font-black text-[10px] uppercase italic text-stone-900 leading-tight">
                "Uang tidak pernah tidur, tapi aplikasi ini butuh login."
              </p>
           </div>
        </div>

        {/* Center: The Retro Window Card */}
        <div className="flex-1 relative">
          {/* Floating Decoration */}
          <div className="absolute -top-12 -left-8 w-24 h-24 bg-rose-400 border-4 border-stone-900 flex items-center justify-center -rotate-12 z-20 retro-shadow-sm animate-float">
             <span className="font-black text-[10px] text-center uppercase leading-none">100%<br/>Secure<br/>Vault</span>
          </div>

          <div className="bg-white border-[6px] md:border-8 border-stone-900 retro-shadow relative overflow-hidden">
            {/* Fake Window Header */}
            <div className="bg-stone-900 text-white p-4 flex justify-between items-center border-b-[6px] md:border-b-8 border-stone-900">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-300 border-2 border-white rotate-12 flex items-center justify-center shrink-0">
                  <Icons.Wallet />
                </div>
                <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-white drop-shadow-[2px_2px_0px_#ff90e8]">myDuwit</h1>
              </div>
              
              <div className="flex gap-2">
                <div className="w-5 h-5 border-2 border-white bg-stone-700 flex items-center justify-center font-black text-[8px]">_</div>
                <div className="w-5 h-5 border-2 border-white bg-rose-500 flex items-center justify-center font-black text-[8px]">X</div>
              </div>
            </div>

            <div className="p-6 md:p-10 relative">
              <div className="flex gap-4 mb-8">
                <button 
                  onClick={() => setIsRegister(false)}
                  className={`flex-1 py-4 border-4 border-stone-900 font-black uppercase text-xs transition-all ${!isRegister ? 'bg-stone-900 text-white translate-x-1 translate-y-1' : 'bg-white text-stone-400 retro-shadow-sm'}`}
                >
                  [ Masuk ]
                </button>
                <button 
                  onClick={() => setIsRegister(true)}
                  className={`flex-1 py-4 border-4 border-stone-900 font-black uppercase text-xs transition-all ${isRegister ? 'bg-stone-900 text-white translate-x-1 translate-y-1' : 'bg-white text-stone-400 retro-shadow-sm'}`}
                >
                  [ Daftar ]
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {isRegister && (
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="NAMA LENGKAP..."
                    className="w-full bg-stone-50 border-4 border-stone-900 p-4 font-bold outline-none focus:bg-white uppercase text-lg"
                  />
                )}

                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL@DOMAIN.COM"
                  className="w-full bg-stone-50 border-4 border-stone-900 p-4 font-bold outline-none focus:bg-white text-lg"
                />

                <input 
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="KATA SANDI..."
                  className="w-full bg-stone-50 border-4 border-stone-900 p-4 font-mono-retro outline-none focus:bg-white text-lg"
                />

                {error && (
                  <div className="bg-rose-600 text-white p-4 text-center font-black text-[10px] border-4 border-stone-900 animate-pulse uppercase tracking-widest">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#63e6be] border-4 border-stone-900 py-6 font-black text-2xl retro-shadow-hover transition-all uppercase tracking-tighter italic disabled:opacity-50"
                >
                  {loading ? 'SINKRONISASI...' : (isRegister ? 'BUAT AKUN' : 'BUKA BRANKAS')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
