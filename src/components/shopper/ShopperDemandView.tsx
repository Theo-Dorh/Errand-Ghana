import React, { useState } from 'react';
import { DemandList, StoreOffer } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { OfferReviewCard } from './OfferReviewCard.tsx';
import { CreateDemandListModal } from './CreateDemandListModal.tsx';
import { MoMoPaymentModal } from './MoMoPaymentModal.tsx';
import { ShoppingBag, Plus, Sparkles, MapPin, Clock, Tag } from 'lucide-react';

export const ShopperDemandView: React.FC = () => {
  const { currentUser } = useAuth();
  const { demandLists, createDemandList, prepareAndLockMoMo } = useMarketplace();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{ offer: StoreOffer; list: DemandList } | null>(null);

  // Filter demand lists for current shopper
  const myDemands = demandLists.filter((d) => d.shopper_id === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Shopper Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Demand-Led Reverse Auction Marketplace</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-1">
            Akwaaba, {currentUser.full_name}!
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Post your grocery demand lists, let Makola and Madina wholesale stores compete with real-time price bids, and lock funds safely in 2PC Mobile Money Escrow.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post Grocery Demand List</span>
        </button>
      </div>

      {/* Active Demands Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>My Active Demand Baskets ({myDemands.length})</span>
          </h3>
        </div>

        {myDemands.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-semibold text-slate-300">No Active Demand Lists</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't posted any grocery requests yet. Click the button below to create your first itemized basket.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Demand Basket</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {myDemands.map((list) => {
              const offers = list.offers || [];
              const hasOffers = offers.length > 0;

              return (
                <div
                  key={list.id}
                  className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5"
                >
                  {/* List Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-100">{list.title}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          list.status === 'funded'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                            : list.status === 'bidded'
                            ? 'bg-amber-950 text-amber-300 border-amber-500/30'
                            : list.status === 'completed'
                            ? 'bg-purple-950 text-purple-300 border-purple-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {list.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          {list.neighborhood}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          {list.urgency}
                        </span>
                        <span>•</span>
                        <span>Posted {new Date(list.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {/* Target Budget Box */}
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Target Budget</span>
                      <span className="text-lg font-extrabold text-amber-400 font-mono">
                        GH₵ {list.total_target_budget.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Items Manifest */}
                  {list.items && list.items.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                        Itemized Manifest ({list.items.length} items)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {list.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Tag className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="text-slate-200 font-medium truncate">{item.name}</span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-slate-400 text-[11px] block">{item.quantity} {item.unit}</span>
                              <span className="text-amber-400 font-mono font-semibold">GH₵ {(item.target_price * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Incoming Merchant Bids */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                        <span>Merchant Reverse-Auction Bids</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                          {offers.length} Bids Received
                        </span>
                      </span>
                    </div>

                    {!hasOffers ? (
                      <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-center text-xs text-slate-400">
                        Awaiting store bids from Makola & Madina merchants... (Notifications will trigger automatically)
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {offers.map((offer) => (
                          <OfferReviewCard
                            key={offer.id}
                            offer={offer}
                            list={list}
                            onAcceptOffer={(accepted) => setSelectedPayment({ offer: accepted, list })}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Create Demand List */}
      {showCreateModal && (
        <CreateDemandListModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={createDemandList}
        />
      )}

      {/* Modal: MoMo Payment & Escrow Lock */}
      {selectedPayment && (
        <MoMoPaymentModal
          offer={selectedPayment.offer}
          list={selectedPayment.list}
          defaultMomoNumber={currentUser.momo_number}
          defaultProvider={currentUser.momo_provider}
          onClose={() => setSelectedPayment(null)}
          onConfirmPayment={prepareAndLockMoMo}
        />
      )}
    </div>
  );
};
