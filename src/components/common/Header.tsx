import React from 'react';
import { ErrandLogo } from './ErrandLogo.tsx';
import { RoleBadge } from './RoleBadge.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { Shield, RefreshCw, UserCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'marketplace' | 'orders' | 'admin' | 'docs';
  onTabChange: (tab: 'marketplace' | 'orders' | 'admin' | 'docs') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { currentUser, switchUser, availableUsers, role } = useAuth();
  const { adminMetrics, refreshData, loading } = useMarketplace();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Academic Tag */}
          <div className="flex items-center gap-6">
            <ErrandLogo size="md" />
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300">
              <span className="font-semibold">CSCD 602</span>
              <span className="text-slate-500">•</span>
              <span>UG Legon (Theophilus Dorh)</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
            <button
              onClick={() => onTabChange('marketplace')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Market Demand Feed
            </button>
            <button
              onClick={() => onTabChange('orders')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              2PC Escrow Orders
            </button>
            <button
              onClick={() => onTabChange('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Vault Governance & Audit
            </button>
            <button
              onClick={() => onTabChange('docs')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'docs'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Academic Docs
            </button>
          </nav>

          {/* Live Escrow Vault Status & Persona Switcher */}
          <div className="flex items-center gap-3">
            {/* Vault Balance Indicator */}
            <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Vault Balance</span>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  GH₵ {adminMetrics ? adminMetrics.lockedVaultBalance.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            {/* Sync Refresh Button */}
            <button
              onClick={() => refreshData()}
              disabled={loading}
              title="Refresh Live Market & Escrow State"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate">
                    {currentUser.full_name}
                  </span>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <RoleBadge role={role} size="sm" />
              </div>

              <select
                value={currentUser.id}
                onChange={(e) => {
                  const selected = availableUsers.find((u) => u.id === e.target.value);
                  if (selected) switchUser(selected);
                }}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name} ({u.role.toUpperCase()} - {u.neighborhood})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
