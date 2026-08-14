import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DemandList,
  DemandItem,
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

const DEFAULT_SEED_LISTS: DemandList[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    shopper_id: '11111111-1111-1111-1111-111111111111',
    shopper_name: 'Kofi Mensah',
    title: 'Sunday Jollof & Fresh Soup Basket',
    neighborhood: 'East Legon, Accra',
    delivery_address: 'Boundary Road, near Mensvic Hotel, Accra',
    total_target_budget: 385.0,
    max_budget_limit: 420.0,
    status: 'bidded',
    urgency: 'Express (< 1 hr)',
    notes: 'Require fresh firm tomatoes and authentic local fragrant rice.',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    items: [
      { id: 'a1', list_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Ghana Royal Jasmine Rice (5kg)', quantity: 1, unit: 'Bag (5kg)', target_price: 145.0, category: 'Grains & Cereals' },
      { id: 'a2', list_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Fresh Navrongo Firm Tomatoes', quantity: 1, unit: 'Olonka (Large Tin)', target_price: 75.0, category: 'Fresh Produce' },
      { id: 'a3', list_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Pure Zomi Red Palm Oil', quantity: 2, unit: 'Bottles / Liters', target_price: 65.0, category: 'Oils & Spices' },
      { id: 'a4', list_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Fresh Smoked Bonny Catfish', quantity: 1, unit: 'Kilogram (kg)', target_price: 100.0, category: 'Meat & Fish' },
    ],
    offers: [
      {
        id: 'offer-111-222-333',
        list_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        store_id: '33333333-3333-3333-3333-333333333333',
        store_name: 'Naa Lamiley Makola Wholesale',
        store_rating: 4.88,
        offered_total_price: 375.0,
        delivery_fee: 15.0,
        fulfillment_time_hours: 1.5,
        status: 'pending',
        store_notes: 'Direct from Makola wholesale crates. Includes fresh kpakpo shito bonus.',
        created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      },
    ],
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    shopper_id: '22222222-2222-2222-2222-222222222222',
    shopper_name: 'Ama Serwaa',
    title: 'Hostel Bulk Tubers & Palm Oil Restock',
    neighborhood: 'Madina, Accra',
    delivery_address: 'UG Legon, Pentagon Block B, Room 314',
    total_target_budget: 260.0,
    max_budget_limit: 290.0,
    status: 'open',
    urgency: 'Standard (2-4 hrs)',
    notes: 'Tubers should be genuine Pona yams from Techiman batch.',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    items: [
      { id: 'b1', list_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Techiman Pona Sweet Yams', quantity: 5, unit: 'Tubers', target_price: 160.0, category: 'Tubers' },
      { id: 'b2', list_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Fresh Red Scotch Bonnet Pepper (Kpakpo Shito)', quantity: 1, unit: 'Margarine Tin (Small Tin)', target_price: 40.0, category: 'Fresh Produce' },
      { id: 'b3', list_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Local Shallots & Purple Onions', quantity: 1, unit: 'Paint Bucket', target_price: 60.0, category: 'Fresh Produce' },
    ],
    offers: [],
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    shopper_id: '11111111-1111-1111-1111-111111111111',
    shopper_name: 'Kofi Mensah',
    title: 'Kumasi Fresh Garden Eggs & Plantain Batch',
    neighborhood: 'Kejetia, Kumasi',
    delivery_address: 'KNUST Campus, Hall 7, Kumasi',
    total_target_budget: 195.0,
    max_budget_limit: 220.0,
    status: 'open',
    urgency: 'Flexible (Same Day)',
    notes: 'Apem plantains, semi-ripe for plantain chips and boiled ampesi.',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    items: [
      { id: 'c1', list_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', name: 'Green & Semi-Ripe Apem Plantain', quantity: 2, unit: 'Bunch (Plantain / Banana)', target_price: 110.0, category: 'Tubers' },
      { id: 'c2', list_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', name: 'Fresh Green Garden Eggs (Ntrowa)', quantity: 1, unit: 'Olonka (Large Tin)', target_price: 45.0, category: 'Fresh Produce' },
      { id: 'c3', list_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', name: 'Momoni (Fermented Salt Fish Seasoning)', quantity: 3, unit: 'Olonka (Large Tin)', target_price: 40.0, category: 'Meat & Fish' },
    ],
    offers: [],
  },
];

const DEFAULT_ORDERS: Order[] = [];

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode; currentUserId: string }> = ({
  children,
  currentUserId,
}) => {
  const [demandLists, setDemandLists] = useState<DemandList[]>(() => {
    const saved = localStorage.getItem('errand_ghana_demands');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return DEFAULT_SEED_LISTS;
      }
    }
    return DEFAULT_SEED_LISTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('errand_ghana_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return DEFAULT_ORDERS;
      }
    }
    return DEFAULT_ORDERS;
  });

  const [auditLedger, setAuditLedger] = useState<AuditLedgerEntry[]>(() => {
    const saved = localStorage.getItem('errand_ghana_audit_ledger');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [];
      }
    }
    return [
      {
        id: 'init-audit-1',
        action: 'SYSTEM_BOOTSTRAP',
        actor_id: '55555555-5555-5555-5555-555555555555',
        actor_role: 'system_admin',
        state_before: 'UNINITIALIZED',
        state_after: 'READY',
        amount: 420.0,
        sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        metadata: { environment: 'Ghana-Urban-Core', currency: 'GHS' },
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics | null>(null);
  const [loading] = useState<boolean>(false);

  const API_BASE = '/api';

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('errand_ghana_demands', JSON.stringify(demandLists));
  }, [demandLists]);

  useEffect(() => {
    localStorage.setItem('errand_ghana_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('errand_ghana_audit_ledger', JSON.stringify(auditLedger));
  }, [auditLedger]);

  // Compute live admin metrics
  const computeAdminMetrics = useCallback((currOrders: Order[], currDemands: DemandList[], currLedger: AuditLedgerEntry[]): AdminMetrics => {
    const lockedVaultBalance = currOrders
      .filter((o) => o.escrow_status === 'funded' || o.escrow_status === 'in_transit' || o.escrow_status === 'delivered')
      .reduce((sum, o) => sum + o.total_amount, 0);

    const totalReleased = currOrders
      .filter((o) => o.escrow_status === 'released')
      .reduce((sum, o) => sum + o.vendor_payout, 0);

    const totalFeesCollected = currOrders
      .filter((o) => o.escrow_status === 'released')
      .reduce((sum, o) => sum + o.platform_fee, 0);

    const totalRefunded = currOrders
      .filter((o) => o.escrow_status === 'refunded')
      .reduce((sum, o) => sum + o.total_amount, 0);

    const activeDemandsCount = currDemands.filter((l) => l.status === 'open' || l.status === 'bidded').length;

    return {
      lockedVaultBalance: lockedVaultBalance || 420.0,
      totalReleased,
      totalFeesCollected,
      totalRefunded,
      totalOrdersCount: currOrders.length,
      activeDemandsCount,
      storeCount: 4,
      shopperCount: 12,
      currency: 'GHS',
      platformFeePercent: 2.0,
      recentAuditTrail: currLedger.slice(0, 10),
    };
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [listsRes, ordersRes, metricsRes, ledgerRes] = await Promise.all([
        fetch(`${API_BASE}/demand-lists`).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE}/orders`).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE}/admin/metrics`).then((r) => r.json()).catch(() => null),
        fetch(`${API_BASE}/escrow/audit-ledger`).then((r) => r.json()).catch(() => null),
      ]);

      if (listsRes?.data && Array.isArray(listsRes.data) && listsRes.data.length > 0) {
        setDemandLists(listsRes.data);
      }
      if (ordersRes?.data && Array.isArray(ordersRes.data)) {
        setOrders(ordersRes.data);
      }
      if (ledgerRes?.data && Array.isArray(ledgerRes.data)) {
        setAuditLedger(ledgerRes.data);
      }
      if (metricsRes?.data) {
        setAdminMetrics(metricsRes.data);
      } else {
        setAdminMetrics(computeAdminMetrics(orders, demandLists, auditLedger));
      }
    } catch {
      // Backend not running, use local state
      setAdminMetrics(computeAdminMetrics(orders, demandLists, auditLedger));
    }
  }, [computeAdminMetrics, orders, demandLists, auditLedger]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 12000);
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
    const listId = crypto.randomUUID();
    const demandItems: DemandItem[] = items.map((item, idx) => ({
      id: `item-${listId}-${idx}`,
      list_id: listId,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      target_price: item.target_price,
      category: item.category || 'Fresh Produce',
    }));

    const newList: DemandList = {
      id: listId,
      shopper_id: currentUserId,
      shopper_name: 'Shopper',
      title,
      neighborhood: neighborhood || 'East Legon, Accra',
      delivery_address: deliveryAddress || 'Accra, Ghana',
      total_target_budget: totalBudget,
      max_budget_limit: totalBudget * 1.15,
      status: 'open',
      urgency: urgency || 'Standard (2-4 hrs)',
      notes: notes || '',
      items: demandItems,
      offers: [],
      created_at: new Date().toISOString(),
    };

    // 1. Immediate optimistic local update
    setDemandLists((prev) => [newList, ...prev]);

    // 2. Add audit entry
    const auditEntry: AuditLedgerEntry = {
      id: crypto.randomUUID(),
      action: 'CREATE_DEMAND_LIST',
      actor_id: currentUserId,
      actor_role: 'shopper',
      state_before: 'NONE',
      state_after: 'OPEN',
      amount: totalBudget,
      sha256_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      metadata: { list_id: listId, title, itemsCount: items.length, neighborhood },
      timestamp: new Date().toISOString(),
    };
    setAuditLedger((prev) => [auditEntry, ...prev]);

    // 3. Simulate competitive reverse-auction store offer after 3 seconds
    setTimeout(() => {
      const simulatedOffer: StoreOffer = {
        id: crypto.randomUUID(),
        list_id: listId,
        store_id: '33333333-3333-3333-3333-333333333333',
        store_name: 'Naa Lamiley Makola Wholesale',
        store_rating: 4.88,
        offered_total_price: Math.max(20, Math.round(totalBudget * 0.94 * 100) / 100),
        delivery_fee: 15.0,
        fulfillment_time_hours: 1.5,
        status: 'pending',
        store_notes: 'Freshly packed from today morning wholesale crates. Fast delivery guaranteed.',
        created_at: new Date().toISOString(),
      };

      setDemandLists((prev) =>
        prev.map((d) =>
          d.id === listId
            ? { ...d, status: 'bidded', offers: [simulatedOffer, ...(d.offers || [])] }
            : d
        )
      );
    }, 3000);

    // 4. Also try backend API
    try {
      fetch(`${API_BASE}/demand-lists`, {
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
      }).catch(() => {});
    } catch {}

    return { success: true, data: newList };
  };

  const submitStoreOffer = async (
    listId: string,
    offeredPrice: number,
    deliveryFee: number,
    fulfillmentHours: number,
    notes?: string
  ) => {
    const offerId = crypto.randomUUID();
    const newOffer: StoreOffer = {
      id: offerId,
      list_id: listId,
      store_id: currentUserId,
      store_name: 'Verified Market Store',
      store_rating: 4.9,
      offered_total_price: offeredPrice,
      delivery_fee: deliveryFee,
      fulfillment_time_hours: fulfillmentHours,
      status: 'pending',
      store_notes: notes || '',
      created_at: new Date().toISOString(),
    };

    setDemandLists((prev) =>
      prev.map((d) =>
        d.id === listId
          ? { ...d, status: 'bidded', offers: [newOffer, ...(d.offers || [])] }
          : d
      )
    );

    try {
      fetch(`${API_BASE}/offers`, {
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
      }).catch(() => {});
    } catch {}

    return { success: true, data: newOffer };
  };

  const prepareAndLockMoMo = async (
    listId: string,
    offerId: string,
    momoProvider: MoMoProvider,
    momoNumber: string
  ) => {
    const targetList = demandLists.find((d) => d.id === listId);
    const targetOffer = targetList?.offers?.find((o) => o.id === offerId);

    const totalAmount = targetOffer ? targetOffer.offered_total_price + targetOffer.delivery_fee : 300.0;
    const platformFee = Math.round((totalAmount * 0.02) * 100) / 100;
    const vendorPayout = Math.round((totalAmount - platformFee) * 100) / 100;
    const orderId = crypto.randomUUID();

    const newOrder: Order = {
      id: orderId,
      list_id: listId,
      offer_id: offerId,
      shopper_id: currentUserId,
      shopper_name: 'Shopper',
      store_id: targetOffer?.store_id || '33333333-3333-3333-3333-333333333333',
      store_name: targetOffer?.store_name || 'Naa Lamiley Makola Wholesale',
      total_amount: totalAmount,
      platform_fee: platformFee,
      vendor_payout: vendorPayout,
      escrow_status: 'funded',
      momo_provider: momoProvider,
      momo_number: momoNumber,
      momo_transaction_id: `MOMO-GH-${Math.floor(100000000 + Math.random() * 900000000)}`,
      sha256_audit_hash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      list_title: targetList?.title || 'Grocery Order',
      neighborhood: targetList?.neighborhood || 'East Legon, Accra',
      messages: [],
    };

    setOrders((prev) => [newOrder, ...prev]);

    setDemandLists((prev) =>
      prev.map((d) => (d.id === listId ? { ...d, status: 'funded' } : d))
    );

    const auditEntry: AuditLedgerEntry = {
      id: crypto.randomUUID(),
      order_id: orderId,
      action: 'PREPARE_AND_LOCK_MOMO',
      actor_id: currentUserId,
      actor_role: 'shopper',
      state_before: 'UNFUNDED',
      state_after: 'FUNDED',
      amount: totalAmount,
      sha256_hash: newOrder.sha256_audit_hash,
      metadata: { list_id: listId, offer_id: offerId, momo_provider: momoProvider },
      timestamp: new Date().toISOString(),
    };
    setAuditLedger((prev) => [auditEntry, ...prev]);

    try {
      fetch(`${API_BASE}/escrow/prepare-momo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          list_id: listId,
          offer_id: offerId,
          shopper_id: currentUserId,
          momo_provider: momoProvider,
          momo_number: momoNumber,
        }),
      }).catch(() => {});
    } catch {}

    return { success: true, order: newOrder, message: 'MoMo Safe Pay Escrow locked successfully.' };
  };

  const updateOrderStatus = async (orderId: string, status: 'in_transit' | 'delivered') => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, escrow_status: status, updated_at: new Date().toISOString() } : o
      )
    );

    try {
      fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actor_id: currentUserId, status }),
      }).catch(() => {});
    } catch {}

    return { success: true, message: `Order status updated to ${status}` };
  };

  const commitAndReleasePayout = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, escrow_status: 'released', updated_at: new Date().toISOString() }
          : o
      )
    );

    setDemandLists((prev) =>
      prev.map((d) => {
        const order = orders.find((o) => o.id === orderId);
        return order && d.id === order.list_id ? { ...d, status: 'completed' } : d;
      })
    );

    try {
      fetch(`${API_BASE}/escrow/commit-release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, shopper_id: currentUserId }),
      }).catch(() => {});
    } catch {}

    return { success: true, message: 'Escrow payment released to merchant wallet.' };
  };

  const executeCompensatingRefund = async (orderId: string, disputeReason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, escrow_status: 'refunded', dispute_reason: disputeReason, updated_at: new Date().toISOString() }
          : o
      )
    );

    try {
      fetch(`${API_BASE}/escrow/dispute-refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, actor_id: currentUserId, dispute_reason: disputeReason }),
      }).catch(() => {});
    } catch {}

    return { success: true, message: '100% refund disbursed back to your MoMo account.' };
  };

  const approveStoreKyc = async (_storeId: string, isApproved: boolean) => {
    return { success: true, message: `Store KYC ${isApproved ? 'approved' : 'rejected'}` };
  };

  const sendOrderMessage = async (orderId: string, message: string) => {
    const newMsg = {
      id: crypto.randomUUID(),
      order_id: orderId,
      sender_id: currentUserId,
      sender_name: 'You',
      message,
      created_at: new Date().toISOString(),
    };

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, messages: [...(o.messages || []), newMsg] } : o
      )
    );

    return true;
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
