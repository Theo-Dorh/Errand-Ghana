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
      const notes = arbitrationNotes || 'Auditor dispute arbitration: 100% refund granted.';
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
    <div className="space-y-6">
      <div>
        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Gavel className="w-5 h-5 text-purple-700" />
          <span>Dispute & Arbitration Console</span>
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Review customer disputes, enforce settlement release, or trigger automated 100% refunds directly to buyer MoMo.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900">
          {actionMessage}
        </div>
      )}

      {activeOrders.length === 0 ? (
        <div className="app-card rounded-3xl p-12 text-center text-xs text-slate-500 border-slate-200 space-y-2">
          <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
          <div className="text-sm font-bold text-slate-800">All active escrow orders are in nominal states</div>
          <div>No open customer disputes detected.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <div
              key={order.id}
              className="app-card rounded-3xl p-6 space-y-4 border-slate-200 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{order.list_title}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {order.escrow_status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Customer: <strong className="text-slate-800">{order.shopper_name}</strong> • Store:{' '}
                    <strong className="text-slate-800">{order.store_name}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Locked Escrow</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    GH₵ {order.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Footprint */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] font-mono text-slate-600 space-y-0.5">
                <div>Order ID: {order.id}</div>
                <div>MoMo Ref: {order.momo_transaction_id} ({order.momo_provider})</div>
                <div className="truncate text-emerald-700">Audit Hash: {order.sha256_audit_hash}</div>
              </div>

              {/* Dispute Reason (if any) */}
              {order.dispute_reason && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  <strong>Customer Dispute Claim:</strong> {order.dispute_reason}
                </div>
              )}

              {/* Arbitration Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <input
                  type="text"
                  value={arbitratingOrderId === order.id ? arbitrationNotes : ''}
                  onFocus={() => setArbitratingOrderId(order.id)}
                  onChange={(e) => {
                    setArbitratingOrderId(order.id);
                    setArbitrationNotes(e.target.value);
                  }}
                  placeholder="Enter auditor ruling notes..."
                  className="w-full sm:flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                />

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleArbitrateRefund(order.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Refund Shopper</span>
                  </button>

                  <button
                    onClick={() => handleArbitrateRelease(order.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Release to Store</span>
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
