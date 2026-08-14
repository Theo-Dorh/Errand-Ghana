import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
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
  const { theme } = useTheme();
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
      <div className={`rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border transition-all ${
        theme === 'dark'
          ? 'apex-card border-[#1A2F24] bg-gradient-to-br from-[#0E1A14] via-[#0E1A14] to-[#12241B]'
          : 'bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/30 border-emerald-100/90 shadow-sm'
      }`}>
        <div>
          <h3 className={`text-xl sm:text-2xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Order Fulfillment & Payouts
          </h3>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Track active customer orders with locked Mobile Money protection. Dispatch fresh goods and receive direct wallet settlements upon customer delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`p-3.5 rounded-2xl border text-right ${
            theme === 'dark' ? 'bg-[#08120D] border-[#16281E]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <span className="text-[10px] text-slate-400 block font-semibold">Active escrow balance</span>
            <span className={`text-lg font-black font-mono ${
              theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-800'
            }`}>
              GH₵ {myOrders.filter((o) => o.escrow_status !== 'released' && o.escrow_status !== 'refunded').reduce((s, o) => s + o.vendor_payout, 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {myOrders.length === 0 ? (
        <div className="apex-card rounded-3xl p-12 text-center space-y-2">
          <Package className="w-10 h-10 text-slate-400 mx-auto" />
          <div className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            No active store orders yet
          </div>
          <div className="text-xs text-slate-400">
            Submit bids on the Market Demand Feed to win orders.
          </div>
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
                className="apex-card rounded-3xl p-6 sm:p-8 space-y-5 apex-card-hover"
              >
                {/* Header */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
                  theme === 'dark' ? 'border-[#1A2F24]' : 'border-slate-200/80'
                }`}>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className={`text-base sm:text-lg font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {order.list_title}
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isReleased
                          ? theme === 'dark' ? 'bg-[#182C20] text-[#D4F938] border-[#234330]' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : isRefunded
                          ? theme === 'dark' ? 'bg-rose-950/50 text-rose-300 border-rose-800/60' : 'bg-rose-100 text-rose-800 border-rose-200'
                          : theme === 'dark' ? 'bg-[#251D10] text-[#F59E0B] border-[#40311B]' : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {order.escrow_status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                      <span>Customer: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>
                        {order.shopper_name}
                      </strong></span>
                      <span>•</span>
                      <span>Delivery: <strong className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                        {order.neighborhood}
                      </strong></span>
                      <span>•</span>
                      <span>MoMo Tx: <span className="font-mono text-amber-600 font-bold">{order.momo_transaction_id}</span></span>
                    </div>
                  </div>

                  {/* Financial Settlement */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedReceiptOrder(order)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-colors ${
                        theme === 'dark'
                          ? 'bg-[#08120D] border-[#16281E] hover:bg-[#12221A] text-[#D4F938]'
                          : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Receipt</span>
                    </button>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">Your net payout</span>
                      <span className={`text-lg sm:text-xl font-black font-mono ${
                        theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-800'
                      }`}>
                        GH₵ {order.vendor_payout.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        (Platform Fee 2%: GH₵ {order.platform_fee.toFixed(2)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Progression Workflow */}
                <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  theme === 'dark' ? 'bg-[#08120D] border-[#16281E]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className={`w-5 h-5 ${theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'}`} />
                    <div>
                      <div className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {isFunded && 'Safe Pay Locked: Customer funds secured in vault. Ready for packing.'}
                        {isInTransit && 'In-Transit: Delivery driver is en route to customer.'}
                        {isDelivered && 'Arrived: Awaiting customer quality inspection at doorstep.'}
                        {isReleased && 'Payout Complete: GH₵ ' + order.vendor_payout.toFixed(2) + ' released to your Mobile Money.'}
                        {isRefunded && 'Order Refunded to customer.'}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
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
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl btn-apex text-xs font-black shadow-lg transition-all"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Mark Packed & In-Transit</span>
                      </button>
                    )}

                    {isInTransit && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'delivered')}
                        disabled={updatingOrderId === order.id}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl btn-apex text-xs font-black shadow-lg transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Delivered to Customer</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Delivery Messages */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  theme === 'dark' ? 'bg-[#08120D] border-[#16281E]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`flex items-center gap-2 text-xs font-bold ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                    <span>Customer Delivery Notes</span>
                  </div>

                  <form onSubmit={(e) => handleSendMessage(order.id, e)} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInputs[order.id] || ''}
                      onChange={(e) => setChatInputs({ ...chatInputs, [order.id]: e.target.value })}
                      placeholder="Send update to shopper (e.g. 'Driver is on Boundary Road near Shell station')..."
                      className={`flex-1 px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                        theme === 'dark'
                          ? 'bg-[#0E1A14] border-[#1A2F24] text-white placeholder-slate-500 focus:border-[#D4F938]'
                          : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
                      }`}
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl btn-apex text-xs font-bold transition-colors"
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
