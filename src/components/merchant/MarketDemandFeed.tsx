import React, { useState } from 'react';
import { DemandList } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { SubmitOfferModal } from './SubmitOfferModal.tsx';
import {
  Store,
  MapPin,
  Send,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';

const HUBS = [
  { id: 'all', name: 'All Neighborhoods' },
  { id: 'East Legon, Accra', name: 'East Legon' },
  { id: 'Madina, Accra', name: 'Madina Market' },
  { id: 'Makola, Accra', name: 'Makola Market' },
  { id: 'Kaneshie, Accra', name: 'Kaneshie Market' },
  { id: 'Kejetia, Kumasi', name: 'Kejetia (Kumasi)' },
];

export const MarketDemandFeed: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { demandLists, submitStoreOffer } = useMarketplace();

  const [selectedHub, setSelectedHub] = useState('all');
  const [selectedListForOffer, setSelectedListForOffer] = useState<DemandList | null>(null);

  // Filter demands open for store bidding (open, bidded)
  const openDemands = demandLists.filter(
    (d) => d.status === 'open' || d.status === 'bidded'
  );

  const filteredDemands = openDemands.filter((d) => {
    if (selectedHub === 'all') return true;
    return d.neighborhood.toLowerCase().includes(selectedHub.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 space-y-4 border transition-all ${
        theme === 'dark'
          ? 'apex-card bg-gradient-to-br from-[#0E1A14] via-[#0E1A14] to-[#14261D] border-[#1A2F24]'
          : 'bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/40 border-emerald-100/90 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold ${
              theme === 'dark'
                ? 'bg-[#16291E] border-[#234330] text-[#D4F938]'
                : 'bg-emerald-100/70 border-emerald-200 text-emerald-800'
            }`}>
              <Store className="w-3.5 h-3.5" />
              <span>Merchant Market Board</span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-extrabold mt-1 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Live Customer Grocery Requests
            </h2>
            <p className={`text-xs mt-1 max-w-xl ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Browse grocery shopping lists posted by nearby customers in Accra & Kumasi. Submit your best price offers to win orders with guaranteed Mobile Money payment protection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`p-3.5 rounded-2xl border text-right ${
              theme === 'dark'
                ? 'bg-[#08120D] border-[#16281E]'
                : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <span className="text-[10px] text-slate-400 block font-semibold">Open requests</span>
              <span className={`text-lg font-black font-mono ${
                theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-800'
              }`}>
                {openDemands.length} Live Lists
              </span>
            </div>
          </div>
        </div>

        {/* Neighborhood Hub Filter Bar */}
        <div className={`flex items-center gap-2 overflow-x-auto pt-2 pb-1 border-t scrollbar-none ${
          theme === 'dark' ? 'border-[#1A2F24]' : 'border-slate-200/80'
        }`}>
          {HUBS.map((hub) => (
            <button
              key={hub.id}
              onClick={() => setSelectedHub(hub.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                selectedHub === hub.id
                  ? theme === 'dark'
                    ? 'bg-[#182C20] text-[#D4F938] border-[#234330] shadow-sm'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-sm'
                  : theme === 'dark'
                  ? 'bg-[#08120D] border-[#16281E] text-slate-400 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {hub.name}
            </button>
          ))}
        </div>
      </div>

      {/* Demands List */}
      {filteredDemands.length === 0 ? (
        <div className="apex-card rounded-3xl p-12 text-center space-y-2">
          <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
          <div className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            No open grocery requests matching this hub
          </div>
          <div className="text-xs text-slate-400">
            Check back shortly or select "All Neighborhoods" to view requests across Ghana.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredDemands.map((list) => {
            const hasMyOffer = list.offers?.some((o) => o.store_id === currentUser.id);

            return (
              <div
                key={list.id}
                className="apex-card rounded-3xl p-6 sm:p-8 space-y-5 apex-card-hover"
              >
                {/* Header */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
                  theme === 'dark' ? 'border-[#1A2F24]' : 'border-slate-200/80'
                }`}>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className={`text-base sm:text-lg font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {list.title}
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        theme === 'dark'
                          ? 'bg-[#182C20] text-[#D4F938] border-[#234330]'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {list.urgency}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                      <span>Customer: <strong className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>
                        {list.shopper_name || 'Verified Shopper'}
                      </strong></span>
                      <span>•</span>
                      <span className={`flex items-center gap-1 font-semibold ${
                        theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'
                      }`}>
                        <MapPin className="w-3.5 h-3.5" />
                        {list.neighborhood}
                      </span>
                      <span>•</span>
                      <span>Delivery: {list.delivery_address}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-400 font-medium block">Customer target budget</span>
                    <span className={`text-xl sm:text-2xl font-black font-mono ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      GH₵ {list.total_target_budget.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items Manifest */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 block">
                    Requested grocery items ({list.items?.length || 0})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {list.items?.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                          theme === 'dark'
                            ? 'bg-[#08120D] border-[#16281E]'
                            : 'bg-slate-50 border-slate-200/80'
                        }`}
                      >
                        <span className={`font-semibold truncate pr-2 ${
                          theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                        }`}>{item.name}</span>
                        <span className="text-slate-400 font-mono text-[11px] shrink-0">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Notes */}
                {list.notes && (
                  <div className={`p-3.5 rounded-2xl border text-xs ${
                    theme === 'dark'
                      ? 'bg-[#08120D] border-[#16281E] text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Customer Note:</strong> {list.notes}
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'}`} />
                    <span>
                      {list.offers?.length || 0} other store bids submitted for this list
                    </span>
                  </div>

                  {hasMyOffer ? (
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold ${
                      theme === 'dark'
                        ? 'bg-[#182C20] text-[#D4F938] border-[#234330]'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Your Store Bid is Submitted</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedListForOffer(list)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-apex text-xs font-black shadow-lg transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Store Bid</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Submit Offer */}
      {selectedListForOffer && (
        <SubmitOfferModal
          list={selectedListForOffer}
          onClose={() => setSelectedListForOffer(null)}
          onSubmitOffer={submitStoreOffer}
        />
      )}
    </div>
  );
};
