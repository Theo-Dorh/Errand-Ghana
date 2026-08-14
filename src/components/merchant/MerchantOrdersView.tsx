import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { EscrowReceiptModal } from '../receipt/EscrowReceiptModal.tsx';
import {
  Package,
  Truck,
  CheckCircle,
  Receipt,
  ShieldCheck,
  Send,
  MessageSquare,
} from 'lucide-react';

export const MerchantOrdersView: React.FC = () => {
  const { currentUser } = useAuth();
  const { orders, updateOrderStatus, sendOrderMessage } = useMarketplace();

  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<any>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [chatInputs, setChatInputs] = useState<Record<string, string>>({});

  // Filter orders for this merchant
  const myOrders = orders.filter((o) => o.store_id === currentUser.id);

  const handleUpdateStatus = async (orderId: string, status: 'in_transit' | 'delivered') => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(orderId, status);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleSendMessage = async (orderId: string, e: React.FormEvent) => {
    e.preventDefault();
    const msg = chatInputs[orderId];
    if (!msg || !msg.trim()) return;

    await sendOrderMessage(orderId, msg);
    setChatInputs({ ...chatInputs, [orderId]: '' });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-100">Merchant Fulfillment & Escrow Payouts</h3>
          <p className="text-xs text-slate-400 mt-1">
            Track orders with locked Mobile Money escrow. Dispatch goods and receive direct wallet settlements upon delivery confirmation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Active Escrow Value</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">
              GH₵ {myOrders.filter((o) => o.escrow_status !== 'released' && o.escrow_status !== 'refunded').reduce((s, o) => s + o.vendor_payout, 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {myOrders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-2">
          <Package className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-300">No active merchant orders yet</div>
          <div className="text-xs text-slate-500">Submit bids on the Market Demand Feed to win orders.</div>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => {
            const isFunded = order.escrow_status === 'funded';
            const isInTransit = order.escrow_status === 'in_transit';
            const isDelivered = order.escrow_status === 'delivered';
            const isReleased = order.escrow_status === 'released';
            const isRefunded = order.escrow_status === 'refunded';

            return (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-100">{order.list_title}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        isReleased
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                          : isRefunded
                          ? 'bg-rose-950 text-rose-300 border-rose-500/30'
                          : 'bg-amber-950 text-amber-300 border-amber-500/30'
                      }`}>
                        {order.escrow_status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                      <span>Shopper: <strong className="text-slate-200">{order.shopper_name}</strong></span>
                      <span>•</span>
                      <span>Delivery: <strong className="text-slate-200">{order.neighborhood}</strong></span>
                      <span>•</span>
                      <span>MoMo Tx: <span className="font-mono text-amber-400 font-bold">{order.momo_transaction_id}</span></span>
                    </div>
                  </div>

                  {/* Financial Settlement */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Receipt</span>
                    </button>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Your Payout</span>
                      <span className="text-lg font-extrabold text-emerald-400 font-mono">
                        GH₵ {order.vendor_payout.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        (Fee 2%: GH₵ {order.platform_fee.toFixed(2)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Progression Workflow */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {isFunded && 'Phase 1 Complete: Escrow Locked in Vault. Ready for Dispatch.'}
                        {isInTransit && 'Order Dispatched: In-Transit to Customer Neighborhood.'}
                        {isDelivered && 'Arrived: Awaiting Customer Physical Inspection & 2PC Release.'}
                        {isReleased && 'Phase 2 Complete: GH₵ ' + order.vendor_payout.toFixed(2) + ' released to your wallet.'}
                        {isRefunded && 'Order Refunded via Saga Compensating Rollback.'}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        SHA-256 Audit: {order.sha256_audit_hash.slice(0, 24)}...
                      </div>
                    </div>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isFunded && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'in_transit')}
                        disabled={updatingOrderId === order.id}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Mark Packed & In-Transit</span>
                      </button>
                    )}

                    {isInTransit && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'delivered')}
                        disabled={updatingOrderId === order.id}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Delivered to Neighborhood</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Delivery Messages */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>Customer Delivery Notes</span>
                  </div>

                  <form onSubmit={(e) => handleSendMessage(order.id, e)} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInputs[order.id] || ''}
                      onChange={(e) => setChatInputs({ ...chatInputs, [order.id]: e.target.value })}
                      placeholder="Send update to shopper (e.g. 'Driver is on Boundary Road near Shell station')..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Receipt */}
      {selectedReceiptOrder && (
        <EscrowReceiptModal
          order={selectedReceiptOrder}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}
    </div>
  );
};
