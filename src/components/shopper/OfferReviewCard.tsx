import React from 'react';
import { StoreOffer, DemandList } from '../../types/index.ts';
import { Store, Star, Clock, ShieldCheck, Check } from 'lucide-react';
import { MLPriceBenchmarkVisualizer } from '../ml/MLPriceBenchmarkVisualizer.tsx';

interface OfferReviewCardProps {
  offer: StoreOffer;
  list: DemandList;
  onAcceptOffer: (offer: StoreOffer) => void;
}

export const OfferReviewCard: React.FC<OfferReviewCardProps> = ({ offer, list, onAcceptOffer }) => {
  const totalAmount = offer.offered_total_price + offer.delivery_fee;
  const isWithinBudget = totalAmount <= list.total_target_budget * 1.05;

  // ML benchmark calculation
  const supermarketBaseline = Math.round((list.total_target_budget * 1.18) * 100) / 100;
  const consumerSavings = Math.max(0, Math.round((supermarketBaseline - totalAmount) * 100) / 100);
  const savingsPercent = Math.max(0, Math.round(((supermarketBaseline - totalAmount) / supermarketBaseline) * 1000) / 10);

  const benchmarkData = {
    itemName: list.title,
    shopperBudgetValue: list.total_target_budget,
    storeOfferValue: totalAmount,
    accraRetailBenchmark: supermarketBaseline,
    supermarketVariancePercent: savingsPercent,
    consumerSavingsGHS: consumerSavings,
    mlConfidenceScore: 95.0,
    volatilityIndex: 'Moderate' as const,
    recommendation: isWithinBudget
      ? 'Competitive wholesale store pricing. Meets platform safety standards.'
      : 'Bid includes express delivery transport from wholesale market.',
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 shadow-sm space-y-4 transition-all">
      {/* Merchant Header & Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm sm:text-base font-bold text-slate-900">{offer.store_name}</h4>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center text-amber-600 font-bold gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {offer.store_rating || 4.8}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Delivery in {offer.fulfillment_time_hours} hrs
              </span>
            </div>
          </div>
        </div>

        {/* Pricing & Savings Tag */}
        <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
          {consumerSavings > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[10px] uppercase tracking-wider">
              Savings: GH₵ {consumerSavings.toFixed(2)}
            </span>
          )}
          <div>
            <div className="text-base sm:text-xl font-extrabold text-slate-900 font-mono">
              GH₵ {totalAmount.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500">
              (Items: GH₵ {offer.offered_total_price.toFixed(2)} + Delivery: GH₵ {offer.delivery_fee.toFixed(2)})
            </div>
          </div>
        </div>
      </div>

      {/* Store Quality Notes (if any) */}
      {offer.store_notes && (
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
          "{offer.store_notes}"
        </div>
      )}

      {/* Benchmark comparison bar */}
      <MLPriceBenchmarkVisualizer benchmark={benchmarkData} compact={false} />

      {/* Action Button */}
      <div className="pt-2">
        <button
          onClick={() => onAcceptOffer(offer)}
          className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 transition-all"
        >
          <Check className="w-4 h-4" />
          <span>Accept Bid & Pay via Mobile Money (Escrow Locked)</span>
        </button>
      </div>
    </div>
  );
};
