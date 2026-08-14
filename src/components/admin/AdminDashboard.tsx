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
      <div className="app-card rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-white to-purple-50/40 border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Platform Administration & Governance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Errand Ghana Operations Console
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Supervise platform liquidity, manage and create user roles, review store merchant KYC credentials, and arbitrate order disputes.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold shrink-0">
          <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
          <span>Escrow Vault: Operational</span>
        </div>
      </div>

      {/* Escrow Liquidity KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Locked Balance */}
        <div className="app-card rounded-3xl p-5 space-y-2 border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Locked Escrow Vault</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            GH₵ {lockedBalance.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secured across active orders</span>
          </div>
        </div>

        {/* Card 2: 2% Fee Revenue */}
        <div className="app-card rounded-3xl p-5 space-y-2 border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Platform Fee Revenue (2%)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-900 font-mono">
            GH₵ {feesCollected.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500">
            <span>2.0% standard escrow fee</span>
          </div>
        </div>

        {/* Card 3: Total Vendor Payouts */}
        <div className="app-card rounded-3xl p-5 space-y-2 border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Disbursed Merchant Payouts</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 font-mono">
            GH₵ {totalReleased.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500">
            <span>Completed settlements</span>
          </div>
        </div>

        {/* Card 4: Compensating Refunds */}
        <div className="app-card rounded-3xl p-5 space-y-2 border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Dispute Refunds</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-800 font-mono">
            GH₵ {totalRefunded.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500">
            <span>Reversed to shopper MoMo</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/80 max-w-2xl">
        <button
          onClick={() => setAdminTab('users')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'users'
              ? 'bg-white text-purple-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & Role Governance</span>
        </button>

        <button
          onClick={() => setAdminTab('kyc')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'kyc'
              ? 'bg-white text-purple-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Store KYC Approvals</span>
        </button>

        <button
          onClick={() => setAdminTab('disputes')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'disputes'
              ? 'bg-white text-purple-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>Disputes</span>
        </button>

        <button
          onClick={() => setAdminTab('audit')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'audit'
              ? 'bg-white text-purple-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
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
