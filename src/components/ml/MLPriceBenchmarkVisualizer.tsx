import React from 'react';
import { TrendingDown, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { MLPriceBenchmarkResult } from '../../types/index.ts';

interface MLPriceBenchmarkVisualizerProps {
  benchmark: MLPriceBenchmarkResult;
  compact?: boolean;
}

export const MLPriceBenchmarkVisualizer: React.FC<MLPriceBenchmarkVisualizerProps> = ({
  benchmark,
  compact = false,
}) => {
  const {
    itemName,
    shopperBudgetValue,
    storeOfferValue,
    accraRetailBenchmark,
    supermarketVariancePercent,
    consumerSavingsGHS,
    mlConfidenceScore,
    volatilityIndex,
    recommendation,
  } = benchmark;

  const maxValue = Math.max(accraRetailBenchmark, shopperBudgetValue, storeOfferValue) * 1.15;

  const shopperWidthPercent = Math.min(100, Math.max(10, (shopperBudgetValue / maxValue) * 100));
  const storeWidthPercent = Math.min(100, Math.max(10, (storeOfferValue / maxValue) * 100));
  const retailWidthPercent = Math.min(100, Math.max(10, (accraRetailBenchmark / maxValue) * 100));

  if (compact) {
    return (
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-300 font-medium">{itemName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            Supermarket: <span className="line-through text-slate-500">GH₵ {accraRetailBenchmark.toFixed(2)}</span>
          </span>
          <span className="font-bold text-emerald-400">
            GH₵ {storeOfferValue.toFixed(2)}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold text-[10px] border border-emerald-500/30">
            -{supermarketVariancePercent}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 shadow-xl"
      data-testid="ml-benchmark-container"
    >
      {/* Header with ML Badge and Confidence */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>ML Market Price Benchmark</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                1.18x Accra Supermarket Baseline
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Live linear regression comparison across Accra & Kumasi wholesale open-air hubs
            </p>
          </div>
        </div>

        {/* Confidence Indicator */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span data-testid="ml-confidence-score">{mlConfidenceScore}% ML Confidence</span>
          </div>
          <span className="text-[10px] text-slate-400">
            Volatility: <span className={`font-semibold ${volatilityIndex === 'High' ? 'text-rose-400' : volatilityIndex === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'}`}>{volatilityIndex}</span>
          </span>
        </div>
      </div>

      {/* Comparative Bar Visualizer */}
      <div className="space-y-4">
        {/* 1. Supermarket Benchmark (1.18x) */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
              Accra Supermarket Retail Benchmark (Shoprite/Melcom)
            </span>
            <span className="font-mono font-semibold text-slate-300">GH₵ {accraRetailBenchmark.toFixed(2)}</span>
          </div>
          <div className="w-full bg-slate-800/60 rounded-full h-3.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-slate-600 to-slate-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${retailWidthPercent}%` }}
              data-testid="retail-benchmark-bar"
            />
          </div>
        </div>

        {/* 2. Shopper Target Budget */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              Shopper Target Budget
            </span>
            <span className="font-mono font-bold text-amber-400">GH₵ {shopperBudgetValue.toFixed(2)}</span>
          </div>
          <div className="w-full bg-slate-800/60 rounded-full h-3.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${shopperWidthPercent}%` }}
              data-testid="shopper-budget-bar"
            />
          </div>
        </div>

        {/* 3. Store Merchant Bid */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              Store Merchant Reverse-Auction Bid
            </span>
            <span className="font-mono font-bold text-emerald-400">GH₵ {storeOfferValue.toFixed(2)}</span>
          </div>
          <div className="w-full bg-slate-800/60 rounded-full h-3.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${storeWidthPercent}%` }}
              data-testid="store-offer-bar"
            />
          </div>
        </div>
      </div>

      {/* Savings Callout & Recommendation */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-300">
              Estimated Consumer Savings: <span className="font-bold text-white">GH₵ {consumerSavingsGHS.toFixed(2)}</span> ({supermarketVariancePercent}% below retail)
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {recommendation}
            </div>
          </div>
        </div>

        {volatilityIndex === 'High' && (
          <div className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span>High Perishable Fluctuation</span>
          </div>
        )}
      </div>
    </div>
  );
};
