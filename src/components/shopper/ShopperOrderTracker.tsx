import React, { useState } from 'react';
import { Order, DemandList } from '../../types/index.ts';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { EscrowReceiptModal } from '../receipt/EscrowReceiptModal.tsx';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Package,
  AlertTriangle,
  Receipt,
  FileCheck,
  Check,
  Send,
  MessageSquare,
} from 'lucide-react';

interface ShopperOrderTrackerProps {
  order: Order;
  list?: DemandList;
}

export const ShopperOrderTracker: React.FC<ShopperOrderTrackerProps> = ({ order, list }) => {
  const { commitAndReleasePayout, executeCompensatingRefund, sendOrderMessage } = useMarketplace();

  const [showReceipt, setShowReceipt] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [chatInput, setChatInput] = useState('');

  // Inspection Checklist state
  const [inspectionPassed, setInspectionPassed] = useState({
    freshness: false,
    quantityVerified: false,
    sealIntact: false,
  });

  const allInspectionsChecked =
    inspectionPassed.freshness &&
    inspectionPassed.quantityVerified &&
    inspectionPassed.sealIntact;

  const isFunded = order.escrow_status === 'funded';
  const isInTransit = order.escrow_status === 'in_transit';
  const isDelivered = order.escrow_status === 'delivered';
  const isReleased = order.escrow_status === 'released';
  const isRefunded = order.escrow_status === 'refunded';

  const handleReleasePayout = async () => {
    try {
      setIsProcessing(true);
      setActionMessage('');
      const res = await commitAndReleasePayout(order.id);
      if (res.success) {
        setActionMessage(res.message);
      } else {
        setActionMessage(`Error: ${res.message}`);
      }
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;

    try {
      setIsProcessing(true);
      const res = await executeCompensatingRefund(order.id, disputeReason);
      if (res.success) {
        setShowDisputeModal(false);
        setActionMessage(res.message);
      }
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    await sendOrderMessage(order.id, chatInput);
    setChatInput('');
  };

  return (
    <div className="app-card rounded-3xl p-6 sm:p-8 space-y-6 border-slate-200 shadow-sm">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">{order.list_title}</h4>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isReleased
                ? 'bg-emerald-100 text-emerald-800'
                : isRefunded
                ? 'bg-rose-100 text-rose-800'
                : isDelivered
                ? 'bg-amber-100 text-amber-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {order.escrow_status.replace('_', ' ')}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Merchant: <span className="text-slate-900 font-bold">{order.store_name}</span> • MoMo Ref:{' '}
            <span className="text-amber-700 font-mono font-bold">{order.momo_transaction_id}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReceipt(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Receipt className="w-4 h-4 text-emerald-700" />
            <span>Digital Receipt</span>
          </button>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Locked Escrow</span>
            <span className="text-lg sm:text-xl font-extrabold text-emerald-800 font-mono">
              GH₵ {order.total_amount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
          {actionMessage}
        </div>
      )}

      {/* 2PC Stepper Timeline */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Order & Delivery Progress</span>
          <span className="text-[11px] font-normal text-slate-500">
            {isReleased ? 'Payout Completed' : isRefunded ? '100% Refunded' : 'Active Escrow Protection'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {/* Step 1: Locked */}
          <div className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 ${
            isFunded || isInTransit || isDelivered || isReleased
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
              : 'bg-white border-slate-200 text-slate-400'
          }`}>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span className="text-[11px]">1. MoMo Locked</span>
          </div>

          {/* Step 2: In Transit */}
          <div className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 ${
            isInTransit || isDelivered || isReleased
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
              : 'bg-white border-slate-200 text-slate-400'
          }`}>
            <Truck className="w-4 h-4 text-emerald-700" />
            <span className="text-[11px]">2. Dispatched</span>
          </div>

          {/* Step 3: Delivered */}
          <div className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 ${
            isDelivered || isReleased
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
              : 'bg-white border-slate-200 text-slate-400'
          }`}>
            <Package className="w-4 h-4 text-emerald-700" />
            <span className="text-[11px]">3. Arrived</span>
          </div>

          {/* Step 4: Released / Refunded */}
          <div className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 ${
            isReleased
              ? 'bg-emerald-600 text-white font-bold shadow-sm'
              : isRefunded
              ? 'bg-rose-600 text-white font-bold shadow-sm'
              : 'bg-white border-slate-200 text-slate-400'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[11px]">
              {isRefunded ? '4. Refunded' : '4. Completed'}
            </span>
          </div>
        </div>
      </div>

      {/* Shopper Inspection Checklist & Payout Release */}
      {!isReleased && !isRefunded && (
        <div className="p-5 sm:p-6 rounded-3xl bg-emerald-50/50 border border-emerald-200 space-y-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-700" />
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Delivery Inspection Checklist
              </h5>
              <p className="text-[11px] text-slate-600">
                Check items upon driver arrival before releasing Mobile Money payout to the store merchant.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:border-emerald-300">
              <input
                type="checkbox"
                checked={inspectionPassed.freshness}
                onChange={(e) => setInspectionPassed({ ...inspectionPassed, freshness: e.target.checked })}
                className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
              />
              <span className="text-slate-800 font-medium">Produce Fresh & Firm</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:border-emerald-300">
              <input
                type="checkbox"
                checked={inspectionPassed.quantityVerified}
                onChange={(e) => setInspectionPassed({ ...inspectionPassed, quantityVerified: e.target.checked })}
                className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
              />
              <span className="text-slate-800 font-medium">Quantities / Units Correct</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:border-emerald-300">
              <input
                type="checkbox"
                checked={inspectionPassed.sealIntact}
                onChange={(e) => setInspectionPassed({ ...inspectionPassed, sealIntact: e.target.checked })}
                className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
              />
              <span className="text-slate-800 font-medium">Packaging Sealed</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowDisputeModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Item Issue / Dispute</span>
            </button>

            <button
              type="button"
              disabled={isProcessing || !allInspectionsChecked}
              onClick={handleReleasePayout}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-900/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Releasing Payout...'
                  : `Confirm & Release Payout (GH₵ ${order.vendor_payout.toFixed(2)})`}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <MessageSquare className="w-4 h-4 text-emerald-700" />
          <span>Delivery Instructions & Driver Updates</span>
        </div>

        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
          {order.messages && order.messages.length > 0 ? (
            order.messages.map((m) => (
              <div key={m.id} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-bold text-emerald-800">{m.sender_name}</span>
                  <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-slate-800 mt-0.5 font-medium">{m.message}</div>
              </div>
            ))
          ) : (
            <div className="text-[11px] text-slate-400 italic">No messages yet. Send delivery directions to merchant.</div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Send message to driver (e.g. 'I am at Block B main gate')..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Request 100% Escrow Refund</h4>
                <p className="text-xs text-slate-500">Refunds 100% of funds back to your MoMo account</p>
              </div>
            </div>

            <form onSubmit={handleExecuteDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Reason for Dispute / Cancellation</label>
                <textarea
                  required
                  rows={3}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="e.g. Store merchant did not deliver the requested jasmine rice and tomatoes were spoiled."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-rose-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                Reversing this order will refund GH₵ {order.total_amount.toFixed(2)} to your {order.momo_provider} account ({order.momo_number}).
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Escrow Receipt */}
      {showReceipt && (
        <EscrowReceiptModal
          order={order}
          list={list}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};
