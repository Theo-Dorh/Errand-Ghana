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
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-slate-800 font-semibold">{itemName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-500">
            Supermarket: <span className="line-through text-slate-400 font-mono">GH₵ {accraRetailBenchmark.toFixed(2)}</span>
          </span>
          <span className="font-bold text-emerald-800 font-mono">
            GH₵ {storeOfferValue.toFixed(2)}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
            -{supermarketVariancePercent}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-4"
      data-testid="ml-benchmark-container"
    >
      {/* Header with Confidence */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>Supermarket Price Benchmark</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                1.18x Accra Retail Markup
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Live linear regression comparison across Accra & Kumasi wholesale open-air hubs
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span data-testid="ml-confidence-score">{mlConfidenceScore}% ML Confidence</span>
          </div>
          <span className="text-[10px] text-slate-500">
            Volatility: <span className="font-bold text-slate-700">{volatilityIndex}</span>
          </span>
        </div>
      </div>

      {/* Comparative Visualizer Bars */}
      <div className="space-y-3">
        {/* 1. Supermarket Benchmark (1.18x) */}
        <div>
          <div className="flex justify-between text-xs mb-1 text-slate-600">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
              Accra Supermarket Retail Benchmark (Shoprite/Melcom)
            </span>
            <span className="font-mono font-bold text-slate-700">GH₵ {accraRetailBenchmark.toFixed(2)}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-slate-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${retailWidthPercent}%` }}
              data-testid="retail-benchmark-bar"
            />
          </div>
        </div>

        {/* 2. Shopper Target Budget */}
        <div>
          <div className="flex justify-between text-xs mb-1 text-slate-600">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              Shopper Target Budget
            </span>
            <span className="font-mono font-bold text-amber-700">GH₵ {shopperBudgetValue.toFixed(2)}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${shopperWidthPercent}%` }}
              data-testid="shopper-budget-bar"
            />
          </div>
        </div>

        {/* 3. Store Merchant Bid */}
        <div>
          <div className="flex justify-between text-xs mb-1 text-slate-600">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              Store Merchant Reverse-Auction Bid
            </span>
            <span className="font-mono font-bold text-emerald-800">GH₵ {storeOfferValue.toFixed(2)}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${storeWidthPercent}%` }}
              data-testid="store-offer-bar"
            />
          </div>
        </div>
      </div>

      {/* Savings Callout */}
      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-emerald-900">
              Estimated Consumer Savings: <span>GH₵ {consumerSavingsGHS.toFixed(2)}</span>
            </span>{' '}
            <span className="text-slate-600">({supermarketVariancePercent}% below retail)</span>
            {recommendation && (
              <div className="text-[11px] text-slate-500 mt-0.5">{recommendation}</div>
            )}
          </div>
        </div>

        {volatilityIndex === 'High' && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span>High Perishable Fluctuation</span>
          </div>
        )}
      </div>
    </div>
  );
};
