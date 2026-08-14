import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
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
  Sun,
  Moon,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { loginByRole, loginAs, signup, users } = useAuth();
  const { theme, toggleTheme } = useTheme();

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
    <div className={`min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 transition-colors ${
      theme === 'dark' ? 'bg-[#080F0B] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Header with Brand */}
      <header className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <ErrandLogo
          size="md"
          variant={theme === 'dark' ? 'dark' : 'light'}
          onClick={() => setAuthMode('gateway')}
        />

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle light or dark theme"
            className={`p-2 sm:px-3 sm:py-2 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
              theme === 'dark'
                ? 'bg-[#0E1A14] border-[#1A2F24] text-[#D4F938] hover:border-[#2D4C3A]'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-[#D4F938]" />
                <span className="hidden sm:inline text-[11px]">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="hidden sm:inline text-[11px]">Dark</span>
              </>
            )}
          </button>

          {/* Mode Tabs */}
          <div className={`flex items-center gap-1 p-1 rounded-2xl border text-xs w-full sm:w-auto justify-around sm:justify-start ${
            theme === 'dark' ? 'bg-[#0E1A14] border-[#1A2F24]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <button
              onClick={() => setAuthMode('gateway')}
              className={`flex-1 sm:flex-none text-center px-3 py-2 sm:py-1.5 rounded-xl font-bold text-xs transition-all ${
                authMode === 'gateway'
                  ? theme === 'dark'
                    ? 'bg-[#182C20] text-[#D4F938] border border-[#234330]'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Role Gateway
            </button>
            <button
              onClick={() => setAuthMode('demo')}
              className={`flex-1 sm:flex-none text-center px-3 py-2 sm:py-1.5 rounded-xl font-bold text-xs transition-all ${
                authMode === 'demo'
                  ? theme === 'dark'
                    ? 'bg-[#182C20] text-[#D4F938] border border-[#234330]'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Demo Personas
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 sm:flex-none text-center px-3 py-2 sm:py-1.5 rounded-xl font-bold text-xs transition-all ${
                authMode === 'register'
                  ? theme === 'dark'
                    ? 'bg-[#182C20] text-[#D4F938] border border-[#234330]'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto my-8 space-y-8">
        {/* Gateway Mode: 3 Role Cards */}
        {authMode === 'gateway' && (
          <div className="space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-bold max-w-full text-center flex-wrap justify-center ${
                theme === 'dark' ? 'bg-[#182C20] border-[#234330] text-[#D4F938]' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Ghana's C2B Reverse-Auction Grocery Marketplace</span>
              </div>
              <h1 className={`text-3xl sm:text-4xl font-black tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Login to Errand Ghana
              </h1>
              <p className={`text-xs sm:text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Choose your role to enter the marketplace. Shoppers post grocery lists, local merchants bid with wholesale prices, and Mobile Money escrow protects your payment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Shopper */}
              <div className="apex-card rounded-3xl p-6 sm:p-8 space-y-6 apex-card-hover flex flex-col justify-between">
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-[#182C20] border-[#234330] text-[#D4F938]'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}>
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Login as Shopper
                    </h3>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Post your grocery list, set target price ceilings, and let Makola & local merchants compete for your order.
                    </p>
                  </div>

                  <div className={`p-3 rounded-2xl border text-[11px] space-y-1 ${
                    theme === 'dark'
                      ? 'bg-[#08120D] border-[#16281E] text-slate-300'
                      : 'bg-slate-50 border-slate-100 text-slate-600'
                  }`}>
                    <div className={`flex items-center gap-1.5 font-bold ${
                      theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'
                    }`}>
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
              <div className="apex-card rounded-3xl p-6 sm:p-8 space-y-6 apex-card-hover flex flex-col justify-between">
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-[#251D10] border-[#40311B] text-[#F59E0B]'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}>
                    <Store className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Login as Store / Merchant
                    </h3>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Browse open neighborhood grocery requests, submit wholesale bids, and receive guaranteed wallet payouts.
                    </p>
                  </div>

                  <div className={`p-3 rounded-2xl border text-[11px] space-y-1 ${
                    theme === 'dark'
                      ? 'bg-[#08120D] border-[#16281E] text-slate-300'
                      : 'bg-slate-50 border-slate-100 text-slate-600'
                  }`}>
                    <div className={`flex items-center gap-1.5 font-bold ${
                      theme === 'dark' ? 'text-[#F59E0B]' : 'text-amber-700'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Guaranteed Escrow Payout</span>
                    </div>
                    <div>Customer funds are locked prior to dispatch.</div>
                  </div>
                </div>

                <button
                  onClick={() => loginByRole('store')}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all shadow-md ${
                    theme === 'dark'
                      ? 'bg-[#251D10] hover:bg-[#332615] text-[#F59E0B] border border-[#40311B]'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  <span>Enter as Store</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 3: Admin */}
              <div className="apex-card rounded-3xl p-6 sm:p-8 space-y-6 apex-card-hover flex flex-col justify-between">
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-[#20152B] border-[#3B2252] text-[#C084FC]'
                      : 'bg-purple-50 border-purple-200 text-purple-800'
                  }`}>
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Login as Admin
                    </h3>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Operations oversight, manage & create custom user roles, verify store KYC, and arbitrate refund disputes.
                    </p>
                  </div>

                  <div className={`p-3 rounded-2xl border text-[11px] space-y-1 ${
                    theme === 'dark'
                      ? 'bg-[#08120D] border-[#16281E] text-slate-300'
                      : 'bg-slate-50 border-slate-100 text-slate-600'
                  }`}>
                    <div className={`flex items-center gap-1.5 font-bold ${
                      theme === 'dark' ? 'text-[#C084FC]' : 'text-purple-700'
                    }`}>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Role & Escrow Governance</span>
                    </div>
                    <div>Provision roles & supervise escrow liquidity.</div>
                  </div>
                </div>

                <button
                  onClick={() => loginByRole('admin')}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all shadow-md ${
                    theme === 'dark'
                      ? 'bg-[#20152B] hover:bg-[#2B1B3B] text-[#C084FC] border border-[#3B2252]'
                      : 'bg-purple-700 hover:bg-purple-800 text-white'
                  }`}
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
          <div className="apex-card rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-1">
              <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Select a Pre-Configured Demo Persona
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Click any user profile below to simulate instant login
              </p>
            </div>

            <div className="space-y-3">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => loginAs(u)}
                  className={`w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl border text-left transition-all ${
                    theme === 'dark'
                      ? 'bg-[#08120D] border-[#16281E] hover:border-[#2D4C3A] hover:bg-[#12221A]'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm border shrink-0 ${
                      u.role === 'shopper'
                        ? theme === 'dark' ? 'bg-[#182C20] text-[#D4F938] border-[#234330]' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : u.role === 'store'
                        ? theme === 'dark' ? 'bg-[#251D10] text-[#F59E0B] border-[#40311B]' : 'bg-amber-100 text-amber-800 border-amber-200'
                        : theme === 'dark' ? 'bg-[#20152B] text-[#C084FC] border-[#3B2252]' : 'bg-purple-100 text-purple-800 border-purple-200'
                    }`}>
                      {u.full_name.charAt(0)}
                    </div>

                    <div>
                      <div className={`font-bold flex flex-wrap items-center gap-1.5 ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        <span>{u.full_name}</span>
                        {u.store_name && (
                          <span className="text-xs text-[#F59E0B] font-semibold">({u.store_name})</span>
                        )}
                      </div>
                      <div className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {u.neighborhood} • {u.momo_provider}
                      </div>
                    </div>
                  </div>

                  {/* Role Badge - Re-arranges gracefully below on mobile, or right-aligned on tablet/desktop */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto pl-14 sm:pl-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200/40">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      u.role === 'shopper'
                        ? theme === 'dark' ? 'bg-[#182C20] text-[#D4F938] border border-[#234330]' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : u.role === 'store'
                        ? theme === 'dark' ? 'bg-[#251D10] text-[#F59E0B] border border-[#40311B]' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        : theme === 'dark' ? 'bg-[#20152B] text-[#C084FC] border border-[#3B2252]' : 'bg-purple-50 text-purple-800 border border-purple-200'
                    }`}>
                      {u.role === 'store' ? 'Store / Merchant' : u.role}
                    </span>
                    <span className="sm:hidden text-xs text-slate-400 flex items-center gap-1 font-semibold">
                      <span>Click to login</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Registration Mode */}
        {authMode === 'register' && (
          <div className="apex-card rounded-3xl p-6 sm:p-8 space-y-6 max-w-xl mx-auto">
            <div className="text-center space-y-1">
              <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Create Your Errand Ghana Account
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Join as a Shopper or Store Merchant in Accra & Kumasi
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  I am joining as a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('shopper')}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      role === 'shopper'
                        ? theme === 'dark'
                          ? 'bg-[#182C20] text-[#D4F938] border-[#D4F938]'
                          : 'bg-emerald-700 text-white border-emerald-700'
                        : theme === 'dark'
                        ? 'bg-[#08120D] border-[#16281E] text-slate-400'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
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
                        ? theme === 'dark'
                          ? 'bg-[#251D10] text-[#F59E0B] border-[#F59E0B]'
                          : 'bg-amber-600 text-white border-amber-600'
                        : theme === 'dark'
                        ? 'bg-[#08120D] border-[#16281E] text-slate-400'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Store / Merchant</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kwabena Addo"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#D4F938] ${
                      theme === 'dark'
                        ? 'bg-[#08120D] border-[#16281E] text-white placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kwabena@gmail.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#D4F938] ${
                      theme === 'dark'
                        ? 'bg-[#08120D] border-[#16281E] text-white placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              {role === 'store' && (
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>Store / Business Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Makola Fresh Produce Hub"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#D4F938] ${
                      theme === 'dark'
                        ? 'bg-[#08120D] border-[#16281E] text-white placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>MoMo Network</label>
                  <select
                    value={momoProvider}
                    onChange={(e) => setMomoProvider(e.target.value as MoMoProvider)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#D4F938] ${
                      theme === 'dark'
                        ? 'bg-[#08120D] border-[#16281E] text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="MTN_MOMO">MTN MoMo (*170#)</option>
                    <option value="TELECEL_CASH">Telecel Cash (*110#)</option>
                    <option value="AT_MONEY">AT Money (*110#)</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>MoMo Phone Number</label>
                  <input
                    type="tel"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    placeholder="0244123456"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:border-[#D4F938] ${
                      theme === 'dark'
                        ? 'bg-[#08120D] border-[#16281E] text-white placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>Neighborhood / Location</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. East Legon, Accra"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#D4F938] ${
                    theme === 'dark'
                      ? 'bg-[#08120D] border-[#16281E] text-white placeholder-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
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
      <footer className={`text-center text-xs py-4 border-t ${
        theme === 'dark' ? 'border-[#1A2F24] text-slate-500' : 'border-slate-200 text-slate-500'
      }`}>
        <div>Errand Ghana • Your everyday grocery shopping assistant with Mobile Money safe pay escrow</div>
      </footer>
    </div>
  );
};
