import React, { useState } from 'react';
import { DemandList } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
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
      <div className="apex-card rounded-3xl p-6 sm:p-8 space-y-4 border-[#1A2F24] bg-gradient-to-br from-[#0E1A14] via-[#0E1A14] to-[#14261D]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16291E] border border-[#234330] text-[11px] font-bold text-[#D4F938]">
              <Store className="w-3.5 h-3.5" />
              <span>Merchant Market Board</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Live Customer Grocery Requests
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Browse grocery shopping lists posted by nearby customers in Accra & Kumasi. Submit your best price offers to win orders with guaranteed Mobile Money payment protection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-[#08120D] border border-[#16281E] text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Open Requests</span>
              <span className="text-lg font-black text-[#D4F938] font-mono">
                {openDemands.length} Live Lists
              </span>
            </div>
          </div>
        </div>

        {/* Neighborhood Hub Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 border-t border-[#1A2F24] scrollbar-none">
          {HUBS.map((hub) => (
            <button
              key={hub.id}
              onClick={() => setSelectedHub(hub.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedHub === hub.id
                  ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
                  : 'bg-[#08120D] border border-[#16281E] text-slate-400 hover:text-white hover:border-[#2D4C3A]'
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
          <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-bold text-white">No open grocery requests matching this hub</div>
          <div className="text-xs text-slate-400">Check back shortly or select "All Neighborhoods" to view requests across Ghana.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredDemands.map((list) => {
            const hasMyOffer = list.offers?.some((o) => o.store_id === currentUser.id);

            return (
              <div
                key={list.id}
                className="apex-card rounded-3xl p-6 sm:p-8 space-y-5 border-[#1A2F24] apex-card-hover"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A2F24]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-base sm:text-lg font-bold text-white">{list.title}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#182C20] text-[#D4F938] border border-[#234330]">
                        {list.urgency}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                      <span>Customer: <strong className="text-slate-200">{list.shopper_name || 'Verified Shopper'}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#D4F938]">
                        <MapPin className="w-3.5 h-3.5" />
                        {list.neighborhood}
                      </span>
                      <span>•</span>
                      <span>Delivery: {list.delivery_address}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Customer Target Budget</span>
                    <span className="text-xl sm:text-2xl font-black text-white font-mono">
                      GH₵ {list.total_target_budget.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items Manifest */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Requested Grocery Items ({list.items?.length || 0})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {list.items?.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-[#08120D] border border-[#16281E] flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-slate-200 truncate pr-2">{item.name}</span>
                        <span className="text-slate-400 font-mono text-[11px] shrink-0">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Notes */}
                {list.notes && (
                  <div className="p-3.5 rounded-2xl bg-[#08120D] border border-[#16281E] text-xs text-slate-300">
                    <strong className="text-white">Customer Note:</strong> {list.notes}
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Sparkles className="w-4 h-4 text-[#D4F938]" />
                    <span>
                      {list.offers?.length || 0} other store bids submitted for this list
                    </span>
                  </div>

                  {hasMyOffer ? (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#182C20] text-[#D4F938] border border-[#234330] text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Your Store Bid is Submitted</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedListForOffer(list)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-apex text-xs font-black shadow-lg shadow-[#D4F938]/15 transition-all"
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
