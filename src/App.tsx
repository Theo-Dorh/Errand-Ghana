import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext.tsx';
import { AuthPage } from './components/auth/AuthPage.tsx';
import { Header } from './components/common/Header.tsx';
import { ShopperDemandView } from './components/shopper/ShopperDemandView.tsx';
import { ShopperOrderTracker } from './components/shopper/ShopperOrderTracker.tsx';
import { MarketDemandFeed } from './components/merchant/MarketDemandFeed.tsx';
import { MerchantOrdersView } from './components/merchant/MerchantOrdersView.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { ToastContainer, ToastMessage } from './components/common/Toast.tsx';
import { ShoppingBag, ArrowRight, User, Users } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, currentUser, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { orders, demandLists } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'orders' | 'admin'>('marketplace');
  const [orderScope, setOrderScope] = useState<'my' | 'all'>('my');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // If not logged in, show the AuthPage gateway
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Filter shopper orders
  const myShopperOrders = orders.filter((o) => o.shopper_id === currentUser.id);
  const targetOrders = orderScope === 'my' ? myShopperOrders : orders;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      theme === 'dark' ? 'bg-[#080F0B] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <div>
            {role === 'shopper' && (
              <ShopperDemandView onNavigateToOrders={() => setActiveTab('orders')} />
            )}
            {role === 'store' && <MarketDemandFeed />}
            {role === 'admin' && <AdminDashboard />}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {role === 'shopper' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Your Active Grocery Orders
                    </h3>
                    <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Orders with funds protected in the Errand Ghana Escrow Vault. Inspect fresh items at your doorstep to authorize store payment.
                    </p>
                  </div>

                  {/* Scope Selector Pills */}
                  <div className={`flex items-center gap-1.5 p-1 rounded-2xl border text-xs w-fit ${
                    theme === 'dark' ? 'bg-[#0E1A14] border-[#1A2F24]' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <button
                      onClick={() => setOrderScope('my')}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                        orderScope === 'my'
                          ? theme === 'dark'
                            ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
                            : 'bg-white text-emerald-800 border border-slate-200 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>My Active Orders</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        orderScope === 'my'
                          ? theme === 'dark' ? 'bg-[#234330] text-[#D4F938]' : 'bg-emerald-100 text-emerald-900'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {myShopperOrders.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setOrderScope('all')}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                        orderScope === 'all'
                          ? theme === 'dark'
                            ? 'bg-[#182C20] text-[#D4F938] border border-[#234330] shadow-sm'
                            : 'bg-white text-emerald-800 border border-slate-200 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>All Market Orders</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        orderScope === 'all'
                          ? theme === 'dark' ? 'bg-[#234330] text-[#D4F938]' : 'bg-emerald-100 text-emerald-900'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {orders.length}
                      </span>
                    </button>
                  </div>
                </div>

                {targetOrders.length === 0 ? (
                  <div className="apex-card rounded-3xl p-10 sm:p-12 text-center space-y-4">
                    <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
                    <div>
                      <div className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {orderScope === 'my' ? 'No active grocery orders in escrow' : 'No market orders placed yet'}
                      </div>
                      <div className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                        {orderScope === 'my'
                          ? 'Post a grocery list and accept a store price offer to lock payment safely in Mobile Money Safe Pay.'
                          : 'Orders created by shoppers will appear here with live 4-step escrow tracking.'}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveTab('marketplace')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-apex text-xs font-black"
                      >
                        <span>Go to Grocery Shopping</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {orderScope === 'my' && orders.length > 0 && (
                        <button
                          onClick={() => setOrderScope('all')}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                            theme === 'dark'
                              ? 'bg-[#08120D] border-[#16281E] text-slate-300 hover:bg-[#12221A]'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Users className="w-4 h-4" />
                          <span>View All Community Orders ({orders.length})</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {targetOrders.map((order) => {
                      const list = demandLists.find((d) => d.id === order.list_id);
                      return (
                        <ShopperOrderTracker
                          key={order.id}
                          order={order}
                          list={list}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {role === 'store' && <MerchantOrdersView />}
            {role === 'admin' && <AdminDashboard />}
          </div>
        )}

        {/* Admin Tab */}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Consumer Footer */}
      <footer className={`w-full border-t py-8 text-xs ${
        theme === 'dark' ? 'border-[#1A2F24] bg-[#080F0B] text-slate-500' : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Errand Ghana
            </span>
            <span>•</span>
            <span>Your everyday grocery shopping assistant with Mobile Money safe pay escrow</span>
          </div>

          <div className="text-slate-400 text-[11px]">
            Operating across Accra (Makola, Madina, East Legon, Kaneshie) & Kumasi (Kejetia)
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppWithMarketplace />
      </AuthProvider>
    </ThemeProvider>
  );
};

const AppWithMarketplace: React.FC = () => {
  const { currentUser } = useAuth();
  return (
    <MarketplaceProvider currentUserId={currentUser.id}>
      <AppContent />
    </MarketplaceProvider>
  );
};

export default App;
