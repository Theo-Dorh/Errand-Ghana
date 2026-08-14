import React, { useState } from 'react';
import { Order, DemandList } from '../../types/index.ts';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { EscrowReceiptModal } from '../receipt/EscrowReceiptModal.tsx';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Receipt,
  RotateCcw,
  AlertCircle,
  Clock,
  Sparkles,
  MapPin,
} from 'lucide-react';

interface ShopperOrderTrackerProps {
  order: Order;
  list?: DemandList;
}

export const ShopperOrderTracker: React.FC<ShopperOrderTrackerProps> = ({ order, list }) => {
  const { commitAndReleasePayout, executeCompensatingRefund } = useMarketplace();

  const [showReceipt, setShowReceipt] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState('');

  // Goods inspection state
  const [inspectedItems, setInspectedItems] = useState(false);
  const [freshnessOk, setFreshnessOk] = useState(false);

  const isFunded = order.escrow_status === 'funded';
  const isInTransit = order.escrow_status === 'in_transit';
  const isDelivered = order.escrow_status === 'delivered';
  const isReleased = order.escrow_status === 'released';
  const isRefunded = order.escrow_status === 'refunded';

  const handleConfirmAndRelease = async () => {
    try {
      setIsProcessing(true);
      setStatusFeedback('');
      const res = await commitAndReleasePayout(order.id);
      setStatusFeedback(res.message);
    } catch (err: any) {
      setStatusFeedback(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTriggerRefund = async () => {
    if (!disputeReason.trim()) return;
    try {
      setIsProcessing(true);
      setStatusFeedback('');
      const res = await executeCompensatingRefund(order.id, disputeReason);
      setStatusFeedback(res.message);
      setShowDisputeModal(false);
    } catch (err: any) {
      setStatusFeedback(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="apex-card rounded-3xl p-6 sm:p-8 space-y-6 border-[#1A2F24]">
      {/* Top Banner */}
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
              {isFunded && 'Safe Pay Locked'}
              {isInTransit && 'Rider In Transit'}
              {isDelivered && 'Delivered • Ready for Inspection'}
              {isReleased && 'Completed & Store Paid'}
              {isRefunded && '100% Refunded to MoMo'}
            </span>
          </div>

          <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
            <span>Store: <strong className="text-white">{order.store_name}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#D4F938]">
              <MapPin className="w-3.5 h-3.5" />
              {order.neighborhood}
            </span>
            <span>•</span>
            <span>MoMo Ref: <strong className="font-mono text-slate-300">{order.momo_transaction_id}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowReceipt(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#16291E] border border-[#234330] hover:bg-[#1D3527] text-[#D4F938] text-xs font-bold transition-colors"
          >
            <Receipt className="w-4 h-4" />
            <span>Digital Receipt</span>
          </button>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Protected Amount</span>
            <span className="text-lg sm:text-xl font-black text-white font-mono">
              GH₵ {order.total_amount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {statusFeedback && (
        <div className="p-3.5 rounded-2xl bg-[#182C20] border border-[#234330] text-xs text-[#D4F938] flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* 4-Step Visual Delivery Progress */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#08120D] border border-[#16281E] space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>Order Fulfillment Progress</span>
          <span className="text-[#D4F938] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Estimated 30 - 45 mins</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Step 1: Locked */}
          <div className={`p-3 rounded-xl border space-y-1 ${
            isFunded || isInTransit || isDelivered || isReleased
              ? 'bg-[#182C20] border-[#234330] text-[#D4F938]'
              : 'bg-[#0E1A14] border-[#1A2F24] text-slate-500'
          }`}>
            <div className="text-[10px] font-mono font-bold uppercase">Step 1</div>
            <div className="text-xs font-extrabold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MoMo Locked</span>
            </div>
            <div className="text-[10px] text-slate-400">Funds secured in vault</div>
          </div>

          {/* Step 2: In Transit */}
          <div className={`p-3 rounded-xl border space-y-1 ${
            isInTransit || isDelivered || isReleased
              ? 'bg-[#182C20] border-[#234330] text-[#D4F938]'
              : 'bg-[#0E1A14] border-[#1A2F24] text-slate-500'
          }`}>
            <div className="text-[10px] font-mono font-bold uppercase">Step 2</div>
            <div className="text-xs font-extrabold flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Driver On Way</span>
            </div>
            <div className="text-[10px] text-slate-400">Packed from market</div>
          </div>

          {/* Step 3: Arrived */}
          <div className={`p-3 rounded-xl border space-y-1 ${
            isDelivered || isReleased
              ? 'bg-[#182C20] border-[#234330] text-[#D4F938]'
              : 'bg-[#0E1A14] border-[#1A2F24] text-slate-500'
          }`}>
            <div className="text-[10px] font-mono font-bold uppercase">Step 3</div>
            <div className="text-xs font-extrabold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>At Your Door</span>
            </div>
            <div className="text-[10px] text-slate-400">Inspect fresh items</div>
          </div>

          {/* Step 4: Released */}
          <div className={`p-3 rounded-xl border space-y-1 ${
            isReleased
              ? 'bg-[#182C20] border-[#234330] text-[#D4F938]'
              : 'bg-[#0E1A14] border-[#1A2F24] text-slate-500'
          }`}>
            <div className="text-[10px] font-mono font-bold uppercase">Step 4</div>
            <div className="text-xs font-extrabold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Store Paid</span>
            </div>
            <div className="text-[10px] text-slate-400">Payout settled</div>
          </div>
        </div>
      </div>

      {/* Physical Goods Inspection & Payout Actions */}
      {!isReleased && !isRefunded && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#08120D] border border-[#16281E] space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D4F938]" />
            <div>
              <h5 className="text-xs font-bold text-white">Doorstep Quality Inspection Checklist</h5>
              <p className="text-[11px] text-slate-400">Verify items before authorizing final payment to vendor</p>
            </div>
          </div>

          {/* Inspection Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0E1A14] border border-[#1A2F24] cursor-pointer hover:border-[#2D4C3A]">
              <input
                type="checkbox"
                checked={inspectedItems}
                onChange={(e) => setInspectedItems(e.target.checked)}
                className="w-4 h-4 rounded text-[#D4F938] focus:ring-[#D4F938] accent-[#D4F938]"
              />
              <span className="text-slate-300">All requested grocery items & quantities are present</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0E1A14] border border-[#1A2F24] cursor-pointer hover:border-[#2D4C3A]">
              <input
                type="checkbox"
                checked={freshnessOk}
                onChange={(e) => setFreshnessOk(e.target.checked)}
                className="w-4 h-4 rounded text-[#D4F938] focus:ring-[#D4F938] accent-[#D4F938]"
              />
              <span className="text-slate-300">Produce freshness, ripeness & packaging are in good order</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setShowDisputeModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Report Issue / Request 100% Refund</span>
            </button>

            <button
              onClick={handleConfirmAndRelease}
              disabled={(!inspectedItems || !freshnessOk) && !isDelivered}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl btn-apex text-xs font-black shadow-lg shadow-[#D4F938]/15 disabled:opacity-40 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isProcessing ? 'Releasing Payout...' : `Confirm Delivery & Release GH₵ ${order.vendor_payout.toFixed(2)}`}</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal: Receipt */}
      {showReceipt && (
        <EscrowReceiptModal
          order={order}
          list={list}
          onClose={() => setShowReceipt(false)}
        />
      )}

      {/* Modal: Dispute & Refund */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#0E1A14] border border-[#1A2F24] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-950/60 text-rose-400 border border-rose-800/60 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Report Delivery Issue</h4>
                <p className="text-xs text-slate-400">Request a full 100% refund back to your MoMo</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">Reason for refund request</label>
              <textarea
                rows={3}
                required
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="e.g. Tomatoes were squashed / Rotten items / Store never arrived..."
                className="w-full p-3 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1A2F24]">
              <button
                type="button"
                onClick={() => setShowDisputeModal(false)}
                className="px-4 py-2 rounded-xl bg-[#08120D] text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTriggerRefund}
                disabled={isProcessing || !disputeReason.trim()}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50"
              >
                {isProcessing ? 'Processing Refund...' : 'Submit 100% Refund Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
