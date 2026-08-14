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
  Lock,
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <ErrandLogo size="md" />

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl">
              <button
                onClick={() => onTabChange('marketplace')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'marketplace'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role === 'shopper' && <ShoppingBag className="w-4 h-4 text-emerald-700" />}
                {role === 'store' && <Store className="w-4 h-4 text-amber-600" />}
                {role === 'admin' && <Shield className="w-4 h-4 text-purple-600" />}
                <span>
                  {role === 'shopper' ? 'Grocery Demands' : role === 'store' ? 'Market Demands' : 'Operations'}
                </span>
              </button>

              <button
                onClick={() => onTabChange('orders')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4 text-emerald-700" />
                <span>{role === 'store' ? 'Fulfillment & Orders' : 'My Escrow Orders'}</span>
              </button>

              {role === 'admin' && (
                <button
                  onClick={() => onTabChange('admin')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'admin'
                      ? 'bg-white text-purple-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Admin & Roles</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Section: Escrow Vault Pill & User Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Vault Ticker */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-500 font-medium">Vault:</span>
              <span className="font-mono font-bold text-emerald-800">
                GH₵ {lockedVault.toFixed(2)}
              </span>
              <Lock className="w-3 h-3 text-emerald-600 ml-0.5" />
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {currentUser.full_name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
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
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-3xl shadow-xl p-3 z-50 space-y-3">
                  {/* Current User Info */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="text-xs font-bold text-slate-900">{currentUser.full_name}</div>
                    <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                    <div className="text-[11px] text-emerald-700 font-medium">{currentUser.neighborhood}</div>
                  </div>

                  {/* Switch Role / Persona */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                      Switch Active User / Role
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
                              ? 'bg-emerald-50 text-emerald-900 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{u.full_name}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500 uppercase shrink-0">
                            {u.role}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Log Out */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
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

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100">
          <button
            onClick={() => onTabChange('marketplace')}
            className={`flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-bold ${
              activeTab === 'marketplace' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Marketplace</span>
          </button>
          <button
            onClick={() => onTabChange('orders')}
            className={`flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-bold ${
              activeTab === 'orders' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders</span>
          </button>
          {role === 'admin' && (
            <button
              onClick={() => onTabChange('admin')}
              className={`flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-bold ${
                activeTab === 'admin' ? 'bg-amber-50 text-amber-800' : 'text-slate-500'
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
