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

  // Inspection Checklist Items state
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
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-slate-100">{order.list_title}</h4>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              isReleased
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                : isRefunded
                ? 'bg-rose-950 text-rose-300 border-rose-500/30'
                : isDelivered
                ? 'bg-amber-950 text-amber-300 border-amber-500/30'
                : 'bg-blue-950 text-blue-300 border-blue-500/30'
            }`}>
              {order.escrow_status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Merchant: <span className="text-slate-200 font-semibold">{order.store_name}</span> • MoMo Ref:{' '}
            <span className="text-amber-400 font-mono font-bold">{order.momo_transaction_id}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReceipt(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Audit Receipt</span>
          </button>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Locked Escrow</span>
            <span className="text-lg font-extrabold text-amber-400 font-mono">
              GH₵ {order.total_amount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-200">
          {actionMessage}
        </div>
      )}

      {/* 2PC Distributed Saga Timeline Visualizer */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>2PC Distributed Saga Timeline</span>
          <span className="text-[11px] text-slate-400">
            {isReleased ? 'Payout Released (Commit Done)' : isRefunded ? 'Compensating Refund Executed' : 'Escrow Active'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {/* Step 1: Locked */}
          <div className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${
            isFunded || isInTransit || isDelivered || isReleased
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}>
            <ShieldCheck className="w-4 h-4" />
            <span className="font-bold text-[11px]">1. MoMo Locked</span>
          </div>

          {/* Step 2: In Transit */}
          <div className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${
            isInTransit || isDelivered || isReleased
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}>
            <Truck className="w-4 h-4" />
            <span className="font-bold text-[11px]">2. Dispatched</span>
          </div>

          {/* Step 3: Delivered */}
          <div className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${
            isDelivered || isReleased
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}>
            <Package className="w-4 h-4" />
            <span className="font-bold text-[11px]">3. Arrived</span>
          </div>

          {/* Step 4: Released / Refunded */}
          <div className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${
            isReleased
              ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-900/30'
              : isRefunded
              ? 'bg-rose-950/80 border-rose-400 text-rose-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold text-[11px]">
              {isRefunded ? '4. Refunded' : '4. 2PC Commit'}
            </span>
          </div>
        </div>
      </div>

      {/* Shopper Inspection Checklist & Release Console */}
      {!isReleased && !isRefunded && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                Physical Goods Inspection Checklist
              </h5>
              <p className="text-[11px] text-slate-400">
                Inspect your groceries upon driver arrival before triggering Phase 2 MoMo release.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={inspectionPassed.freshness}
                onChange={(e) => setInspectionPassed({ ...inspectionPassed, freshness: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <span className="text-slate-300">Produce Fresh & Undamaged</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={inspectionPassed.quantityVerified}
                onChange={(e) => setInspectionPassed({ ...inspectionPassed, quantityVerified: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <span className="text-slate-300">Olonka / Kg Quantities Correct</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={inspectionPassed.sealIntact}
                onChange={(e) => setInspectionPassed({ ...inspectionPassed, sealIntact: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <span className="text-slate-300">Packaging Seal Intact</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowDisputeModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Item Issue / Open Dispute</span>
            </button>

            <button
              type="button"
              disabled={isProcessing || !allInspectionsChecked}
              onClick={handleReleasePayout}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Committing Payout...'
                  : `Confirm & Release MoMo Payout (GH₵ ${order.vendor_payout.toFixed(2)})`}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Shopper & Merchant Live Chat Box */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>Real-Time Delivery Coordination</span>
        </div>

        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
          {order.messages && order.messages.length > 0 ? (
            order.messages.map((m) => (
              <div key={m.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-semibold text-emerald-400">{m.sender_name}</span>
                  <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-slate-200 mt-0.5">{m.message}</div>
              </div>
            ))
          ) : (
            <div className="text-[11px] text-slate-500 italic">No coordination messages yet. Send directions to merchant driver.</div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type message to merchant (e.g. 'I am at Block B entrance')..."
            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Modal: Dispute Arbitration */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-100">Initiate Saga Compensating Refund</h4>
                <p className="text-xs text-slate-400">Compensating transaction returns 100% funds to your MoMo</p>
              </div>
            </div>

            <form onSubmit={handleExecuteDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reason for Dispute</label>
                <textarea
                  required
                  rows={3}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="e.g. Merchant delivered damaged tomatoes and failed to provide 5kg jasmine rice."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-[11px] text-rose-300">
                Executing rollback will reverse GH₵ {order.total_amount.toFixed(2)} back to your {order.momo_provider} wallet ({order.momo_number}).
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
                >
                  {isProcessing ? 'Processing Refund...' : 'Trigger Compensating Refund'}
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
