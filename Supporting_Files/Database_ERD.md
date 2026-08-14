# Database Entity-Relationship Diagram (ERD)
## ERRAND GHANA: PostgreSQL 15 & Supabase Data Model

- **Course**: CSCD 602: Advanced Software Engineering, University of Ghana, Legon
- **Developer / Student**: Theophilus Dorh (Student ID: `22425676`)

---

```mermaid
erDiagram
    PROFILES ||--o{ DEMAND_LISTS : "creates (shopper)"
    PROFILES ||--o{ STORE_OFFERS : "submits (store)"
    PROFILES ||--o{ ORDERS : "participates (shopper/store)"
    PROFILES ||--o{ AUDIT_LEDGER : "acts as actor"
    
    DEMAND_LISTS ||--|{ DEMAND_ITEMS : "contains itemized manifests"
    DEMAND_LISTS ||--o{ STORE_OFFERS : "receives bids"
    DEMAND_LISTS ||--o| ORDERS : "fulfills order"
    
    STORE_OFFERS ||--o| ORDERS : "accepted into"
    
    ORDERS ||--o{ ORDER_MESSAGES : "contains chat coordination"
    ORDERS ||--o{ AUDIT_LEDGER : "logs state transitions"

    PROFILES {
        uuid id PK
        text email
        text full_name
        user_role role
        varchar momo_number
        momo_provider momo_provider
        text store_name
        text neighborhood
        numeric rating
        boolean is_approved
        varchar kyc_ghana_card
        timestamptz created_at
    }

    DEMAND_LISTS {
        uuid id PK
        uuid shopper_id FK
        text title
        text neighborhood
        text delivery_address
        numeric total_target_budget
        numeric max_budget_limit
        demand_status status
        text urgency
        text notes
        timestamptz created_at
    }

    DEMAND_ITEMS {
        uuid id PK
        uuid list_id FK
        text name
        numeric quantity
        varchar unit
        numeric target_price
        varchar category
        timestamptz created_at
    }

    STORE_OFFERS {
        uuid id PK
        uuid list_id FK
        uuid store_id FK
        numeric offered_total_price
        numeric delivery_fee
        numeric fulfillment_time_hours
        offer_status status
        text store_notes
        timestamptz created_at
    }

    ORDERS {
        uuid id PK
        uuid list_id FK
        uuid offer_id FK
        uuid shopper_id FK
        uuid store_id FK
        numeric total_amount
        numeric platform_fee
        numeric vendor_payout
        escrow_status escrow_status
        momo_provider momo_provider
        varchar momo_number
        varchar momo_transaction_id
        text dispute_reason
        varchar sha256_audit_hash
        timestamptz created_at
    }

    AUDIT_LEDGER {
        uuid id PK
        uuid order_id FK
        text action
        uuid actor_id FK
        text actor_role
        text state_before
        text state_after
        numeric amount
        varchar sha256_hash
        jsonb metadata
        timestamptz timestamp
    }
```
