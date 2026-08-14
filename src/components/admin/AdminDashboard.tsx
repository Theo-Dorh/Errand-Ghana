import React, { useState } from 'react';
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
  const { adminMetrics } = useMarketplace();
  const [adminTab, setAdminTab] = useState<'users' | 'kyc' | 'disputes' | 'audit'>('users');

  const lockedBalance = adminMetrics ? adminMetrics.lockedVaultBalance : 0;
  const feesCollected = adminMetrics ? adminMetrics.totalFeesCollected : 0;
  const totalReleased = adminMetrics ? adminMetrics.totalReleased : 0;
  const totalRefunded = adminMetrics ? adminMetrics.totalRefunded : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="apex-card rounded-3xl p-6 sm:p-8 border-[#1A2F24] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-[#0E1A14] via-[#0E1A14] to-[#181226]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182C20] border border-[#234330] text-[11px] font-bold text-[#D4F938]">
            <Shield className="w-3.5 h-3.5" />
            <span>Operations & Role Governance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Errand Ghana Operations Console
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Supervise platform liquidity, create and manage user roles (Shopper, Store, Admin), verify store merchant KYC credentials, and arbitrate refunds.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#182C20] border border-[#234330] text-[#D4F938] text-xs font-bold shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#D4F938] animate-pulse" />
          <span>Escrow Vault: Active & Secure</span>
        </div>
      </div>

      {/* KPI Stat Cards (Apex Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Locked Balance */}
        <div className="apex-card rounded-3xl p-5 space-y-2 border-[#1A2F24]">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Locked Escrow Vault</span>
            <div className="w-8 h-8 rounded-xl bg-[#251D10] text-[#F59E0B] flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            GH₵ {lockedBalance.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#D4F938]" />
            <span>Secured across active orders</span>
          </div>
        </div>

        {/* Card 2: 2% Fee Revenue */}
        <div className="apex-card rounded-3xl p-5 space-y-2 border-[#1A2F24]">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Platform Fee Revenue (2%)</span>
            <div className="w-8 h-8 rounded-xl bg-[#182C20] text-[#D4F938] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#D4F938] font-mono">
            GH₵ {feesCollected.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400">
            <span>2.0% standard escrow fee</span>
          </div>
        </div>

        {/* Card 3: Total Vendor Payouts */}
        <div className="apex-card rounded-3xl p-5 space-y-2 border-[#1A2F24]">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Disbursed Store Payouts</span>
            <div className="w-8 h-8 rounded-xl bg-[#16291E] text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            GH₵ {totalReleased.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400">
            <span>Completed settlements</span>
          </div>
        </div>

        {/* Card 4: Compensating Refunds */}
        <div className="apex-card rounded-3xl p-5 space-y-2 border-[#1A2F24]">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Dispute Refunds</span>
            <div className="w-8 h-8 rounded-xl bg-rose-950/50 text-rose-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">
            GH₵ {totalRefunded.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400">
            <span>Reversed to shopper MoMo</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Apex Pill Design) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0E1A14] border border-[#1A2F24] max-w-2xl">
        <button
          onClick={() => setAdminTab('users')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            adminTab === 'users'
              ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & Role Governance</span>
        </button>

        <button
          onClick={() => setAdminTab('kyc')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            adminTab === 'kyc'
              ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Store KYC Approvals</span>
        </button>

        <button
          onClick={() => setAdminTab('disputes')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            adminTab === 'disputes'
              ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>Disputes</span>
        </button>

        <button
          onClick={() => setAdminTab('audit')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            adminTab === 'audit'
              ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
              : 'text-slate-400 hover:text-white'
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
