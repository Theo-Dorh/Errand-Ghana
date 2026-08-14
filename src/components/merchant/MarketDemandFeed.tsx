import React, { useState } from 'react';
import { DemandList } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { SubmitOfferModal } from './SubmitOfferModal.tsx';
import { Store, MapPin, Clock, Filter, Gavel, CheckCircle2 } from 'lucide-react';

const FILTER_NEIGHBORHOODS = [
  'ALL',
  'East Legon',
  'Madina',
  'Makola Market',
  'Kaneshie',
  'Osu',
  'Spintex',
  'Kumasi Central (Kejetia)',
  'KNUST Campus',
];

export const MarketDemandFeed: React.FC = () => {
  const { currentUser } = useAuth();
  const { demandLists, submitStoreOffer } = useMarketplace();

  const [selectedNeighborhood, setSelectedNeighborhood] = useState('ALL');
  const [selectedDemandForBid, setSelectedDemandForBid] = useState<DemandList | null>(null);

  // Filter demand lists
  const filteredDemands = demandLists.filter((d) => {
    if (selectedNeighborhood === 'ALL') return true;
    return d.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* Merchant Header Banner */}
      <div className="app-card rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-white to-amber-50/40 border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Store className="w-4 h-4" />
            <span>Store Merchant Dashboard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            {currentUser.store_name || currentUser.full_name}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Browse active consumer grocery requests across Accra & Kumasi. Place competitive bids and receive direct Mobile Money payouts upon delivery.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Verified Merchant</span>
        </div>
      </div>

      {/* Neighborhood Hub Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 pr-2 shrink-0 font-bold">
          <Filter className="w-3.5 h-3.5" />
          <span>Hubs:</span>
        </div>
        {FILTER_NEIGHBORHOODS.map((hub) => (
          <button
            key={hub}
            onClick={() => setSelectedNeighborhood(hub)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              selectedNeighborhood === hub
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-900/10'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {hub === 'ALL' ? 'All Market Hubs' : hub}
          </button>
        ))}
      </div>

      {/* Open Demands Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Open Grocery Demands ({filteredDemands.length})
          </h3>
        </div>

        {filteredDemands.length === 0 ? (
          <div className="app-card rounded-3xl p-12 text-center space-y-2">
            <Store className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-800">No active demand lists in this neighborhood</div>
            <div className="text-xs text-slate-500">Check back shortly or select 'All Market Hubs'.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDemands.map((list) => {
              const myExistingOffer = list.offers?.find((o) => o.store_id === currentUser.id);

              return (
                <div
                  key={list.id}
                  className="app-card rounded-3xl p-6 flex flex-col justify-between space-y-5 border-slate-200 app-card-hover"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{list.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1 text-emerald-700 font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            {list.neighborhood}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-700 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {list.urgency}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Budget</span>
                        <span className="text-base font-extrabold text-slate-900 font-mono">
                          GH₵ {list.total_target_budget.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Shopper & Landmark */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-0.5">
                      <div>Customer: <strong className="text-slate-900">{list.shopper_name || 'Verified Shopper'}</strong></div>
                      <div className="text-[11px] text-slate-500 truncate">Landmark: {list.delivery_address}</div>
                    </div>

                    {/* Itemized Manifest */}
                    {list.items && list.items.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Requested Grocery Items ({list.items.length})
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-1">
                          {list.items.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] flex justify-between"
                            >
                              <span className="text-slate-800 font-medium truncate pr-1">{item.name}</span>
                              <span className="text-slate-500 font-mono shrink-0">{item.quantity} {item.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Bid Status */}
                  <div className="pt-3 border-t border-slate-100">
                    {myExistingOffer ? (
                      <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                        <span className="text-emerald-900 font-bold">Your Bid: GH₵ {(myExistingOffer.offered_total_price + myExistingOffer.delivery_fee).toFixed(2)}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold uppercase">
                          {myExistingOffer.status}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedDemandForBid(list)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-900/10 transition-all"
                      >
                        <Gavel className="w-4 h-4" />
                        <span>Place Reverse-Auction Bid</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Submit Bid */}
      {selectedDemandForBid && (
        <SubmitOfferModal
          list={selectedDemandForBid}
          onClose={() => setSelectedDemandForBid(null)}
          onSubmitOffer={submitStoreOffer}
        />
      )}
    </div>
  );
};
