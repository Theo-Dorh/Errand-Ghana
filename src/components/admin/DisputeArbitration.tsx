import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext.tsx';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { Gavel, ShieldCheck, Check, RotateCcw } from 'lucide-react';

export const DisputeArbitration: React.FC = () => {
  const { theme } = useTheme();
  const { orders, executeCompensatingRefund, commitAndReleasePayout } = useMarketplace();

  const [arbitratingOrderId, setArbitratingOrderId] = useState<string | null>(null);
  const [arbitrationNotes, setArbitrationNotes] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Orders eligible for arbitration
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
        <h4 className={`text-base font-bold flex items-center gap-2 ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          <Gavel className={`w-5 h-5 ${theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'}`} />
          <span>Dispute & Arbitration Console</span>
        </h4>
        <p className="text-xs text-slate-400 mt-0.5">
          Review customer disputes, enforce settlement release, or trigger automated 100% refunds directly to buyer MoMo.
        </p>
      </div>

      {actionMessage && (
        <div className={`p-3.5 rounded-2xl border text-xs ${
          theme === 'dark'
            ? 'bg-[#182C20] border-[#234330] text-[#D4F938]'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          {actionMessage}
        </div>
      )}

      {activeOrders.length === 0 ? (
        <div className="apex-card rounded-3xl p-12 text-center text-xs text-slate-400 space-y-2">
          <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
          <div className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            All active escrow orders are in nominal states
          </div>
          <div>No open customer disputes detected.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <div
              key={order.id}
              className="apex-card rounded-3xl p-6 space-y-4 apex-card-hover"
            >
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
                theme === 'dark' ? 'border-[#1A2F24]' : 'border-slate-200'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {order.list_title}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      theme === 'dark'
                        ? 'bg-[#251D10] text-[#F59E0B] border-[#40311B]'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>
                      {order.escrow_status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Customer: <strong className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{order.shopper_name}</strong> • Store:{' '}
                    <strong className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{order.store_name}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-semibold block">Locked escrow</span>
                  <span className={`text-base font-black font-mono ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    GH₵ {order.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Footprint */}
              <div className={`p-3 rounded-2xl border text-[11px] font-mono text-slate-400 space-y-0.5 ${
                theme === 'dark' ? 'bg-[#08120D] border-[#16281E]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>Order ID: {order.id}</div>
                <div>MoMo Ref: {order.momo_transaction_id} ({order.momo_provider})</div>
                <div className={`truncate ${theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'}`}>
                  Security Signature: {order.sha256_audit_hash}
                </div>
              </div>

              {/* Dispute Reason */}
              {order.dispute_reason && (
                <div className={`p-3.5 rounded-2xl border text-xs ${
                  theme === 'dark'
                    ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
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
                  className={`w-full sm:flex-1 px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-[#08120D] border-[#16281E] text-white placeholder-slate-500 focus:border-[#D4F938]'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:bg-white'
                  }`}
                />

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleArbitrateRefund(order.id)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                      theme === 'dark'
                        ? 'bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border-rose-800/60'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Refund Shopper</span>
                  </button>

                  <button
                    onClick={() => handleArbitrateRelease(order.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl btn-apex text-xs font-black shadow-lg transition-colors"
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
