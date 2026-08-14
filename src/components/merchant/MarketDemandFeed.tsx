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
    <div className="space-y-6">
      {/* Merchant Market Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Store className="w-4 h-4" />
            <span>Real-Time Urban Market Demand Board</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-1">
            {currentUser.store_name || currentUser.full_name}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Review live consumer grocery requests from East Legon, Madina, and Kumasi. Submit competitive bids backed by 2PC Mobile Money Escrow guarantees.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>KYC Verified Merchant</span>
        </div>
      </div>

      {/* Neighborhood Filters Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 pr-2 shrink-0 font-semibold">
          <Filter className="w-3.5 h-3.5" />
          <span>Hubs:</span>
        </div>
        {FILTER_NEIGHBORHOODS.map((hub) => (
          <button
            key={hub}
            onClick={() => setSelectedNeighborhood(hub)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
              selectedNeighborhood === hub
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950/40'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {hub === 'ALL' ? 'All Urban Markets' : hub}
          </button>
        ))}
      </div>

      {/* Demand Cards Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Open Market Demands ({filteredDemands.length})
          </h3>
        </div>

        {filteredDemands.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-2">
            <Store className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">No active demand lists in this neighborhood</div>
            <div className="text-xs text-slate-500">Check back shortly or select 'All Urban Markets'.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDemands.map((list) => {
              const myExistingOffer = list.offers?.find((o) => o.store_id === currentUser.id);

              return (
                <div
                  key={list.id}
                  className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-bold text-slate-100">{list.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1 text-emerald-400">
                            <MapPin className="w-3.5 h-3.5" />
                            {list.neighborhood}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-400">
                            <Clock className="w-3.5 h-3.5" />
                            {list.urgency}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Shopper Budget</span>
                        <span className="text-base font-extrabold text-amber-400 font-mono">
                          GH₵ {list.total_target_budget.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Shopper Name & Address */}
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400">
                      <div>Shopper: <strong className="text-slate-200">{list.shopper_name || 'Verified Shopper'}</strong></div>
                      <div className="text-[11px] truncate">Delivery Landmark: {list.delivery_address}</div>
                    </div>

                    {/* Itemized Manifest */}
                    {list.items && list.items.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] uppercase font-semibold text-slate-400 block">
                          Requested Manifest ({list.items.length} items)
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-1">
                          {list.items.map((item) => (
                            <div
                              key={item.id}
                              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] flex justify-between"
                            >
                              <span className="text-slate-300 truncate">{item.name}</span>
                              <span className="text-slate-400 shrink-0">{item.quantity} {item.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Bid Status */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                    {myExistingOffer ? (
                      <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
                        <span className="text-emerald-300 font-semibold">Your Bid: GH₵ {(myExistingOffer.offered_total_price + myExistingOffer.delivery_fee).toFixed(2)}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold uppercase">
                          {myExistingOffer.status}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedDemandForBid(list)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-950/40 transition-all"
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
