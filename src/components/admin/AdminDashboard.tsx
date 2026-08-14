import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
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
  Activity,
  Gavel,
  Hash,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { adminMetrics } = useMarketplace();
  const [adminTab, setAdminTab] = useState<'kyc' | 'disputes' | 'audit'>('kyc');

  const lockedBalance = adminMetrics ? adminMetrics.lockedVaultBalance : 0;
  const feesCollected = adminMetrics ? adminMetrics.totalFeesCollected : 0;
  const totalReleased = adminMetrics ? adminMetrics.totalReleased : 0;
  const totalRefunded = adminMetrics ? adminMetrics.totalRefunded : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-950 border border-purple-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Escrow Vault Governance & Audit System</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-1">
            Prof. Boateng (Escrow Auditor)
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Centralized monetary liquidity supervision, KYC merchant vetting, 2PC Saga distributed dispute arbitration, and real-time SHA-256 chain-of-custody verification.
          </p>
        </div>

        {/* Engine Status */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-200 text-xs font-semibold shrink-0">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>2PC Distributed Saga: ACTIVE</span>
        </div>
      </div>

      {/* Escrow Liquidity KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Locked Balance */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Locked Escrow Vault</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            GH₵ {lockedBalance.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secured across active orders</span>
          </div>
        </div>

        {/* Card 2: 2% Fee Collected */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">2% Platform Fee Rev</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono">
            GH₵ {feesCollected.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500">
            <span>Standard 2.0% platform fee</span>
          </div>
        </div>

        {/* Card 3: Total Disbursed Payouts */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Vendor Disbursed Payouts</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            GH₵ {totalReleased.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500">
            <span>Phase 2 settlement committed</span>
          </div>
        </div>

        {/* Card 4: Compensating Refunds */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Compensating Refunds</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">
            GH₵ {totalRefunded.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500">
            <span>Saga Rollbacks Executed</span>
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
        <button
          onClick={() => setAdminTab('kyc')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'kyc'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Store KYC Verification Queue</span>
        </button>

        <button
          onClick={() => setAdminTab('disputes')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'disputes'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>Saga Dispute Arbitration</span>
        </button>

        <button
          onClick={() => setAdminTab('audit')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'audit'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>Cryptographic SHA-256 Audit Trail</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {adminTab === 'kyc' && <StoreKycQueue />}
        {adminTab === 'disputes' && <DisputeArbitration />}
        {adminTab === 'audit' && <AuditLedgerView />}
      </div>
    </div>
  );
};
