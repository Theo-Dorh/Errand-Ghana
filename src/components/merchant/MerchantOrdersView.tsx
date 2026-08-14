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
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="app-card rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-white to-emerald-50/40 border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Order Fulfillment & Payouts</h3>
          <p className="text-xs text-slate-500 mt-1">
            Track active customer orders with locked Mobile Money escrow. Dispatch goods and receive direct wallet settlements upon delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-right">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Active Escrow Balance</span>
            <span className="text-lg font-extrabold text-emerald-800 font-mono">
              GH₵ {myOrders.filter((o) => o.escrow_status !== 'released' && o.escrow_status !== 'refunded').reduce((s, o) => s + o.vendor_payout, 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {myOrders.length === 0 ? (
        <div className="app-card rounded-3xl p-12 text-center space-y-2">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-800">No active merchant orders yet</div>
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
                className="app-card rounded-3xl p-6 sm:p-8 space-y-5 border-slate-200 shadow-sm"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-base sm:text-lg font-bold text-slate-900">{order.list_title}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isReleased
                          ? 'bg-emerald-100 text-emerald-800'
                          : isRefunded
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.escrow_status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span>Customer: <strong className="text-slate-800">{order.shopper_name}</strong></span>
                      <span>•</span>
                      <span>Delivery: <strong className="text-slate-800">{order.neighborhood}</strong></span>
                      <span>•</span>
                      <span>MoMo Tx: <span className="font-mono text-amber-700 font-bold">{order.momo_transaction_id}</span></span>
                    </div>
                  </div>

                  {/* Financial Settlement */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                    >
                      <Receipt className="w-4 h-4 text-emerald-700" />
                      <span>Receipt</span>
                    </button>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Your Net Payout</span>
                      <span className="text-lg sm:text-xl font-extrabold text-emerald-800 font-mono">
                        GH₵ {order.vendor_payout.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        (Platform Fee 2%: GH₵ {order.platform_fee.toFixed(2)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Progression Workflow */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {isFunded && 'Phase 1 Complete: Escrow Locked in Vault. Ready for Dispatch.'}
                        {isInTransit && 'Order Dispatched: In-Transit to Customer.'}
                        {isDelivered && 'Arrived: Awaiting Customer Physical Inspection & 2PC Release.'}
                        {isReleased && 'Phase 2 Complete: GH₵ ' + order.vendor_payout.toFixed(2) + ' released to your wallet.'}
                        {isRefunded && 'Order Refunded via Saga Compensating Rollback.'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        Audit Signature: {order.sha256_audit_hash.slice(0, 24)}...
                      </div>
                    </div>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isFunded && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'in_transit')}
                        disabled={updatingOrderId === order.id}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Mark Packed & In-Transit</span>
                      </button>
                    )}

                    {isInTransit && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'delivered')}
                        disabled={updatingOrderId === order.id}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Delivered to Customer</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Delivery Messages */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    <span>Customer Delivery Notes</span>
                  </div>

                  <form onSubmit={(e) => handleSendMessage(order.id, e)} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInputs[order.id] || ''}
                      onChange={(e) => setChatInputs({ ...chatInputs, [order.id]: e.target.value })}
                      placeholder="Send update to shopper (e.g. 'Driver is on Boundary Road near Shell station')..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
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
