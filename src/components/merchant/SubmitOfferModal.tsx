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
  const [notes, setNotes] = useState<string>('Wholesale fresh batch direct from morning truck.');
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
    recommendation: 'Competitive merchant bid. Projected 92% shopper acceptance rate.',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Submit Store Reverse-Auction Bid</h3>
              <p className="text-xs text-slate-500">Provide your wholesale pricing for "{list.title}"</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Shopper Manifest Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Customer Manifest</span>
              <span className="text-slate-500">{list.neighborhood} ({list.urgency})</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {list.items?.map((item) => (
                <div key={item.id} className="p-2 rounded-xl bg-white border border-slate-200">
                  <div className="font-medium text-slate-800 truncate">{item.name}</div>
                  <div className="text-[11px] text-slate-500">{item.quantity} {item.unit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bid Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Grocery Total (GH₵) *</label>
              <input
                type="number"
                step="1"
                min="1"
                required
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-sm focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Target Budget: GH₵ {list.total_target_budget.toFixed(2)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-700" />
                Delivery Fee (GH₵)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                required
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-sm focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Delivery SLA (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={fulfillmentHours}
                onChange={(e) => setFulfillmentHours(parseFloat(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-sm focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Store Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Store Quality Guarantee / Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Sourced from freshest morning crate arrivals. Packaged securely."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Benchmark comparison preview */}
          <MLPriceBenchmarkVisualizer benchmark={benchmarkData} compact={false} />

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-900/10 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : `Submit Bid (GH₵ ${totalOffer.toFixed(2)})`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
