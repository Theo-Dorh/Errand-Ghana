import React, { useState } from 'react';
import { DemandList } from '../../types/index.ts';
import { Store, Clock, Truck, X, Check, AlertCircle } from 'lucide-react';
import { MLPriceBenchmarkVisualizer } from '../ml/MLPriceBenchmarkVisualizer.tsx';

interface SubmitOfferModalProps {
  list: DemandList;
  onClose: () => void;
  onSubmitOffer: (
    listId: string,
    offeredPrice: number,
    deliveryFee: number,
    fulfillmentHours: number,
    notes?: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export const SubmitOfferModal: React.FC<SubmitOfferModalProps> = ({ list, onClose, onSubmitOffer }) => {
  const [offeredPrice, setOfferedPrice] = useState<number>(list.total_target_budget * 0.98);
  const [deliveryFee, setDeliveryFee] = useState<number>(15.0);
  const [fulfillmentHours, setFulfillmentHours] = useState<number>(2.0);
  const [notes, setNotes] = useState<string>('Wholesale fresh batch direct from morning market truck.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const totalOffer = offeredPrice + deliveryFee;
  const supermarketBaseline = Math.round((list.total_target_budget * 1.18) * 100) / 100;
  const savingsPercent = Math.max(0, Math.round(((supermarketBaseline - totalOffer) / supermarketBaseline) * 1000) / 10);
  const consumerSavings = Math.max(0, Math.round((supermarketBaseline - totalOffer) * 100) / 100);

  const benchmarkData = {
    itemName: list.title,
    shopperBudgetValue: list.total_target_budget,
    storeOfferValue: totalOffer,
    accraRetailBenchmark: supermarketBaseline,
    supermarketVariancePercent: savingsPercent,
    consumerSavingsGHS: consumerSavings,
    mlConfidenceScore: 95.2,
    volatilityIndex: 'Moderate' as const,
    recommendation: 'Competitive merchant price offer. High probability of customer selection.',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (offeredPrice <= 0) {
      setErrorMsg('Please specify a valid offered price');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      const res = await onSubmitOffer(list.id, offeredPrice, deliveryFee, fulfillmentHours, notes);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || 'Failed to submit offer');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0E1A14] border border-[#1A2F24] rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1A2F24] bg-[#08120D]/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#16291E] text-[#D4F938] border border-[#234330] flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Submit Store Price Offer</h3>
              <p className="text-xs text-slate-400">Offer your wholesale price for "{list.title}"</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#16291E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Customer Manifest Summary */}
          <div className="p-4 rounded-2xl bg-[#08120D] border border-[#16281E] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider">Customer Items</span>
              <span className="text-slate-400">{list.neighborhood} ({list.urgency})</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {list.items?.map((item) => (
                <div key={item.id} className="p-2 rounded-xl bg-[#0E1A14] border border-[#1A2F24]">
                  <div className="font-medium text-slate-200 truncate">{item.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{item.quantity} {item.unit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bid Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Grocery Total (GH₵) *</label>
              <input
                type="number"
                step="1"
                min="1"
                required
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-white font-mono font-bold text-sm focus:border-[#D4F938] focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Target Budget: GH₵ {list.total_target_budget.toFixed(2)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#D4F938]" />
                <span>Delivery Fee (GH₵)</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                required
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-white font-mono text-sm focus:border-[#D4F938] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Delivery Time (Hours)</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={fulfillmentHours}
                onChange={(e) => setFulfillmentHours(parseFloat(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-white font-mono text-sm focus:border-[#D4F938] focus:outline-none"
              />
            </div>
          </div>

          {/* Store Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Store Quality Guarantee & Produce Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Freshly sourced from morning crate arrival at Makola. Packaged safely."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#08120D] border border-[#16281E] text-xs text-white placeholder-slate-500 focus:border-[#D4F938] focus:outline-none"
            />
          </div>

          {/* Benchmark comparison preview */}
          <MLPriceBenchmarkVisualizer benchmark={benchmarkData} compact={false} />

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1A2F24]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#08120D] text-slate-300 text-xs font-bold hover:bg-[#12221A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-apex text-xs font-black shadow-lg shadow-[#D4F938]/15 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : `Submit Offer (GH₵ ${totalOffer.toFixed(2)})`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
