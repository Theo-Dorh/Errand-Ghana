import React, { useState } from 'react';
import { DemandList, StoreOffer } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useMarketplace } from '../../context/MarketplaceContext.tsx';
import { OfferReviewCard } from './OfferReviewCard.tsx';
import { CreateDemandListModal } from './CreateDemandListModal.tsx';
import { MoMoPaymentModal } from './MoMoPaymentModal.tsx';
import {
  Search,
  Plus,
  MapPin,
  Clock,
  Apple,
  Wheat,
  Beef,
  Flame,
  Milk,
  Cookie,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: Sparkles },
  { id: 'produce', name: 'Fresh Produce', icon: Apple },
  { id: 'grains', name: 'Grains & Rice', icon: Wheat },
  { id: 'meat', name: 'Meat & Fish', icon: Beef },
  { id: 'tubers', name: 'Yams & Tubers', icon: Flame },
  { id: 'dairy', name: 'Oils & Spices', icon: Milk },
  { id: 'snacks', name: 'Provisions', icon: Cookie },
];

export const ShopperDemandView: React.FC = () => {
  const { currentUser } = useAuth();
  const { demandLists, createDemandList, prepareAndLockMoMo } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{ offer: StoreOffer; list: DemandList } | null>(null);

  // Quick Inline Demand state for fast post
  const [quickTitle, setQuickTitle] = useState('');
  const [quickBudget, setQuickBudget] = useState('');

  // Filter demands for this shopper
  const myDemands = demandLists.filter((d) => d.shopper_id === currentUser.id);

  const filteredDemands = myDemands.filter((d) => {
    if (!searchQuery) return true;
    return (
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.items?.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    createDemandList(
      quickTitle,
      currentUser.neighborhood || 'East Legon, Accra',
      `${currentUser.neighborhood}, Accra`,
      parseFloat(quickBudget) || 150.0,
      'Standard (2-4 hrs)',
      'Direct order via quick search builder',
      [
        {
          name: quickTitle,
          quantity: 1,
          unit: 'Pack / Bag',
          target_price: parseFloat(quickBudget) || 150.0,
          category: 'Fresh Produce',
        },
      ]
    );

    setQuickTitle('');
    setQuickBudget('');
  };

  return (
    <div className="space-y-8">
      {/* Top Search Bar */}
      <div className="relative max-w-3xl mx-auto">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for groceries (e.g. 5kg Jasmine Rice, Navrongo Tomatoes, Pona Yam)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
          />
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-900/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Quick "Post Grocery Demand" Card */}
      <div className="app-card rounded-3xl p-6 sm:p-8 space-y-5 border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <ShoppingBag className="w-4 h-4" />
              <span>Post Grocery Request</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Need Groceries? Set Your Own Price & Let Stores Compete
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Post what you need. Makola, Madina, and Kaneshie merchants submit wholesale bids within minutes.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-900/20 shrink-0 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Itemized Basket</span>
          </button>
        </div>

        {/* Quick 1-Line Input */}
        <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Quick request: e.g. 5 tubers of Pona Yam + 1 tin of Kpakpo Shito"
            className="flex-1 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
          />
          <input
            type="number"
            value={quickBudget}
            onChange={(e) => setQuickBudget(e.target.value)}
            placeholder="Target Budget (GH₵)"
            className="w-full sm:w-44 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shrink-0"
          >
            Submit Request
          </button>
        </form>
      </div>

      {/* Active Demands Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Your Active Grocery Demands</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              {filteredDemands.length}
            </span>
          </h3>
        </div>

        {filteredDemands.length === 0 ? (
          <div className="app-card rounded-3xl p-12 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No active grocery demands found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Post your first grocery list above to start receiving competitive bids from verified market stores.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
            >
              <Plus className="w-4 h-4" />
              <span>Create Itemized Basket</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDemands.map((list) => {
              const offers = list.offers || [];
              const hasOffers = offers.length > 0;

              return (
                <div
                  key={list.id}
                  className="app-card rounded-3xl p-6 sm:p-8 space-y-6 border-slate-200 app-card-hover"
                >
                  {/* Demand Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-base sm:text-lg font-bold text-slate-900">{list.title}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          list.status === 'funded'
                            ? 'bg-emerald-100 text-emerald-800'
                            : list.status === 'bidded'
                            ? 'bg-amber-100 text-amber-800'
                            : list.status === 'completed'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {list.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          {list.neighborhood}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-700 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {list.urgency}
                        </span>
                        <span>•</span>
                        <span>Posted {new Date(list.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Budget Ceiling</span>
                      <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
                        GH₵ {list.total_target_budget.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Items Manifest */}
                  {list.items && list.items.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Requested Items ({list.items.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {list.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                          >
                            <span className="font-semibold text-slate-800 truncate pr-2">{item.name}</span>
                            <span className="text-slate-500 font-mono shrink-0">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Incoming Merchant Bids */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <span>Store Bids</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          {offers.length} {offers.length === 1 ? 'Bid' : 'Bids'} Received
                        </span>
                      </span>
                    </div>

                    {!hasOffers ? (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                        Waiting for bids from Makola & Madina stores... (You will receive notifications as bids arrive)
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

      {/* Modal: Create Demand Basket */}
      {showCreateModal && (
        <CreateDemandListModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={createDemandList}
        />
      )}

      {/* Modal: MoMo Payment Checkout */}
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
