import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DemandList,
  Order,
  AdminMetrics,
  AuditLedgerEntry,
  MoMoProvider,
  StoreOffer,
} from '../types/index.ts';

interface MarketplaceContextType {
  demandLists: DemandList[];
  orders: Order[];
  adminMetrics: AdminMetrics | null;
  auditLedger: AuditLedgerEntry[];
  loading: boolean;
  refreshData: () => Promise<void>;
  createDemandList: (
    title: string,
    neighborhood: string,
    deliveryAddress: string,
    totalBudget: number,
    urgency: string,
    notes: string,
    items: Array<{ name: string; quantity: number; unit: string; target_price: number; category: string }>
  ) => Promise<{ success: boolean; data?: DemandList; message?: string }>;
  submitStoreOffer: (
    listId: string,
    offeredPrice: number,
    deliveryFee: number,
    fulfillmentHours: number,
    notes?: string
  ) => Promise<{ success: boolean; data?: StoreOffer; message?: string }>;
  prepareAndLockMoMo: (
    listId: string,
    offerId: string,
    momoProvider: MoMoProvider,
    momoNumber: string
  ) => Promise<{ success: boolean; order?: Order; message: string }>;
  updateOrderStatus: (
    orderId: string,
    status: 'in_transit' | 'delivered'
  ) => Promise<{ success: boolean; order?: Order; message: string }>;
  commitAndReleasePayout: (orderId: string) => Promise<{ success: boolean; order?: Order; message: string }>;
  executeCompensatingRefund: (orderId: string, disputeReason: string) => Promise<{ success: boolean; order?: Order; message: string }>;
  approveStoreKyc: (storeId: string, isApproved: boolean) => Promise<{ success: boolean; message: string }>;
  sendOrderMessage: (orderId: string, message: string) => Promise<boolean>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode; currentUserId: string }> = ({
  children,
  currentUserId,
}) => {
  const [demandLists, setDemandLists] = useState<DemandList[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics | null>(null);
  const [auditLedger, setAuditLedger] = useState<AuditLedgerEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const API_BASE = '/api';

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [listsRes, ordersRes, metricsRes, ledgerRes] = await Promise.all([
        fetch(`${API_BASE}/demand-lists`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/orders`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/admin/metrics`).then((r) => r.json()).catch(() => ({ data: null })),
        fetch(`${API_BASE}/escrow/audit-ledger`).then((r) => r.json()).catch(() => ({ data: [] })),
      ]);

      if (listsRes?.data) setDemandLists(listsRes.data);
      if (ordersRes?.data) setOrders(ordersRes.data);
      if (metricsRes?.data) setAdminMetrics(metricsRes.data);
      if (ledgerRes?.data) setAuditLedger(ledgerRes.data);
    } catch (err) {
      console.error('Error fetching marketplace data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 8000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const createDemandList = async (
    title: string,
    neighborhood: string,
    deliveryAddress: string,
    totalBudget: number,
    urgency: string,
    notes: string,
    items: Array<{ name: string; quantity: number; unit: string; target_price: number; category: string }>
  ) => {
    try {
      const res = await fetch(`${API_BASE}/demand-lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopper_id: currentUserId,
          title,
          neighborhood,
          delivery_address: deliveryAddress,
          total_target_budget: totalBudget,
          urgency,
          notes,
          items,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        return { success: true, data: data.data };
      }
      return { success: false, message: data.message || 'Failed to create demand list' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const submitStoreOffer = async (
    listId: string,
    offeredPrice: number,
    deliveryFee: number,
    fulfillmentHours: number,
    notes?: string
  ) => {
    try {
      const res = await fetch(`${API_BASE}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          list_id: listId,
          store_id: currentUserId,
          offered_total_price: offeredPrice,
          delivery_fee: deliveryFee,
          fulfillment_time_hours: fulfillmentHours,
          store_notes: notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        return { success: true, data: data.data };
      }
      return { success: false, message: data.message || 'Failed to submit offer' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const prepareAndLockMoMo = async (
    listId: string,
    offerId: string,
    momoProvider: MoMoProvider,
    momoNumber: string
  ) => {
    try {
      const res = await fetch(`${API_BASE}/escrow/prepare-momo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          list_id: listId,
          offer_id: offerId,
          shopper_id: currentUserId,
          momo_provider: momoProvider,
          momo_number: momoNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
      }
      return data;
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'in_transit' | 'delivered') => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor_id: currentUserId,
          status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
      }
      return data;
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const commitAndReleasePayout = async (orderId: string) => {
    try {
      const res = await fetch(`${API_BASE}/escrow/commit-release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          shopper_id: currentUserId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
      }
      return data;
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const executeCompensatingRefund = async (orderId: string, disputeReason: string) => {
    try {
      const res = await fetch(`${API_BASE}/escrow/dispute-refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          actor_id: currentUserId,
          dispute_reason: disputeReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
      }
      return data;
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const approveStoreKyc = async (storeId: string, isApproved: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/admin/kyc-stores/${storeId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: isApproved }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
      }
      return data;
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const sendOrderMessage = async (orderId: string, message: string) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: currentUserId,
          sender_name: 'User',
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        demandLists,
        orders,
        adminMetrics,
        auditLedger,
        loading,
        refreshData,
        createDemandList,
        submitStoreOffer,
        prepareAndLockMoMo,
        updateOrderStatus,
        commitAndReleasePayout,
        executeCompensatingRefund,
        approveStoreKyc,
        sendOrderMessage,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
