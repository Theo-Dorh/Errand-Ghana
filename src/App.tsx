import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext.tsx';
import { Header } from './components/common/Header.tsx';
import { ShopperDemandView } from './components/shopper/ShopperDemandView.tsx';
import { ShopperOrderTracker } from './components/shopper/ShopperOrderTracker.tsx';
import { MarketDemandFeed } from './components/merchant/MarketDemandFeed.tsx';
import { MerchantOrdersView } from './components/merchant/MerchantOrdersView.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { DocsViewer } from './components/docs/DocsViewer.tsx';
import { ToastContainer, ToastMessage } from './components/common/Toast.tsx';
import { ShoppingCart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, currentUser } = useAuth();
  const { orders, demandLists } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'orders' | 'admin' | 'docs'>('marketplace');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Find shopper orders
  const myShopperOrders = orders.filter((o) => o.shopper_id === currentUser.id);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Sticky Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <div>
            {role === 'shopper' && <ShopperDemandView />}
            {role === 'store' && <MarketDemandFeed />}
            {role === 'admin' && <AdminDashboard />}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {role === 'shopper' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-100">Your Active 2PC Escrow Orders</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Orders with funds locked in the ERRAND GHANA Escrow Vault. Inspect goods upon delivery to release vendor settlement.
                  </p>
                </div>

                {myShopperOrders.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                    <ShoppingCart className="w-10 h-10 text-slate-600 mx-auto" />
                    <div className="text-sm font-semibold text-slate-300">No active escrow orders placed</div>
                    <div className="text-xs text-slate-500">Accept a merchant bid on your demand list to initiate an order.</div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {myShopperOrders.map((order) => {
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

        {/* Academic Docs Tab */}
        {activeTab === 'docs' && <DocsViewer />}
      </main>

      {/* Footer with Academic Attribution */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">ERRAND GHANA</span>
            <span>•</span>
            <span>C2B Demand Marketplace & MoMo 2PC Escrow Engine</span>
          </div>

          <div className="flex items-center gap-4 text-center md:text-right">
            <span>
              Developer: <strong className="text-slate-300">Theophilus Dorh</strong> (ID: <span className="font-mono text-amber-400">22425676</span>)
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">CSCD 602 (UG Legon)</span>
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
    <AuthProvider>
      <AppWithMarketplace />
    </AuthProvider>
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
