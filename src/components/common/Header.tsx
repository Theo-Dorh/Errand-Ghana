import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { ErrandLogo } from './ErrandLogo.tsx';
import { RoleBadge } from './RoleBadge.tsx';
import {
  ShoppingBag,
  Package,
  Shield,
  LogOut,
  ChevronDown,
  User,
  Store,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'marketplace' | 'orders' | 'admin';
  onTabChange: (tab: 'marketplace' | 'orders' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { currentUser, role, users, loginAs, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { adminMetrics } = useMarketplace();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const lockedVault = adminMetrics ? adminMetrics.lockedVaultBalance : 0;

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-lg transition-colors ${
      theme === 'dark'
        ? 'bg-[#080F0B]/95 border-[#1A2F24]'
        : 'bg-white/95 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6">
            <ErrandLogo
              size="md"
              variant={theme === 'dark' ? 'dark' : 'light'}
              onClick={() => onTabChange('marketplace')}
            />

            {/* Navigation Tabs (Apex Pill Design) */}
            <nav className={`hidden md:flex items-center gap-1.5 p-1 rounded-2xl border ${
              theme === 'dark'
                ? 'bg-[#0E1A14] border-[#1A2F24]'
                : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => onTabChange('marketplace')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'marketplace'
                    ? theme === 'dark'
                      ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
                      : 'bg-white text-[#008852] border border-slate-200 shadow-sm'
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role === 'shopper' && <ShoppingBag className="w-4 h-4" />}
                {role === 'store' && <Store className="w-4 h-4" />}
                {role === 'admin' && <Shield className="w-4 h-4" />}
                <span>
                  {role === 'shopper' ? 'Grocery Shopping' : role === 'store' ? 'Market Demands' : 'Operations'}
                </span>
              </button>

              <button
                onClick={() => onTabChange('orders')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'orders'
                    ? theme === 'dark'
                      ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
                      : 'bg-white text-[#008852] border border-slate-200 shadow-sm'
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>{role === 'store' ? 'Active Orders' : 'My Orders'}</span>
              </button>

              {role === 'admin' && (
                <button
                  onClick={() => onTabChange('admin')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    activeTab === 'admin'
                      ? theme === 'dark'
                        ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
                        : 'bg-white text-[#008852] border border-slate-200 shadow-sm'
                      : theme === 'dark'
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin & Roles</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Section: Theme Toggle, Safe Pay Vault Ticker & User Profile Dropdown */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle light or dark theme"
              className={`p-2 sm:px-3 sm:py-2 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                theme === 'dark'
                  ? 'bg-[#0E1A14] border-[#1A2F24] text-[#D4F938] hover:border-[#2D4C3A]'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
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

            {/* Live Safe Pay Vault Ticker */}
            <div className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs shadow-inner ${
              theme === 'dark'
                ? 'bg-[#12221A] border-[#1F3A2C]'
                : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                theme === 'dark' ? 'bg-[#D4F938]' : 'bg-emerald-600'
              }`} />
              <span className={`text-[11px] font-medium ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Safe Pay Vault:
              </span>
              <span className={`font-mono font-bold ${
                theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-800'
              }`}>
                GH₵ {lockedVault.toFixed(2)}
              </span>
              <ShieldCheck className={`w-3.5 h-3.5 ml-0.5 ${
                theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
              }`} />
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className={`flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-2xl border transition-all text-left ${
                  theme === 'dark'
                    ? 'border-[#1A2F24] hover:border-[#2D4C3A] bg-[#0E1A14]'
                    : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-xs ${
                  theme === 'dark'
                    ? 'bg-[#16291E] border-[#234330] text-[#D4F938]'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  {currentUser.full_name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className={`text-xs font-bold truncate max-w-[120px] ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {currentUser.full_name}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <RoleBadge role={currentUser.role} />
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className={`absolute right-0 mt-2 w-72 border rounded-3xl shadow-2xl p-3 z-50 space-y-3 ${
                  theme === 'dark'
                    ? 'bg-[#0E1A14] border-[#1A2F24]'
                    : 'bg-white border-slate-200'
                }`}>
                  {/* Current User Info */}
                  <div className={`p-3 rounded-2xl border space-y-1 ${
                    theme === 'dark'
                      ? 'bg-[#08120D] border-[#16281E]'
                      : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className={`text-xs font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {currentUser.full_name}
                    </div>
                    <div className="text-[11px] text-slate-400">{currentUser.email}</div>
                    <div className={`text-[11px] font-medium ${
                      theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'
                    }`}>
                      {currentUser.neighborhood}
                    </div>
                  </div>

                  {/* Switch Role / Persona */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-400 px-1">
                      Switch user / persona
                    </div>
                    <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                      {users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            loginAs(u);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                            u.id === currentUser.id
                              ? theme === 'dark'
                                ? 'bg-[#182C20] text-[#D4F938] font-bold border border-[#234330]'
                                : 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                              : theme === 'dark'
                              ? 'hover:bg-[#12221A] text-slate-300'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{u.full_name}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400 capitalize shrink-0">
                            {u.role}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Log Out */}
                  <div className={`pt-2 border-t ${
                    theme === 'dark' ? 'border-[#1A2F24]' : 'border-slate-100'
                  }`}>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`flex md:hidden items-center justify-around py-2.5 border-t ${
          theme === 'dark' ? 'border-[#1A2F24]' : 'border-slate-200'
        }`}>
          <button
            onClick={() => onTabChange('marketplace')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold ${
              activeTab === 'marketplace'
                ? theme === 'dark' ? 'bg-[#182C20] text-[#D4F938]' : 'bg-emerald-100 text-emerald-800'
                : 'text-slate-400'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shopping</span>
          </button>
          <button
            onClick={() => onTabChange('orders')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold ${
              activeTab === 'orders'
                ? theme === 'dark' ? 'bg-[#182C20] text-[#D4F938]' : 'bg-emerald-100 text-emerald-800'
                : 'text-slate-400'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders</span>
          </button>
          {role === 'admin' && (
            <button
              onClick={() => onTabChange('admin')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold ${
                activeTab === 'admin'
                  ? theme === 'dark' ? 'bg-[#182C20] text-[#D4F938]' : 'bg-emerald-100 text-emerald-800'
                  : 'text-slate-400'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
