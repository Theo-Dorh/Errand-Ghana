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
import { ShoppingBag } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, currentUser, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { orders, demandLists } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'orders' | 'admin'>('marketplace');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // If not logged in, show the AuthPage gateway
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Find shopper orders
  const myShopperOrders = orders.filter((o) => o.shopper_id === currentUser.id);

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
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Your Active Grocery Orders
                  </h3>
                  <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Orders with funds protected in the Errand Ghana Escrow Vault. Inspect fresh items at your doorstep to authorize store payment.
                  </p>
                </div>

                {myShopperOrders.length === 0 ? (
                  <div className="apex-card rounded-3xl p-12 text-center space-y-2">
                    <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
                    <div className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                      No active grocery orders placed
                    </div>
                    <div className="text-xs text-slate-400">
                      Accept a store price offer on your shopping list to initiate an order.
                    </div>
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
