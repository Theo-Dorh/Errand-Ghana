# REST API & Distributed Escrow Specification
## ERRAND GHANA: Express.js REST Endpoints & Schemas

- **Course**: CSCD 602: Advanced Software Engineering, University of Ghana, Legon
- **Developer / Student**: Theophilus Dorh (Student ID: `22425676`)

---

## 1. Base URL
`http://localhost:3001/api`

---

## 2. Endpoints Directory

### 2.1 Demand Lists
- `GET /api/demand-lists`
  - **Query Params**: `neighborhood` (optional), `status` (optional)
  - **Response**: `{ success: true, count: number, data: DemandList[] }`

- `POST /api/demand-lists`
  - **Body**: `{ shopper_id, title, neighborhood, delivery_address, total_target_budget, urgency, notes, items }`
  - **Response (201)**: `{ success: true, message: string, data: DemandList }`

### 2.2 Store Offers
- `GET /api/offers?list_id=:list_id`
  - **Response**: `{ success: true, count: number, data: StoreOffer[] }`

- `POST /api/offers`
  - **Body**: `{ list_id, store_id, offered_total_price, delivery_fee, fulfillment_time_hours, store_notes }`
  - **Response (201)**: `{ success: true, message: string, data: StoreOffer }`

### 2.3 Orders & Coordination
- `GET /api/orders`
  - **Query Params**: `shopper_id`, `store_id`, `escrow_status`
  - **Response**: `{ success: true, data: Order[] }`

- `PATCH /api/orders/:id/status`
  - **Body**: `{ actor_id, status: 'in_transit' | 'delivered' }`
  - **Response**: `{ success: true, order: Order, message: string }`

### 2.4 Distributed 2PC Escrow Engine
- `POST /api/escrow/prepare-momo` (Phase 1 Lock)
  - **Body**: `{ list_id, offer_id, shopper_id, momo_provider, momo_number }`
  - **Response (200)**: `{ success: true, order: Order, message: string }`

- `POST /api/escrow/commit-release` (Phase 2 Commit)
  - **Body**: `{ order_id, shopper_id }`
  - **Response (200)**: `{ success: true, order: Order, message: string }`

- `POST /api/escrow/dispute-refund` (Saga Compensating Rollback)
  - **Body**: `{ order_id, actor_id, dispute_reason }`
  - **Response (200)**: `{ success: true, order: Order, message: string }`

- `GET /api/escrow/audit-ledger`
  - **Query Params**: `order_id` (optional)
  - **Response**: `{ success: true, data: AuditLedgerEntry[] }`

### 2.5 Machine Learning Benchmark
- `GET /api/ml/price-benchmark`
  - **Query Params**: `itemName`, `category`, `shopperBudget`, `storeOffer`
  - **Response**: `{ success: true, data: MLPriceBenchmarkResult }`
