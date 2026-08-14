import React, { useState } from 'react';
import { DemandList } from '../../types/index.ts';
import { useTheme } from '../../context/ThemeContext.tsx';
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
  const { theme } = useTheme();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className={`relative w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden my-8 transition-colors ${
        theme === 'dark' ? 'bg-[#0E1A14] border-[#1A2F24]' : 'bg-white border-slate-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-[#1A2F24] bg-[#08120D]/60' : 'border-slate-100 bg-slate-50/70'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-[#16291E] text-[#D4F938] border-[#234330]'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Submit Store Price Offer
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Offer your wholesale price for "{list.title}"
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              theme === 'dark'
                ? 'text-slate-400 hover:text-white hover:bg-[#16291E]'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2 ${
              theme === 'dark'
                ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Customer Manifest Summary */}
          <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
            theme === 'dark' ? 'bg-[#08120D] border-[#16281E]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>Customer Items</span>
              <span className="text-slate-400">{list.neighborhood} ({list.urgency})</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {list.items?.map((item) => (
                <div key={item.id} className={`p-2 rounded-xl border ${
                  theme === 'dark' ? 'bg-[#0E1A14] border-[#1A2F24]' : 'bg-white border-slate-200/80 shadow-xs'
                }`}>
                  <div className={`font-medium truncate ${
                    theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                  }`}>{item.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{item.quantity} {item.unit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bid Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>Grocery Total (GH₵) *</label>
              <input
                type="number"
                step="1"
                min="1"
                required
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(parseFloat(e.target.value) || 0)}
                className={`w-full px-3.5 py-2.5 rounded-xl border font-mono font-bold text-sm focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-[#08120D] border-[#16281E] text-white focus:border-[#D4F938]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600 focus:bg-white'
                }`}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Target Budget: GH₵ {list.total_target_budget.toFixed(2)}
              </span>
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 flex items-center gap-1 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <Truck className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'}`} />
                <span>Delivery Fee (GH₵)</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                required
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-sm focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-[#08120D] border-[#16281E] text-white focus:border-[#D4F938]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600 focus:bg-white'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 flex items-center gap-1 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Delivery Time (Hours)</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={fulfillmentHours}
                onChange={(e) => setFulfillmentHours(parseFloat(e.target.value) || 1)}
                className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-sm focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-[#08120D] border-[#16281E] text-white focus:border-[#D4F938]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600 focus:bg-white'
                }`}
              />
            </div>
          </div>

          {/* Store Notes */}
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>Store Quality Guarantee & Produce Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Freshly sourced from morning crate arrival at Makola. Packaged safely."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                theme === 'dark'
                  ? 'bg-[#08120D] border-[#16281E] text-white placeholder-slate-500 focus:border-[#D4F938]'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:bg-white'
              }`}
            />
          </div>

          {/* Benchmark comparison preview */}
          <MLPriceBenchmarkVisualizer benchmark={benchmarkData} compact={false} />

          {/* Modal Actions */}
          <div className={`flex items-center justify-end gap-3 pt-2 border-t ${
            theme === 'dark' ? 'border-[#1A2F24]' : 'border-slate-100'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                theme === 'dark'
                  ? 'bg-[#08120D] border-[#16281E] text-slate-300 hover:bg-[#12221A]'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-apex text-xs font-black shadow-lg disabled:opacity-50"
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
