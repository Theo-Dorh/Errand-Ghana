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
      <div className="apex-card rounded-3xl p-6 sm:p-8 border-[#1A2F24] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-[#0E1A14] via-[#0E1A14] to-[#12241B]">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">Order Fulfillment & Payouts</h3>
          <p className="text-xs text-slate-400 mt-1">
            Track active customer orders with locked Mobile Money protection. Dispatch fresh goods and receive direct wallet settlements upon customer delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-[#08120D] border border-[#16281E] text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Active Escrow Balance</span>
            <span className="text-lg font-black text-[#D4F938] font-mono">
              GH₵ {myOrders.filter((o) => o.escrow_status !== 'released' && o.escrow_status !== 'refunded').reduce((s, o) => s + o.vendor_payout, 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {myOrders.length === 0 ? (
        <div className="apex-card rounded-3xl p-12 text-center space-y-2 border-[#1A2F24]">
          <Package className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-bold text-white">No active store orders yet</div>
          <div className="text-xs text-slate-400">Submit bids on the Market Demand Feed to win orders.</div>
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
                className="apex-card rounded-3xl p-6 sm:p-8 space-y-5 border-[#1A2F24] apex-card-hover"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A2F24]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-base sm:text-lg font-bold text-white">{order.list_title}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isReleased
                          ? 'bg-[#182C20] text-[#D4F938] border border-[#234330]'
                          : isRefunded
                          ? 'bg-rose-950/50 text-rose-300 border border-rose-800/60'
                          : 'bg-[#251D10] text-[#F59E0B] border border-[#40311B]'
                      }`}>
                        {order.escrow_status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                      <span>Customer: <strong className="text-white">{order.shopper_name}</strong></span>
                      <span>•</span>
                      <span>Delivery: <strong className="text-slate-300">{order.neighborhood}</strong></span>
                      <span>•</span>
                      <span>MoMo Tx: <span className="font-mono text-[#F59E0B] font-bold">{order.momo_transaction_id}</span></span>
                    </div>
                  </div>

                  {/* Financial Settlement */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#08120D] border border-[#16281E] hover:bg-[#12221A] text-[#D4F938] text-xs font-bold transition-colors"
                    >
                      <Receipt className="w-4 h-4 text-[#D4F938]" />
                      <span>Receipt</span>
                    </button>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Your Net Payout</span>
                      <span className="text-lg sm:text-xl font-black text-[#D4F938] font-mono">
                        GH₵ {order.vendor_payout.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        (Platform Fee 2%: GH₵ {order.platform_fee.toFixed(2)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Progression Workflow */}
                <div className="p-4 rounded-2xl bg-[#08120D] border border-[#16281E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#D4F938]" />
                    <div>
                      <div className="text-xs font-bold text-white">
                        {isFunded && 'Safe Pay Locked: Customer funds secured in vault. Ready for packing.'}
                        {isInTransit && 'In-Transit: Delivery driver is en route to customer.'}
                        {isDelivered && 'Arrived: Awaiting customer quality inspection at doorstep.'}
                        {isReleased && 'Payout Complete: GH₵ ' + order.vendor_payout.toFixed(2) + ' released to your Mobile Money.'}
                        {isRefunded && 'Order Refunded to customer.'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        Order Security ID: {order.sha256_audit_hash.slice(0, 24)}...
                      </div>
                    </div>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isFunded && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'in_transit')}
                        disabled={updatingOrderId === order.id}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl btn-apex text-xs font-black shadow-lg shadow-[#D4F938]/15 transition-all"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Mark Packed & In-Transit</span>
                      </button>
                    )}

                    {isInTransit && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'delivered')}
                        disabled={updatingOrderId === order.id}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl btn-apex text-xs font-black shadow-lg shadow-[#D4F938]/15 transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Delivered to Customer</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Delivery Messages */}
                <div className="p-4 rounded-2xl bg-[#08120D] border border-[#16281E] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <MessageSquare className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Customer Delivery Notes</span>
                  </div>

                  <form onSubmit={(e) => handleSendMessage(order.id, e)} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInputs[order.id] || ''}
                      onChange={(e) => setChatInputs({ ...chatInputs, [order.id]: e.target.value })}
                      placeholder="Send update to shopper (e.g. 'Driver is on Boundary Road near Shell station')..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#0E1A14] border border-[#1A2F24] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4F938]"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl btn-apex text-black transition-colors"
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
