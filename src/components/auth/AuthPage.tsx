import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole, MoMoProvider } from '../../types/index.ts';
import { ErrandLogo } from '../common/ErrandLogo.tsx';
import {
  ShoppingBag,
  Store,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { loginByRole, loginAs, signup, users } = useAuth();

  const [authMode, setAuthMode] = useState<'gateway' | 'demo' | 'register'>('gateway');

  // Registration state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('shopper');
  const [storeName, setStoreName] = useState('');
  const [momoNumber, setMomoNumber] = useState('0244123456');
  const [momoProvider, setMomoProvider] = useState<MoMoProvider>('MTN_MOMO');
  const [neighborhood, setNeighborhood] = useState('East Legon, Accra');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    signup({
      full_name: fullName,
      email,
      role,
      store_name: role === 'store' ? storeName || `${fullName} Mart` : undefined,
      momo_number: momoNumber,
      momo_provider: momoProvider,
      neighborhood,
    });
  };

  return (
    <div className="min-h-screen bg-[#080F0B] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header with Brand */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4">
        <ErrandLogo size="md" variant="dark" />

        <div className="flex items-center gap-2 p-1 bg-[#0E1A14] rounded-2xl border border-[#1A2F24] text-xs">
          <button
            onClick={() => setAuthMode('gateway')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              authMode === 'gateway'
                ? 'bg-[#182C20] text-[#D4F938] border border-[#234330]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Role Gateway
          </button>
          <button
            onClick={() => setAuthMode('demo')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              authMode === 'demo'
                ? 'bg-[#182C20] text-[#D4F938] border border-[#234330]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Demo Personas
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              authMode === 'register'
                ? 'bg-[#182C20] text-[#D4F938] border border-[#234330]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto my-8 space-y-8">
        {/* Gateway Mode: 3 Role Cards */}
        {authMode === 'gateway' && (
          <div className="space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182C20] border border-[#234330] text-[11px] font-bold text-[#D4F938]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ghana's C2B Reverse-Auction Grocery Marketplace</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Login to Errand Ghana
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Choose your role to enter the marketplace. Shoppers post grocery lists, local merchants bid with wholesale prices, and Mobile Money escrow protects your payment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Shopper */}
              <div className="apex-card rounded-3xl p-6 sm:p-8 space-y-6 border-[#1A2F24] apex-card-hover flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#182C20] border border-[#234330] text-[#D4F938] flex items-center justify-center">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Login as Shopper</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Post your grocery list, set target price ceilings, and let Makola & local merchants compete for your order.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#08120D] border border-[#16281E] text-[11px] text-slate-300 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#D4F938] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Safe Pay Guarantee</span>
                    </div>
                    <div>Pay with MoMo only after inspecting fresh goods.</div>
                  </div>
                </div>

                <button
                  onClick={() => loginByRole('shopper')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl btn-apex text-xs font-black shadow-lg shadow-[#D4F938]/15"
                >
                  <span>Enter as Shopper</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 2: Store Merchant */}
              <div className="apex-card rounded-3xl p-6 sm:p-8 space-y-6 border-[#1A2F24] apex-card-hover flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#251D10] border border-[#40311B] text-[#F59E0B] flex items-center justify-center">
                    <Store className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Login as Store / Merchant</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Browse open neighborhood grocery requests, submit wholesale bids, and receive guaranteed wallet payouts.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#08120D] border border-[#16281E] text-[11px] text-slate-300 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#F59E0B] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Guaranteed Escrow Payout</span>
                    </div>
                    <div>Customer funds are locked prior to dispatch.</div>
                  </div>
                </div>

                <button
                  onClick={() => loginByRole('store')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#251D10] hover:bg-[#332615] text-[#F59E0B] border border-[#40311B] text-xs font-bold transition-all shadow-md"
                >
                  <span>Enter as Store</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 3: Admin */}
              <div className="apex-card rounded-3xl p-6 sm:p-8 space-y-6 border-[#1A2F24] apex-card-hover flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#20152B] border border-[#3B2252] text-[#C084FC] flex items-center justify-center">
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Login as Admin</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Operations oversight, manage & create custom user roles, verify store KYC, and arbitrate refund disputes.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#08120D] border border-[#16281E] text-[11px] text-slate-300 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#C084FC] font-bold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Role & Escrow Governance</span>
                    </div>
                    <div>Provision roles & supervise escrow liquidity.</div>
                  </div>
                </div>

                <button
                  onClick={() => loginByRole('admin')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#20152B] hover:bg-[#2B1B3B] text-[#C084FC] border border-[#3B2252] text-xs font-bold transition-all shadow-md"
                >
                  <span>Enter as Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Demo Personas Mode */}
        {authMode === 'demo' && (
          <div className="apex-card rounded-3xl p-6 sm:p-8 space-y-6 border-[#1A2F24] max-w-2xl mx-auto">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Select a Pre-Configured Demo Persona</h3>
              <p className="text-xs text-slate-400">Click any user profile below to simulate instant login</p>
            </div>

            <div className="space-y-3">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => loginAs(u)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#08120D] border border-[#16281E] hover:border-[#2D4C3A] hover:bg-[#12221A] text-left transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm border ${
                      u.role === 'shopper'
                        ? 'bg-[#182C20] text-[#D4F938] border-[#234330]'
                        : u.role === 'store'
                        ? 'bg-[#251D10] text-[#F59E0B] border-[#40311B]'
                        : 'bg-[#20152B] text-[#C084FC] border-[#3B2252]'
                    }`}>
                      {u.full_name.charAt(0)}
                    </div>

                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{u.full_name}</span>
                        {u.store_name && (
                          <span className="text-xs text-[#F59E0B] font-semibold">({u.store_name})</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">{u.neighborhood} • {u.momo_provider}</div>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    u.role === 'shopper'
                      ? 'bg-[#182C20] text-[#D4F938] border border-[#234330]'
                      : u.role === 'store'
                      ? 'bg-[#251D10] text-[#F59E0B] border border-[#40311B]'
                      : 'bg-[#20152B] text-[#C084FC] border border-[#3B2252]'
                  }`}>
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Registration Mode */}
        {authMode === 'register' && (
          <div className="apex-card rounded-3xl p-6 sm:p-8 space-y-6 border-[#1A2F24] max-w-xl mx-auto">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Create Your Errand Ghana Account</h3>
              <p className="text-xs text-slate-400">Join as a Shopper or Store Merchant in Accra & Kumasi</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">I am joining as a</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('shopper')}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      role === 'shopper'
                        ? 'bg-[#182C20] text-[#D4F938] border-[#D4F938]'
                        : 'bg-[#08120D] border-[#16281E] text-slate-400'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shopper</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('store')}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      role === 'store'
                        ? 'bg-[#251D10] text-[#F59E0B] border-[#F59E0B]'
                        : 'bg-[#08120D] border-[#16281E] text-slate-400'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Store / Merchant</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kwabena Addo"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kwabena@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
                  />
                </div>
              </div>

              {role === 'store' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Store / Business Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Makola Fresh Produce Hub"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">MoMo Network</label>
                  <select
                    value={momoProvider}
                    onChange={(e) => setMomoProvider(e.target.value as MoMoProvider)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white focus:outline-none focus:border-[#D4F938]"
                  >
                    <option value="MTN_MOMO" className="bg-[#0E1A14] text-white">MTN MoMo (*170#)</option>
                    <option value="TELECEL_CASH" className="bg-[#0E1A14] text-white">Telecel Cash (*110#)</option>
                    <option value="AT_MONEY" className="bg-[#0E1A14] text-white">AT Money (*110#)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">MoMo Phone Number</label>
                  <input
                    type="tel"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    placeholder="0244123456"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Neighborhood / Location</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. East Legon, Accra"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl btn-apex text-xs font-black shadow-lg shadow-[#D4F938]/15 mt-2"
              >
                Complete Registration & Enter
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-4 border-t border-[#1A2F24]">
        <div>ERRAND GHANA • Demand-Led C2B Grocery Marketplace & Mobile Money Escrow Engine</div>
      </footer>
    </div>
  );
};
