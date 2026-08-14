import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole, MoMoProvider } from '../../types/index.ts';
import { ShoppingBag, Store, Shield, ArrowRight, UserPlus, LogIn, CheckCircle2 } from 'lucide-react';
import { ErrandLogo } from '../common/ErrandLogo.tsx';

export const AuthPage: React.FC = () => {
  const { loginByRole, loginAs, signup, users } = useAuth();
  const [activeMode, setActiveMode] = useState<'quick_role' | 'signup' | 'demo_users'>('quick_role');

  // Sign up form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('shopper');
  const [storeName, setStoreName] = useState('');
  const [momoNumber, setMomoNumber] = useState('0244000000');
  const [momoProvider, setMomoProvider] = useState<MoMoProvider>('MTN_MOMO');
  const [neighborhood, setNeighborhood] = useState('East Legon, Accra');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    signup({
      email,
      full_name: fullName,
      role,
      momo_number: momoNumber,
      momo_provider: momoProvider,
      neighborhood,
      store_name: role === 'store' ? storeName || `${fullName} Mart` : undefined,
    });

    setSuccessMessage(`Account created successfully as ${role}!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* Top Simple Nav */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <ErrandLogo size="md" />
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span>Urban Grocery Reverse-Auction & Escrow</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl space-y-8">
          {/* Header Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Login to Errand Ghana
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto">
              Select your role to access your personalized marketplace dashboard or create a new account.
            </p>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto p-1 bg-slate-200/80 rounded-2xl">
            <button
              onClick={() => setActiveMode('quick_role')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeMode === 'quick_role'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Role Gateway
            </button>
            <button
              onClick={() => setActiveMode('demo_users')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeMode === 'demo_users'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Demo Personas
            </button>
            <button
              onClick={() => setActiveMode('signup')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {successMessage && (
            <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE 1: 3 Role Cards Gateway (From Mockup) */}
          {activeMode === 'quick_role' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Shopper */}
              <div className="app-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 app-card-hover border-slate-200">
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Login as Shopper</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Post grocery requests, get competitive store bids, and pay securely via Mobile Money Escrow.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => loginByRole('shopper')}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Enter as Shopper</span>
                </button>
              </div>

              {/* Card 2: Store / Merchant */}
              <div className="app-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 app-card-hover border-slate-200">
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-100">
                    <Store className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Login as Store / Merchant</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Browse open neighborhood grocery demands, submit wholesale bids, and receive instant payouts.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => loginByRole('store')}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Enter as Merchant</span>
                </button>
              </div>

              {/* Card 3: Admin */}
              <div className="app-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 app-card-hover border-amber-200/80 bg-amber-50/20">
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center mx-auto border border-amber-200">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Login as Admin</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Oversee operations, create & assign user roles, approve merchant KYC, and arbitrate disputes.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => loginByRole('admin')}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-900/10 flex items-center justify-center gap-2 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Enter Admin Portal</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: Demo Personas Switcher */}
          {activeMode === 'demo_users' && (
            <div className="max-w-2xl mx-auto app-card rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Select a Pre-Configured Test User</h3>
              <p className="text-xs text-slate-500">
                Instant one-click access with simulated Accra & Kumasi accounts:
              </p>

              <div className="space-y-2.5 pt-2">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => loginAs(u)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        u.role === 'shopper'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.role === 'store'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {u.role === 'shopper' && <ShoppingBag className="w-4 h-4" />}
                        {u.role === 'store' && <Store className="w-4 h-4" />}
                        {u.role === 'admin' && <Shield className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                          {u.full_name} {u.store_name ? `(${u.store_name})` : ''}
                        </div>
                        <div className="text-[11px] text-slate-500">{u.email} • {u.neighborhood}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'shopper'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.role === 'store'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {u.role}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE 3: Create Account Form */}
          {activeMode === 'signup' && (
            <div className="max-w-xl mx-auto app-card rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create a New Account</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Join Errand Ghana as a Shopper, Store Merchant, or Admin.
                </p>
              </div>

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                {/* Role selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Account Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('shopper')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        role === 'shopper'
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Shopper
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('store')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        role === 'store'
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Store / Merchant
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        role === 'admin'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kwesi Arthur"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kwesi@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                {role === 'store' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Store / Business Name *</label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="e.g. Makola Fresh Organic Hub"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Money Network</label>
                    <select
                      value={momoProvider}
                      onChange={(e) => setMomoProvider(e.target.value as MoMoProvider)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    >
                      <option value="MTN_MOMO">MTN Mobile Money (*170#)</option>
                      <option value="TELECEL_CASH">Telecel Cash (*110#)</option>
                      <option value="AT_MONEY">AT Money (*110#)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">MoMo Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      placeholder="0244123456"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Neighborhood / Location</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g. East Legon, Accra"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register and Enter Marketplace</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Clean Consumer Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-500 border-t border-slate-200">
        <div>© 2026 Errand Ghana Inc. • Ghana's Demand-Led Grocery Marketplace & Mobile Money Escrow Engine</div>
      </footer>
    </div>
  );
};
