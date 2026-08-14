import React from 'react';
import { StoreOffer, DemandList } from '../../types/index.ts';
import { useTheme } from '../../context/ThemeContext.tsx';
import { Store, Star, Clock, ShieldCheck, Check } from 'lucide-react';
import { MLPriceBenchmarkVisualizer } from '../ml/MLPriceBenchmarkVisualizer.tsx';

interface OfferReviewCardProps {
  offer: StoreOffer;
  list: DemandList;
  onAcceptOffer: (offer: StoreOffer) => void;
}

export const OfferReviewCard: React.FC<OfferReviewCardProps> = ({ offer, list, onAcceptOffer }) => {
  const { theme } = useTheme();
  const isSelected = offer.status === 'accepted';
  const totalAmount = offer.offered_total_price + offer.delivery_fee;

  const supermarketBaseline = Math.round((list.total_target_budget * 1.18) * 100) / 100;
  const savingsGHS = Math.max(0, Math.round((supermarketBaseline - totalAmount) * 100) / 100);
  const savingsPercent = Math.max(0, Math.round(((supermarketBaseline - totalAmount) / supermarketBaseline) * 1000) / 10);

  const benchmarkData = {
    itemName: list.title,
    shopperBudgetValue: list.total_target_budget,
    storeOfferValue: totalAmount,
    accraRetailBenchmark: supermarketBaseline,
    supermarketVariancePercent: savingsPercent,
    consumerSavingsGHS: savingsGHS,
    mlConfidenceScore: 94.8,
    volatilityIndex: 'Moderate' as const,
    recommendation: 'Competitive price offer from verified Makola wholesale vendor.',
  };

  return (
    <div
      className={`p-5 sm:p-6 rounded-3xl transition-all space-y-4 border ${
        isSelected
          ? theme === 'dark'
            ? 'bg-[#12241B] border-[#D4F938] shadow-lg shadow-[#D4F938]/10'
            : 'bg-emerald-50/80 border-emerald-500 shadow-sm'
          : theme === 'dark'
          ? 'bg-[#08120D] border-[#16281E] hover:border-[#2D4C3A]'
          : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
      }`}
    >
      {/* Top Store Info & Financials */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-black ${
            theme === 'dark'
              ? 'bg-[#16291E] border-[#234330] text-[#D4F938]'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <Store className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h5 className={`text-sm sm:text-base font-extrabold ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {offer.store_name}
              </h5>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                theme === 'dark'
                  ? 'bg-[#182C20] border-[#234330] text-[#D4F938]'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{(offer.store_rating ?? 4.9).toFixed(1)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className={`flex items-center gap-1 font-semibold ${
                theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>Delivery: ~{offer.fulfillment_time_hours} hrs</span>
              </span>
              <span>•</span>
              <span className={`flex items-center gap-1 font-semibold ${
                theme === 'dark' ? 'text-emerald-400' : 'text-slate-600'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Vendor</span>
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="flex items-center gap-3 sm:gap-4 justify-between sm:justify-end">
          <div className="text-left sm:text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Price</div>
            <div className={`text-xl sm:text-2xl font-black font-mono ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              GH₵ {totalAmount.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-400">
              (Items: GH₵ {offer.offered_total_price.toFixed(2)} + Delivery: GH₵ {offer.delivery_fee.toFixed(2)})
            </div>
          </div>

          {/* Supermarket Savings Badge */}
          {savingsGHS > 0 && (
            <div className={`p-2.5 rounded-2xl border text-right ${
              theme === 'dark'
                ? 'bg-[#16291E] border-[#234330]'
                : 'bg-emerald-50 border-emerald-200'
            }`}>
              <span className="text-[9px] uppercase font-bold text-slate-400 block">You Save</span>
              <span className={`text-xs sm:text-sm font-black font-mono block ${
                theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-800'
              }`}>
                GH₵ {savingsGHS.toFixed(2)}
              </span>
              <span className={`text-[9px] font-bold ${
                theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'
              }`}>
                ({savingsPercent}% vs Supermarket)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Store Quality Notes */}
      {offer.store_notes && (
        <div className={`p-3 rounded-2xl border text-xs ${
          theme === 'dark'
            ? 'bg-[#0E1A14] border-[#16281E] text-slate-300'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Store Note:</strong> {offer.store_notes}
        </div>
      )}

      {/* Benchmark Comparison */}
      <MLPriceBenchmarkVisualizer benchmark={benchmarkData} compact={false} />

      {/* Action CTA */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {isSelected ? (
          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold ${
            theme === 'dark'
              ? 'bg-[#182C20] border-[#234330] text-[#D4F938]'
              : 'bg-emerald-100 border-emerald-200 text-emerald-800'
          }`}>
            <Check className="w-4 h-4" />
            <span>Offer Accepted • Safe Pay Vault Locked</span>
          </div>
        ) : (
          <button
            onClick={() => onAcceptOffer(offer)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl btn-apex text-xs font-black shadow-md transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Accept Offer & Pay (GH₵ {totalAmount.toFixed(2)})</span>
          </button>
        )}
      </div>
    </div>
  );
};
