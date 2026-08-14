import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { Gavel, ShieldCheck, Check, RotateCcw } from 'lucide-react';

export const DisputeArbitration: React.FC = () => {
  const { orders, executeCompensatingRefund, commitAndReleasePayout } = useMarketplace();

  const [arbitratingOrderId, setArbitratingOrderId] = useState<string | null>(null);
  const [arbitrationNotes, setArbitrationNotes] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Orders eligible for arbitration (funded, in_transit, delivered, or disputed)
  const activeOrders = orders.filter((o) => o.escrow_status !== 'released' && o.escrow_status !== 'refunded');

  const handleArbitrateRefund = async (orderId: string) => {
    try {
      const notes = arbitrationNotes || 'Auditor dispute arbitration: 100% compensating refund granted.';
      const res = await executeCompensatingRefund(orderId, notes);
      setActionMessage(res.message);
      setArbitratingOrderId(null);
      setArbitrationNotes('');
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    }
  };

  const handleArbitrateRelease = async (orderId: string) => {
    try {
      const res = await commitAndReleasePayout(orderId);
      setActionMessage(res.message);
      setArbitratingOrderId(null);
      setArbitrationNotes('');
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Gavel className="w-5 h-5 text-purple-400" />
          <span>Distributed Saga Dispute & Arbitration Console</span>
        </h4>
        <p className="text-xs text-slate-400">
          Independent third-party arbitration console. Enforce 2PC phase commit or execute compensating rollback transactions with automated MoMo reversibility.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-purple-950/70 border border-purple-500/40 text-xs text-purple-200">
          {actionMessage}
        </div>
      )}

      {activeOrders.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          All active escrow contracts are in nominal states. No open disputes detected.
        </div>
      ) : (
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{order.list_title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                      {order.escrow_status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Shopper: <strong className="text-slate-200">{order.shopper_name}</strong> • Store:{' '}
                    <strong className="text-slate-200">{order.store_name}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-500 font-semibold block">Locked Escrow Vault</span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">
                    GH₵ {order.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Cryptographic Footprint */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                <div>Order ID: {order.id}</div>
                <div>MoMo Ref: {order.momo_transaction_id} ({order.momo_provider})</div>
                <div className="truncate text-emerald-400">Audit Hash: {order.sha256_audit_hash}</div>
              </div>

              {/* Dispute Reason (if any) */}
              {order.dispute_reason && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300">
                  <strong>Shopper Dispute Claim:</strong> {order.dispute_reason}
                </div>
              )}

              {/* Arbitration Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <input
                  type="text"
                  value={arbitratingOrderId === order.id ? arbitrationNotes : ''}
                  onFocus={() => setArbitratingOrderId(order.id)}
                  onChange={(e) => {
                    setArbitratingOrderId(order.id);
                    setArbitrationNotes(e.target.value);
                  }}
                  placeholder="Enter auditor findings / ruling notes..."
                  className="w-full sm:flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleArbitrateRefund(order.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Compensating Refund</span>
                  </button>

                  <button
                    onClick={() => handleArbitrateRelease(order.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Force Release</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
