import React, { useState } from 'react';
import { DemandList, StoreOffer } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
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
  { id: 'all', name: 'All Items', icon: Sparkles },
  { id: 'produce', name: 'Fresh Produce (Tomatoes, Pepper)', icon: Apple },
  { id: 'grains', name: 'Grains & Rice', icon: Wheat },
  { id: 'meat', name: 'Meat & Smoked Fish', icon: Beef },
  { id: 'tubers', name: 'Pona Yams & Plantain', icon: Flame },
  { id: 'dairy', name: 'Zomi & Cooking Oils', icon: Milk },
  { id: 'snacks', name: 'Provisions & Spices', icon: Cookie },
];

export const ShopperDemandView: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { demandLists, createDemandList, prepareAndLockMoMo } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{ offer: StoreOffer; list: DemandList } | null>(null);

  // Quick list state
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
      {/* 1. Hero / Platform Welcome & Explainer Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden border transition-all ${
        theme === 'dark'
          ? 'apex-card bg-gradient-to-br from-[#0E1A14] via-[#0E1A14] to-[#12241B] border-[#1A2F24]'
          : 'bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/30 border-emerald-100/90 shadow-sm'
      }`}>
        {/* Subtle Ambient Glow */}
        <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          theme === 'dark' ? 'bg-[#D4F938]/10' : 'bg-emerald-500/10'
        }`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold ${
              theme === 'dark'
                ? 'bg-[#16291E] border-[#234330] text-[#D4F938]'
                : 'bg-emerald-100/70 border-emerald-200 text-emerald-800'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Everyday Grocery Shopping From Your Home</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Get Market Prices on Fresh Groceries — Safely Delivered
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Post what you need from Makola, Madina, and local stores. Verified vendors compete with their best prices, and your Mobile Money is protected until you inspect the fresh delivery.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl btn-apex text-xs font-black shadow-lg shrink-0 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Grocery List</span>
          </button>
        </div>

        {/* 3-Step Simple Explainer Cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t relative z-10 ${
          theme === 'dark' ? 'border-[#1A2F24]' : 'border-slate-200/80'
        }`}>
          <div className={`p-4 rounded-2xl border space-y-1.5 ${
            theme === 'dark'
              ? 'bg-[#08120D] border-[#16281E]'
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`flex items-center gap-2 text-xs font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black ${
                theme === 'dark'
                  ? 'bg-[#182C20] border-[#234330] text-[#D4F938]'
                  : 'bg-emerald-100 border-emerald-200 text-emerald-800'
              }`}>1</span>
              <span>List Your Groceries</span>
            </div>
            <p className={`text-[11px] leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Add items (e.g., tomatoes, yams, rice) and specify your target price.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border space-y-1.5 ${
            theme === 'dark'
              ? 'bg-[#08120D] border-[#16281E]'
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`flex items-center gap-2 text-xs font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black ${
                theme === 'dark'
                  ? 'bg-[#182C20] border-[#234330] text-[#D4F938]'
                  : 'bg-emerald-100 border-emerald-200 text-emerald-800'
              }`}>2</span>
              <span>Stores Compete with Bids</span>
            </div>
            <p className={`text-[11px] leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Makola and local merchants offer wholesale prices and fast delivery times.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border space-y-1.5 ${
            theme === 'dark'
              ? 'bg-[#08120D] border-[#16281E]'
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`flex items-center gap-2 text-xs font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black ${
                theme === 'dark'
                  ? 'bg-[#182C20] border-[#234330] text-[#D4F938]'
                  : 'bg-emerald-100 border-emerald-200 text-emerald-800'
              }`}>3</span>
              <span>Inspect & Pay with MoMo</span>
            </div>
            <p className={`text-[11px] leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Funds are held safely. Store is only paid after you inspect goods at your door.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Search & Category Pills */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-3xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groceries (e.g. Navrongo Tomatoes, 5kg Jasmine Rice, Pona Yams, Zomi Oil)..."
            className={`w-full pl-12 pr-4 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none transition-all shadow-inner ${
              theme === 'dark'
                ? 'bg-[#0E1A14] border-[#1A2F24] text-white placeholder-slate-500 focus:border-[#D4F938]'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-600 shadow-sm'
            }`}
          />
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  isSelected
                    ? theme === 'dark'
                      ? 'bg-[#182C20] text-[#D4F938] border-[#234330] shadow-sm'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-sm'
                    : theme === 'dark'
                    ? 'bg-[#0E1A14] border-[#1A2F24] text-slate-400 hover:text-white hover:border-[#2D4C3A]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'
                }`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Quick Request Form Bar */}
      <div className="apex-card rounded-3xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-extrabold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <ShoppingBag className={`w-4 h-4 ${theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'}`} />
            <span>Quick Grocery Request</span>
          </span>
          <span className="text-[11px] text-slate-400">Takes less than 15 seconds</span>
        </div>

        <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Type items: e.g. 5 tubers of Pona Yam + 1 Olonka of Fresh Tomatoes"
            className={`flex-1 px-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
              theme === 'dark'
                ? 'bg-[#08120D] border-[#16281E] text-white placeholder-slate-500 focus:border-[#D4F938]'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:bg-white'
            }`}
          />
          <input
            type="number"
            value={quickBudget}
            onChange={(e) => setQuickBudget(e.target.value)}
            placeholder="Your Budget (GH₵)"
            className={`w-full sm:w-44 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold focus:outline-none ${
              theme === 'dark'
                ? 'bg-[#08120D] border-[#16281E] text-[#D4F938] placeholder-slate-500 focus:border-[#D4F938]'
                : 'bg-slate-50 border-slate-200 text-emerald-800 placeholder-slate-400 focus:border-emerald-600 focus:bg-white'
            }`}
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl btn-apex text-xs font-black shrink-0"
          >
            Post Request
          </button>
        </form>
      </div>

      {/* 4. Active Grocery Requests Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-base font-extrabold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <span>Your Active Grocery Lists</span>
            <span className={`px-2.5 py-0.5 rounded-full border text-xs font-black font-mono ${
              theme === 'dark'
                ? 'bg-[#182C20] text-[#D4F938] border-[#234330]'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {filteredDemands.length}
            </span>
          </h3>
        </div>

        {filteredDemands.length === 0 ? (
          <div className="apex-card rounded-3xl p-12 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
            <h4 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              No active grocery lists posted yet
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Post your shopping list above to start receiving wholesale price offers from local market stores.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-apex text-xs font-black"
            >
              <Plus className="w-4 h-4" />
              <span>Create Grocery List</span>
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
                  className="apex-card rounded-3xl p-6 sm:p-8 space-y-6 apex-card-hover"
                >
                  {/* List Header */}
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
                          list.status === 'funded'
                            ? theme === 'dark' ? 'bg-[#182C20] text-[#D4F938] border-[#234330]' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : list.status === 'bidded'
                            ? theme === 'dark' ? 'bg-[#251D10] text-[#F59E0B] border-[#40311B]' : 'bg-amber-100 text-amber-800 border-amber-200'
                            : list.status === 'completed'
                            ? theme === 'dark' ? 'bg-[#20152B] text-[#C084FC] border-[#3B2252]' : 'bg-purple-100 text-purple-800 border-purple-200'
                            : theme === 'dark' ? 'bg-[#12221A] text-slate-400 border-[#1A2F24]' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {list.status === 'bidded' ? 'Offers Received' : list.status === 'funded' ? 'Payment Locked' : list.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className={`flex items-center gap-1 font-semibold ${
                          theme === 'dark' ? 'text-[#D4F938]' : 'text-emerald-700'
                        }`}>
                          <MapPin className="w-3.5 h-3.5" />
                          {list.neighborhood}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                          {list.urgency}
                        </span>
                        <span>•</span>
                        <span>Posted {new Date(list.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] font-medium text-slate-400 block">Target budget</span>
                      <span className={`text-lg sm:text-xl font-black font-mono ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        GH₵ {list.total_target_budget.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Items Manifest */}
                  {list.items && list.items.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-slate-400 block">
                        Requested items ({list.items.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {list.items.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between p-3 rounded-2xl border text-xs ${
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
                  )}

                  {/* Incoming Store Bids */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold flex items-center gap-2 ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        <span>Store price offers</span>
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                          theme === 'dark'
                            ? 'bg-[#182C20] text-[#D4F938] border-[#234330]'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {offers.length} {offers.length === 1 ? 'Store Offer' : 'Store Offers'}
                        </span>
                      </span>
                    </div>

                    {!hasOffers ? (
                      <div className={`p-4 rounded-2xl border text-center text-xs text-slate-400 ${
                        theme === 'dark' ? 'bg-[#08120D] border-[#16281E]' : 'bg-slate-50 border-slate-200'
                      }`}>
                        Makola and Madina vendors are reviewing your list. You will receive notifications as bids arrive.
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
