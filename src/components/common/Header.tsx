import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
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
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'marketplace' | 'orders' | 'admin';
  onTabChange: (tab: 'marketplace' | 'orders' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { currentUser, role, users, loginAs, logout } = useAuth();
  const { adminMetrics } = useMarketplace();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const lockedVault = adminMetrics ? adminMetrics.lockedVaultBalance : 0;

  return (
    <header className="sticky top-0 z-40 bg-[#080F0B]/95 backdrop-blur-md border-b border-[#1A2F24] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6">
            <ErrandLogo size="md" variant="dark" />

            {/* Navigation Tabs (Apex Pill Design) */}
            <nav className="hidden md:flex items-center gap-1.5 p-1 bg-[#0E1A14] rounded-2xl border border-[#1A2F24]">
              <button
                onClick={() => onTabChange('marketplace')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'marketplace'
                    ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {role === 'shopper' && <ShoppingBag className="w-4 h-4 text-[#D4F938]" />}
                {role === 'store' && <Store className="w-4 h-4 text-[#D4F938]" />}
                {role === 'admin' && <Shield className="w-4 h-4 text-[#D4F938]" />}
                <span>
                  {role === 'shopper' ? 'Grocery Shopping' : role === 'store' ? 'Market Demands' : 'Operations'}
                </span>
              </button>

              <button
                onClick={() => onTabChange('orders')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4 text-[#D4F938]" />
                <span>{role === 'store' ? 'Active Orders' : 'My Orders'}</span>
              </button>

              {role === 'admin' && (
                <button
                  onClick={() => onTabChange('admin')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    activeTab === 'admin'
                      ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-4 h-4 text-[#D4F938]" />
                  <span>Admin & Roles</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Section: Safe Pay Vault Ticker & User Profile Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Safe Pay Vault Ticker */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12221A] border border-[#1F3A2C] text-xs shadow-inner">
              <div className="w-2 h-2 rounded-full bg-[#D4F938] animate-pulse" />
              <span className="text-slate-400 text-[11px] font-medium">Safe Pay Vault:</span>
              <span className="font-mono font-bold text-[#D4F938]">
                GH₵ {lockedVault.toFixed(2)}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-2xl border border-[#1A2F24] hover:border-[#2D4C3A] bg-[#0E1A14] transition-all text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-[#16291E] border border-[#234330] text-[#D4F938] flex items-center justify-center font-black text-xs">
                  {currentUser.full_name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-bold text-white truncate max-w-[120px]">
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
                <div className="absolute right-0 mt-2 w-72 bg-[#0E1A14] border border-[#1A2F24] rounded-3xl shadow-2xl p-3 z-50 space-y-3">
                  {/* Current User Info */}
                  <div className="p-3 rounded-2xl bg-[#08120D] border border-[#16281E] space-y-1">
                    <div className="text-xs font-bold text-white">{currentUser.full_name}</div>
                    <div className="text-[11px] text-slate-400">{currentUser.email}</div>
                    <div className="text-[11px] text-[#D4F938] font-medium">{currentUser.neighborhood}</div>
                  </div>

                  {/* Switch Role / Persona */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                      Switch User / Persona
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
                              ? 'bg-[#182C20] text-[#D4F938] font-bold border border-[#234330]'
                              : 'hover:bg-[#12221A] text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{u.full_name}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase shrink-0">
                            {u.role}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Log Out */}
                  <div className="pt-2 border-t border-[#1A2F24]">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors"
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
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-[#1A2F24]">
          <button
            onClick={() => onTabChange('marketplace')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold ${
              activeTab === 'marketplace' ? 'bg-[#182C20] text-[#D4F938]' : 'text-slate-400'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shopping</span>
          </button>
          <button
            onClick={() => onTabChange('orders')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold ${
              activeTab === 'orders' ? 'bg-[#182C20] text-[#D4F938]' : 'text-slate-400'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders</span>
          </button>
          {role === 'admin' && (
            <button
              onClick={() => onTabChange('admin')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold ${
                activeTab === 'admin' ? 'bg-[#182C20] text-[#D4F938]' : 'text-slate-400'
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
