import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import {
  UserProfile,
  DemandList,
  DemandItem,
  DemandStatus,
  StoreOffer,
  Order,
  OrderMessage,
  AuditLedgerEntry,
} from '../types/index.ts';

class StorageService {
  private supabase: SupabaseClient | null = null;
  private isSupabaseConnected = false;

  // In-memory data store for local execution & fallback
  private profiles: Map<string, UserProfile> = new Map();
  private demandLists: Map<string, DemandList> = new Map();
  private demandItems: Map<string, DemandItem> = new Map();
  private storeOffers: Map<string, StoreOffer> = new Map();
  private orders: Map<string, Order> = new Map();
  private orderMessages: Map<string, OrderMessage> = new Map();
  private auditLedger: AuditLedgerEntry[] = [];

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.isSupabaseConnected = true;
        console.log('⚡ Connected to Supabase PostgreSQL Database');
      } catch (err) {
        console.warn('⚠️ Supabase connection failed. Falling back to in-memory state engine.');
        this.isSupabaseConnected = false;
      }
    } else {
      console.log('ℹ️ Operating in Standalone In-Memory Mode with pre-seeded Ghanaian market data');
    }

    this.seedInitialData();
  }

  public getIsSupabaseConnected(): boolean {
    return this.isSupabaseConnected;
  }

  public getSupabaseClient(): SupabaseClient | null {
    return this.supabase;
  }

  private seedInitialData() {
    // 1. Seed Profiles
    const kofiShopper: UserProfile = {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'shopper.kofi@ug.edu.gh',
      full_name: 'Kofi Mensah',
      role: 'shopper',
      momo_number: '0244123456',
      momo_provider: 'MTN_MOMO',
      neighborhood: 'East Legon',
      rating: 4.95,
      is_approved: true,
      created_at: new Date().toISOString(),
    };

    const amaShopper: UserProfile = {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'shopper.ama@gmail.com',
      full_name: 'Ama Serwaa',
      role: 'shopper',
      momo_number: '0501987654',
      momo_provider: 'TELECEL_CASH',
      neighborhood: 'Madina',
      rating: 4.90,
      is_approved: true,
      created_at: new Date().toISOString(),
    };

    const naaStore: UserProfile = {
      id: '33333333-3333-3333-3333-333333333333',
      email: 'makola.fresh@gmail.com',
      full_name: 'Auntie Naa Baskets',
      role: 'store',
      store_name: 'Naa Lamiley Makola Wholesale',
      momo_number: '0249876543',
      momo_provider: 'MTN_MOMO',
      neighborhood: 'Makola Market',
      rating: 4.88,
      is_approved: true,
      kyc_ghana_card: 'GHA-723910293-8',
      created_at: new Date().toISOString(),
    };

    const joeStore: UserProfile = {
      id: '44444444-4444-4444-4444-444444444444',
      email: 'kaneshie.mart@gmail.com',
      full_name: 'Uncle Joe Coldstore & Tubers',
      role: 'store',
      store_name: 'Kaneshie Organic Hub',
      momo_number: '0265551234',
      momo_provider: 'AT_MONEY',
      neighborhood: 'Kaneshie',
      rating: 4.75,
      is_approved: true,
      kyc_ghana_card: 'GHA-519283741-2',
      created_at: new Date().toISOString(),
    };

    const adminProfile: UserProfile = {
      id: '55555555-5555-5555-5555-555555555555',
      email: 'admin.escrow@errandghana.ug.edu.gh',
      full_name: 'Prof. Boateng (Escrow Auditor)',
      role: 'admin',
      momo_number: '0240001122',
      momo_provider: 'MTN_MOMO',
      store_name: 'ERRAND GHANA Central Vault',
      neighborhood: 'University of Ghana, Legon',
      rating: 5.0,
      is_approved: true,
      created_at: new Date().toISOString(),
    };

    this.profiles.set(kofiShopper.id, kofiShopper);
    this.profiles.set(amaShopper.id, amaShopper);
    this.profiles.set(naaStore.id, naaStore);
    this.profiles.set(joeStore.id, joeStore);
    this.profiles.set(adminProfile.id, adminProfile);

    // 2. Seed Demand Lists
    const list1: DemandList = {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      shopper_id: kofiShopper.id,
      shopper_name: kofiShopper.full_name,
      title: 'Sunday Jollof & Fresh Soup Basket',
      neighborhood: 'East Legon',
      delivery_address: 'Boundary Road, near Mensvic Hotel, Accra',
      total_target_budget: 385.0,
      max_budget_limit: 420.0,
      status: 'open',
      urgency: 'Express (1-2 hrs)',
      notes: 'Require fresh firm tomatoes and authentic local fragrant rice.',
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    };

    const list2: DemandList = {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      shopper_id: amaShopper.id,
      shopper_name: amaShopper.full_name,
      title: 'Hostel Bulk Tubers & Palm Oil Restock',
      neighborhood: 'Madina',
      delivery_address: 'UG Legon, Pentagon Block B, Room 314',
      total_target_budget: 260.0,
      max_budget_limit: 290.0,
      status: 'open',
      urgency: 'Standard (2-4 hrs)',
      notes: 'Tubers should be genuine Pona yams from Techiman batch.',
      created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    };

    const list3: DemandList = {
      id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      shopper_id: kofiShopper.id,
      shopper_name: kofiShopper.full_name,
      title: 'Kumasi Fresh Garden Eggs & Plantain Batch',
      neighborhood: 'Kejetia Market',
      delivery_address: 'KNUST Campus, Hall 7, Kumasi',
      total_target_budget: 195.0,
      max_budget_limit: 220.0,
      status: 'open',
      urgency: 'Flexible (Today)',
      notes: 'Apem plantains, semi-ripe for plantain chips and boiled ampesi.',
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    };

    this.demandLists.set(list1.id, list1);
    this.demandLists.set(list2.id, list2);
    this.demandLists.set(list3.id, list3);

    // 3. Seed Items
    const items: DemandItem[] = [
      { id: 'a1111111-1111-1111-1111-111111111111', list_id: list1.id, name: 'Ghana Royal Jasmine Rice (5kg)', quantity: 1, unit: 'Bag (5kg)', target_price: 145.0, category: 'Grains & Cereals' },
      { id: 'a2222222-2222-2222-2222-222222222222', list_id: list1.id, name: 'Fresh Navrongo Firm Tomatoes', quantity: 1, unit: 'Olonka', target_price: 75.0, category: 'Fresh Produce' },
      { id: 'a3333333-3333-3333-3333-333333333333', list_id: list1.id, name: 'Pure Zomi Red Palm Oil', quantity: 2, unit: 'Liter', target_price: 65.0, category: 'Oils & Spices' },
      { id: 'a4444444-4444-4444-4444-444444444444', list_id: list1.id, name: 'Fresh Smoked Bonny Catfish', quantity: 1, unit: 'Kg', target_price: 100.0, category: 'Meat & Fish' },
      { id: 'b1111111-1111-1111-1111-111111111111', list_id: list2.id, name: 'Techiman Pona Sweet Yams', quantity: 5, unit: 'Tubers', target_price: 160.0, category: 'Tubers' },
      { id: 'b2222222-2222-2222-2222-222222222222', list_id: list2.id, name: 'Fresh Red Scotch Bonnet Pepper (Kpakpo Shito)', quantity: 1, unit: 'Margarine Tin', target_price: 40.0, category: 'Fresh Produce' },
      { id: 'b3333333-3333-3333-3333-333333333333', list_id: list2.id, name: 'Local Shallots & Purple Onions', quantity: 1, unit: 'Paint Bucket', target_price: 60.0, category: 'Fresh Produce' },
      { id: 'c1111111-1111-1111-1111-111111111111', list_id: list3.id, name: 'Green & Semi-Ripe Apem Plantain', quantity: 2, unit: 'Bunch', target_price: 110.0, category: 'Tubers' },
      { id: 'c2222222-2222-2222-2222-222222222222', list_id: list3.id, name: 'Fresh Green Garden Eggs (Ntrowa)', quantity: 1, unit: 'Olonka', target_price: 45.0, category: 'Fresh Produce' },
      { id: 'c3333333-3333-3333-3333-333333333333', list_id: list3.id, name: 'Momoni (Fermented Salt Fish Seasoning)', quantity: 3, unit: 'Pieces', target_price: 40.0, category: 'Meat & Fish' },
    ];

    items.forEach((item) => this.demandItems.set(item.id, item));

    // 4. Seed Offer
    const offer1: StoreOffer = {
      id: 'offer-111-222-333',
      list_id: list1.id,
      store_id: naaStore.id,
      store_name: naaStore.store_name,
      store_rating: naaStore.rating,
      offered_total_price: 375.0,
      delivery_fee: 15.0,
      fulfillment_time_hours: 1.5,
      status: 'pending',
      store_notes: 'Direct from Makola wholesale crates. Includes fresh kpakpo shito bonus.',
      created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    };

    this.storeOffers.set(offer1.id, offer1);

    // Seed Audit Entry
    this.recordAuditEntry({
      action: 'SYSTEM_BOOTSTRAP',
      actor_id: adminProfile.id,
      actor_role: 'system_admin',
      state_before: 'UNINITIALIZED',
      state_after: 'READY',
      metadata: { environment: 'Ghana-Urban-Core', currency: 'GHS' },
    });
  }

  // --- Profile Operations ---
  public getProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }

  public getProfileById(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  public createProfile(profileData: Omit<UserProfile, 'id' | 'created_at'>): UserProfile {
    const id = crypto.randomUUID();
    const newProfile: UserProfile = {
      id,
      ...profileData,
      rating: profileData.rating ?? 5.0,
      is_approved: profileData.is_approved ?? true,
      created_at: new Date().toISOString(),
    };
    this.profiles.set(id, newProfile);

    this.recordAuditEntry({
      action: 'ADMIN_CREATE_USER_ROLE',
      actor_id: '55555555-5555-5555-5555-555555555555',
      actor_role: 'admin',
      state_before: 'NONE',
      state_after: newProfile.role.toUpperCase(),
      metadata: { user_id: id, email: newProfile.email, role: newProfile.role, full_name: newProfile.full_name },
    });

    return newProfile;
  }

  public updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const profile = this.profiles.get(id);
    if (!profile) return null;
    const updated = { ...profile, ...updates };
    this.profiles.set(id, updated);
    return updated;
  }

  public deleteProfile(id: string): boolean {
    return this.profiles.delete(id);
  }

  // --- Demand Lists Operations ---
  public getDemandLists(filters?: { neighborhood?: string; category?: string; status?: string }): DemandList[] {
    let lists = Array.from(this.demandLists.values());

    if (filters?.status) {
      lists = lists.filter((l) => l.status === filters.status);
    }
    if (filters?.neighborhood && filters.neighborhood !== 'ALL') {
      lists = lists.filter((l) => l.neighborhood.toLowerCase().includes(filters.neighborhood!.toLowerCase()));
    }

    return lists.map((list) => {
      const items = Array.from(this.demandItems.values()).filter((i) => i.list_id === list.id);
      const offers = Array.from(this.storeOffers.values()).filter((o) => o.list_id === list.id);
      return {
        ...list,
        items,
        offers,
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getDemandListById(id: string): DemandList | undefined {
    const list = this.demandLists.get(id);
    if (!list) return undefined;
    const items = Array.from(this.demandItems.values()).filter((i) => i.list_id === list.id);
    const offers = Array.from(this.storeOffers.values()).filter((o) => o.list_id === list.id);
    return { ...list, items, offers };
  }

  public updateDemandListStatus(listId: string, status: DemandStatus): DemandList | null {
    const list = this.demandLists.get(listId);
    if (!list) return null;
    list.status = status;
    this.demandLists.set(listId, list);
    return list;
  }

  public createDemandList(
    shopperId: string,
    title: string,
    neighborhood: string,
    deliveryAddress: string,
    totalBudget: number,
    urgency: string,
    notes: string,
    rawItems: Array<{ name: string; quantity: number; unit: string; target_price: number; category: string }>
  ): DemandList {
    const shopper = this.profiles.get(shopperId);
    const listId = crypto.randomUUID();

    const newList: DemandList = {
      id: listId,
      shopper_id: shopperId,
      shopper_name: shopper ? shopper.full_name : 'Shopper',
      title,
      neighborhood,
      delivery_address: deliveryAddress,
      total_target_budget: totalBudget,
      max_budget_limit: totalBudget * 1.1,
      status: 'open',
      urgency: urgency || 'Standard (2-4 hrs)',
      notes,
      created_at: new Date().toISOString(),
    };

    this.demandLists.set(listId, newList);

    const savedItems: DemandItem[] = rawItems.map((item) => {
      const itemId = crypto.randomUUID();
      const dItem: DemandItem = {
        id: itemId,
        list_id: listId,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        target_price: item.target_price,
        category: item.category || 'Fresh Produce',
        created_at: new Date().toISOString(),
      };
      this.demandItems.set(itemId, dItem);
      return dItem;
    });

    this.recordAuditEntry({
      action: 'CREATE_DEMAND_LIST',
      actor_id: shopperId,
      actor_role: 'shopper',
      state_before: 'NONE',
      state_after: 'OPEN',
      amount: totalBudget,
      metadata: { list_id: listId, title, itemsCount: savedItems.length, neighborhood },
    });

    return { ...newList, items: savedItems, offers: [] };
  }

  // --- Offers Operations ---
  public createStoreOffer(
    listId: string,
    storeId: string,
    offeredPrice: number,
    deliveryFee: number,
    fulfillmentTimeHours: number,
    storeNotes?: string
  ): StoreOffer {
    const store = this.profiles.get(storeId);
    const list = this.demandLists.get(listId);
    const offerId = crypto.randomUUID();

    const offer: StoreOffer = {
      id: offerId,
      list_id: listId,
      store_id: storeId,
      store_name: store?.store_name || store?.full_name || 'Verified Merchant',
      store_rating: store?.rating || 4.8,
      offered_total_price: offeredPrice,
      delivery_fee: deliveryFee,
      fulfillment_time_hours: fulfillmentTimeHours,
      status: 'pending',
      store_notes: storeNotes || '',
      created_at: new Date().toISOString(),
    };

    this.storeOffers.set(offerId, offer);

    if (list && list.status === 'open') {
      list.status = 'bidded';
      this.demandLists.set(list.id, list);
    }

    this.recordAuditEntry({
      action: 'SUBMIT_STORE_OFFER',
      actor_id: storeId,
      actor_role: 'store_merchant',
      state_before: 'PENDING_OFFER',
      state_after: 'OFFER_SUBMITTED',
      amount: offeredPrice + deliveryFee,
      metadata: { list_id: listId, offer_id: offerId, store_name: offer.store_name },
    });

    return offer;
  }

  public getOffersByListId(listId: string): StoreOffer[] {
    return Array.from(this.storeOffers.values()).filter((o) => o.list_id === listId);
  }

  public getOfferById(id: string): StoreOffer | undefined {
    return this.storeOffers.get(id);
  }

  // --- Orders & 2PC Escrow Operations ---
  public getOrders(filters?: { shopper_id?: string; store_id?: string; escrow_status?: string }): Order[] {
    let orders = Array.from(this.orders.values());

    if (filters?.shopper_id) {
      orders = orders.filter((o) => o.shopper_id === filters.shopper_id);
    }
    if (filters?.store_id) {
      orders = orders.filter((o) => o.store_id === filters.store_id);
    }
    if (filters?.escrow_status) {
      orders = orders.filter((o) => o.escrow_status === filters.escrow_status);
    }

    return orders.map((o) => {
      const list = this.demandLists.get(o.list_id);
      const store = this.profiles.get(o.store_id);
      const shopper = this.profiles.get(o.shopper_id);
      return {
        ...o,
        list_title: list?.title || 'Grocery Demand List',
        neighborhood: list?.neighborhood || 'Accra',
        store_name: store?.store_name || store?.full_name || 'Store Merchant',
        shopper_name: shopper?.full_name || 'Shopper',
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    const o = this.orders.get(id);
    if (!o) return undefined;
    const list = this.demandLists.get(o.list_id);
    const store = this.profiles.get(o.store_id);
    const shopper = this.profiles.get(o.shopper_id);
    return {
      ...o,
      list_title: list?.title || 'Grocery Demand List',
      neighborhood: list?.neighborhood || 'Accra',
      store_name: store?.store_name || store?.full_name || 'Store Merchant',
      shopper_name: shopper?.full_name || 'Shopper',
    };
  }

  public saveOrder(order: Order): Order {
    this.orders.set(order.id, order);
    return order;
  }

  // --- Order Messages ---
  public getOrderMessages(orderId: string): OrderMessage[] {
    return Array.from(this.orderMessages.values())
      .filter((m) => m.order_id === orderId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  public addOrderMessage(orderId: string, senderId: string, senderName: string, message: string): OrderMessage {
    const msgId = crypto.randomUUID();
    const msg: OrderMessage = {
      id: msgId,
      order_id: orderId,
      sender_id: senderId,
      sender_name: senderName,
      message,
      created_at: new Date().toISOString(),
    };
    this.orderMessages.set(msgId, msg);
    return msg;
  }

  // --- Audit Ledger Operations ---
  public recordAuditEntry(entry: {
    order_id?: string;
    action: string;
    actor_id: string;
    actor_role: string;
    state_before?: string;
    state_after: string;
    amount?: number;
    metadata?: Record<string, any>;
  }): AuditLedgerEntry {
    const timestamp = new Date().toISOString();
    const rawPayload = `${entry.order_id || 'SYS'}|${entry.action}|${entry.actor_id}|${entry.state_after}|${entry.amount || 0}|${timestamp}`;
    const sha256_hash = crypto.createHash('sha256').update(rawPayload).digest('hex');

    const auditEntry: AuditLedgerEntry = {
      id: crypto.randomUUID(),
      order_id: entry.order_id,
      action: entry.action,
      actor_id: entry.actor_id,
      actor_role: entry.actor_role,
      state_before: entry.state_before,
      state_after: entry.state_after,
      amount: entry.amount,
      sha256_hash,
      metadata: entry.metadata || {},
      timestamp,
    };

    this.auditLedger.unshift(auditEntry);
    return auditEntry;
  }

  public getAuditLedger(orderId?: string): AuditLedgerEntry[] {
    if (orderId) {
      return this.auditLedger.filter((e) => e.order_id === orderId);
    }
    return this.auditLedger;
  }

  // --- Admin Metrics ---
  public getAdminMetrics() {
    const allOrders = Array.from(this.orders.values());
    const lockedVaultBalance = allOrders
      .filter((o) => o.escrow_status === 'funded' || o.escrow_status === 'in_transit' || o.escrow_status === 'delivered')
      .reduce((sum, o) => sum + o.total_amount, 0);

    const totalReleased = allOrders
      .filter((o) => o.escrow_status === 'released')
      .reduce((sum, o) => sum + o.vendor_payout, 0);

    const totalFeesCollected = allOrders
      .filter((o) => o.escrow_status === 'released')
      .reduce((sum, o) => sum + o.platform_fee, 0);

    const totalRefunded = allOrders
      .filter((o) => o.escrow_status === 'refunded')
      .reduce((sum, o) => sum + o.total_amount, 0);

    const activeDemandsCount = Array.from(this.demandLists.values()).filter((l) => l.status === 'open' || l.status === 'bidded').length;
    const storeCount = Array.from(this.profiles.values()).filter((p) => p.role === 'store').length;
    const shopperCount = Array.from(this.profiles.values()).filter((p) => p.role === 'shopper').length;

    return {
      lockedVaultBalance,
      totalReleased,
      totalFeesCollected,
      totalRefunded,
      totalOrdersCount: allOrders.length,
      activeDemandsCount,
      storeCount,
      shopperCount,
      currency: 'GHS',
      platformFeePercent: 2.0,
      recentAuditTrail: this.auditLedger.slice(0, 10),
    };
  }
}

export const storageService = new StorageService();
