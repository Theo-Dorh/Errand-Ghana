// Server Type Definitions for ERRAND GHANA

export type UserRole = 'shopper' | 'store' | 'admin';
export type DemandStatus = 'open' | 'bidded' | 'accepted' | 'funded' | 'delivered' | 'completed' | 'cancelled';
export type OfferStatus = 'pending' | 'accepted' | 'rejected';
export type EscrowStatus = 'created' | 'funded' | 'in_transit' | 'delivered' | 'released' | 'refunded';
export type MoMoProvider = 'MTN_MOMO' | 'TELECEL_CASH' | 'AT_MONEY';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  momo_number: string;
  momo_provider: MoMoProvider;
  store_name?: string;
  neighborhood: string;
  rating: number;
  is_approved: boolean;
  kyc_ghana_card?: string;
  created_at: string;
}

export interface DemandItem {
  id: string;
  list_id: string;
  name: string;
  quantity: number;
  unit: string;
  target_price: number;
  category: string;
  created_at?: string;
}

export interface DemandList {
  id: string;
  shopper_id: string;
  shopper_name?: string;
  title: string;
  neighborhood: string;
  delivery_address: string;
  total_target_budget: number;
  max_budget_limit?: number;
  status: DemandStatus;
  urgency: string;
  notes?: string;
  items?: DemandItem[];
  offers?: StoreOffer[];
  created_at: string;
}

export interface StoreOffer {
  id: string;
  list_id: string;
  store_id: string;
  store_name?: string;
  store_rating?: number;
  offered_total_price: number;
  delivery_fee: number;
  fulfillment_time_hours: number;
  status: OfferStatus;
  store_notes?: string;
  created_at: string;
}

export interface Order {
  id: string;
  list_id: string;
  offer_id: string;
  shopper_id: string;
  shopper_name?: string;
  store_id: string;
  store_name?: string;
  total_amount: number;
  platform_fee: number;
  vendor_payout: number;
  escrow_status: EscrowStatus;
  momo_provider: MoMoProvider;
  momo_number: string;
  momo_transaction_id?: string;
  dispute_reason?: string;
  sha256_audit_hash: string;
  created_at: string;
  updated_at: string;
  list_title?: string;
  neighborhood?: string;
}

export interface OrderMessage {
  id: string;
  order_id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

export interface AuditLedgerEntry {
  id: string;
  order_id?: string;
  action: string;
  actor_id: string;
  actor_role: string;
  state_before?: string;
  state_after: string;
  amount?: number;
  sha256_hash: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface MLPriceBenchmarkResult {
  itemName: string;
  shopperBudgetValue: number;
  storeOfferValue: number;
  accraRetailBenchmark: number; // 1.18x multiplier
  supermarketVariancePercent: number;
  consumerSavingsGHS: number;
  mlConfidenceScore: number;
  volatilityIndex: 'Low' | 'Moderate' | 'High';
  recommendation: string;
}
