# Software Requirements Specification (SRS)
## ERRAND GHANA: Demand-Led C2B Grocery Marketplace & 2PC Mobile Money Escrow Engine

- **Course**: CSCD 602: Advanced Software Engineering, University of Ghana, Legon
- **Developer / Student**: Theophilus Dorh (Student ID: `22425676`)
- **Target Repository**: `https://github.com/Theo-Dorh/Errand-Ghana`
- **Document Version**: 1.0.0
- **Standard**: Conforming to IEEE 830-1998 Recommended Practice for Software Requirements Specifications

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for **ERRAND GHANA**, an enterprise-grade C2B demand reverse-auction grocery marketplace and Distributed Saga Two-Phase Commit (2PC) Mobile Money Escrow Engine tailored to the Ghanaian urban commercial ecosystem (Accra and Kumasi).

### 1.2 Scope of the System
The platform enables urban consumers (shoppers) to express itemized demand manifests using customary Ghanaian volumetric measures (`Olonka`, `Margarine Tin`, `Paint Bucket`, `Tubers`, `Crates`) with consumer price ceilings. Registered and KYC-verified wholesale merchants compete through real-time reverse auction bidding. Transactions are mediated by a 2PC Mobile Money Escrow Engine that guarantees zero counterparty default risk by locking buyer funds in neutral escrow (Phase 1) and releasing vendor payouts only after physical goods inspection (Phase 2).

### 1.3 Definitions, Acronyms, and Abbreviations
- **C2B**: Consumer-to-Business (Demand-led reverse auction).
- **2PC**: Two-Phase Commit distributed transaction protocol.
- **Saga**: Distributed transaction pattern executing sequential local transactions with automated compensating rollbacks.
- **MoMo**: Mobile Money (MTN Mobile Money, Telecel Cash, AT Money).
- **Olonka**: Standard Ghanaian dry volume measurement tin (~2.5 kg).
- **RLS**: Row-Level Security in PostgreSQL.
- **SHA-256**: Secure Hash Algorithm generating 256-bit cryptographic digest.

---

## 2. Overall Description

### 2.1 Product Perspective & Context
ERRAND GHANA operates at the intersection of informal open-air wholesale hubs (Makola, Madina, Kaneshie, Kejetia) and modern digital mobile payment switches. The system integrates with three major Ghanaian telecommunication payment rails (MTN *170#, Telecel *110#, AT *110#) and provides machine learning pricing benchmarks against modern formal supermarkets (Shoprite, Melcom, Koala).

### 2.2 User Personas & Roles
1. **C2B Shopper**: Creates demand lists, sets price ceilings, evaluates bids, locks escrow deposits via USSD, conducts physical inspection upon delivery, and authorizes payout release or disputes.
2. **Store Merchant**: Monitors real-time market demand feed, filters by urban neighborhood, places competitive bids, dispatches orders, and receives direct wallet settlements.
3. **Escrow Auditor / Platform Admin**: Supervises platform liquidity, validates merchant KYC (Ghana Card), arbitrates disputes, and audits SHA-256 cryptographic ledgers.

---

## 3. Specific Functional Requirements

### 3.1 Demand Engine Subsystem
- **`[SRS-REQ-DEMAND-001]`**: The system shall permit authenticated shoppers to create itemized demand baskets specifying item name, quantity, customary Ghanaian units (`Olonka`, `Margarine Tin`, `Paint Bucket`, `Tubers`, `Crate`, `kg`, `Liter`), category, and target unit price.
- **`[SRS-REQ-DEMAND-002]`**: The system shall enforce a mandatory delivery address, landmark reference, and fulfillment urgency tier (`Express 1-2 hrs`, `Standard 2-4 hrs`, `Flexible`).
- **`[SRS-REQ-DEMAND-003]`**: The system shall automatically aggregate published demand lists into a real-time market board accessible to verified merchants.

### 3.2 Machine Learning Price Benchmark Subsystem
- **`[SRS-FEAT-ML-002]`**: The system shall calculate an Accra Supermarket Retail Benchmark by applying a 1.18x multiplier against open-air market wholesale baselines.
- **`[SRS-FEAT-ML-003]`**: The system shall assign confidence scores (80%–99%) based on category volatility indices (e.g. Fresh Produce = High Volatility; Grains = Low Volatility).
- **`[SRS-FEAT-ML-004]`**: The visualizer shall render comparative bars contrasting Shopper Budget, Store Bid, and Supermarket Benchmark with consumer net savings.

### 3.3 Two-Phase Commit (2PC) Escrow Subsystem
- **`[SRS-REQ-ESCROW-003]`**: Phase 1 (Prepare / Lock): Upon bid acceptance, the engine shall initiate a simulated/live Mobile Money transaction, lock 100% of the funds in the platform vault, deduct a 2% platform fee, transition order state to `funded`, and calculate an immutable SHA-256 audit hash.
- **`[SRS-REQ-ESCROW-004]`**: Phase 2 (Commit / Release): Upon customer goods verification, the engine shall execute the commit phase, transferring `vendor_payout = total_amount - platform_fee` directly to the merchant wallet and transitioning state to `released`.
- **`[SRS-REQ-SAGA-005]`**: Saga Compensating Rollback: If a delivery fails, goods are rejected, or dispute is arbitrated, the orchestrator shall execute a compensating transaction refunding 100% of principal to the shopper's wallet and transitioning state to `refunded`.

### 3.4 Cryptographic Audit Subsystem
- **`[SRS-REQ-AUDIT-006]`**: Every state transition shall generate an immutable entry in `audit_ledger` containing the actor ID, action name, before/after states, monetary value, and a 64-character SHA-256 cryptographic digest.
- **`[SRS-REQ-AUDIT-007]`**: The system shall generate printable and downloadable digital receipts containing transaction IDs, non-repudiation hashes, and verification QR codes.

---

## 4. Non-Functional Requirements

### 4.1 Security & Authentication
- All database tables shall enforce Row Level Security (RLS) policies ensuring users access only authorized records.
- Passwords and sensitive payloads shall be hashed using modern cryptographic standards.

### 4.2 Performance & Scalability
- The Express API and Saga Orchestrator shall handle state transitions in under 100ms.
- The UI shall achieve First Contentful Paint (FCP) in under 1.2 seconds.

### 4.3 Availability & Fault Tolerance
- In the absence of live Supabase PostgreSQL credentials, the system shall seamlessly fall back to an in-memory transactional store with zero downtime.
