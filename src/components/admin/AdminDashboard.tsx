import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext.tsx';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { UserRoleManager } from './UserRoleManager.tsx';
import { StoreKycQueue } from './StoreKycQueue.tsx';
import { DisputeArbitration } from './DisputeArbitration.tsx';
import { AuditLedgerView } from './AuditLedgerView.tsx';
import {
  Shield,
  Coins,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  Users,
  UserCheck,
  Gavel,
  Hash,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { theme } = useTheme();
  const { adminMetrics } = useMarketplace();
  const [adminTab, setAdminTab] = useState<'users' | 'kyc' | 'disputes' | 'audit'>('users');

  const lockedBalance = adminMetrics ? adminMetrics.lockedVaultBalance : 0;
  const feesCollected = adminMetrics ? adminMetrics.totalFeesCollected : 0;
  const totalReleased = adminMetrics ? adminMetrics.totalReleased : 0;
  const totalRefunded = adminMetrics ? adminMetrics.totalRefunded : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border transition-all ${
        theme === 'dark'
          ? 'apex-card border-[#1A2F24] bg-gradient-to-br from-[#0E1A14] via-[#0E1A14] to-[#181226]'
          : 'bg-gradient-to-br from-emerald-50/80 via-white to-purple-50/30 border-emerald-100/90 shadow-sm'
      }`}>
        <div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold ${
            theme === 'dark'
              ? 'bg-[#182C20] border-[#234330] text-[#D4F938]'
              : 'bg-emerald-100/70 border-emerald-200 text-emerald-800'
          }`}>
            <Shield className="w-3.5 h-3.5" />
            <span>Operations & Role Governance</span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-extrabold mt-1 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Errand Ghana Operations Console
          </h2>
          <p className={`text-xs mt-1 max-w-xl ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Supervise platform liquidity, create and manage user roles (Shopper, Store, Admin), verify store merchant KYC credentials, and arbitrate refunds.
          </p>
        </div>

        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold shrink-0 ${
          theme === 'dark'
            ? 'bg-[#182C20] border-[#234330] text-[#D4F938]'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            theme === 'dark' ? 'bg-[#D4F938]' : 'bg-emerald-600'
          }`} />
          <span>Escrow Vault: Active & Secure</span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Locked Balance */}
        <div className="apex-card rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Locked Escrow Vault</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-[#251D10] text-[#F59E0B]' : 'bg-amber-50 text-amber-700'
            }`}>
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            GH₵ {lockedBalance.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secured across active orders</span>
          </div>
        </div>

        {/* Card 2: 2% Fee Revenue */}
        <div className="apex-card rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Platform Fee Revenue (2%)</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-[#182C20] text-[#D4F938]' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${
            theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-800'
          }`}>
            GH₵ {feesCollected.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400">
            <span>2.0% standard escrow fee</span>
          </div>
        </div>

        {/* Card 3: Total Vendor Payouts */}
        <div className="apex-card rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Disbursed Store Payouts</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-[#16291E] text-emerald-400' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${
            theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'
          }`}>
            GH₵ {totalReleased.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400">
            <span>Completed settlements</span>
          </div>
        </div>

        {/* Card 4: Compensating Refunds */}
        <div className="apex-card rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Dispute Refunds</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-rose-950/50 text-rose-400' : 'bg-rose-50 text-rose-700'
            }`}>
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${
            theme === 'dark' ? 'text-rose-400' : 'text-rose-700'
          }`}>
            GH₵ {totalRefunded.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400">
            <span>Reversed to shopper MoMo</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Apex Pill Design) */}
      <div className={`flex items-center gap-2 p-1.5 rounded-2xl border max-w-2xl ${
        theme === 'dark' ? 'bg-[#0E1A14] border-[#1A2F24]' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => setAdminTab('users')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            adminTab === 'users'
              ? theme === 'dark'
                ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
                : 'bg-white text-emerald-800 border border-slate-200 shadow-sm'
              : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & Role Governance</span>
        </button>

        <button
          onClick={() => setAdminTab('kyc')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            adminTab === 'kyc'
              ? theme === 'dark'
                ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
                : 'bg-white text-emerald-800 border border-slate-200 shadow-sm'
              : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Store KYC Approvals</span>
        </button>

        <button
          onClick={() => setAdminTab('disputes')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            adminTab === 'disputes'
              ? theme === 'dark'
                ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
                : 'bg-white text-emerald-800 border border-slate-200 shadow-sm'
              : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>Disputes</span>
        </button>

        <button
          onClick={() => setAdminTab('audit')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            adminTab === 'audit'
              ? theme === 'dark'
                ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
                : 'bg-white text-emerald-800 border border-slate-200 shadow-sm'
              : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>Audit Ledger</span>
        </button>
      </div>

      {/* Tab View Content */}
      <div className="pt-2">
        {adminTab === 'users' && <UserRoleManager />}
        {adminTab === 'kyc' && <StoreKycQueue />}
        {adminTab === 'disputes' && <DisputeArbitration />}
        {adminTab === 'audit' && <AuditLedgerView />}
      </div>
    </div>
  );
};
