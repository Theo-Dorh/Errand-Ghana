# 🇬🇭 ERRAND GHANA
### Production-Grade C2B Demand Marketplace & Mobile Money 2PC Escrow Engine

[![CSCD 602](https://img.shields.io/badge/Course-CSCD%20602%3A%20Advanced%20Software%20Engineering-green.svg)](https://www.ug.edu.gh)
[![University of Ghana](https://img.shields.io/badge/Institution-University%20of%20Ghana%2C%20Legon-gold.svg)](https://www.ug.edu.gh)
[![Vitest](https://img.shields.io/badge/Tests-100%25%20Passing-emerald.svg)](https://vitest.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🏛️ Project Metadata & Attribution
- **Project Title**: ERRAND GHANA: Demand-Led C2B Grocery Marketplace & Mobile Money Escrow Engine
- **Developer / Student Name**: Theophilus Dorh
- **Student ID**: `22425676`
- **Course**: CSCD 602: Advanced Software Engineering, University of Ghana, Legon
- **Department**: Department of Computer Science
- **GitHub Target Repository**: [https://github.com/Theo-Dorh/Errand-Ghana](https://github.com/Theo-Dorh/Errand-Ghana)

---

## 🌟 Executive Summary

Urban grocery commerce in Ghanaian metropolitan centers (Accra & Kumasi) is plagued by two structural inefficiencies:
1. **Severe Retail Price Markups**: Supermarkets (e.g. Shoprite, Melcom, Koala) maintain an average **1.18x (18%+) markup** over open-air wholesale hubs (Makola, Madina, Agbogbloshie, Kejetia).
2. **Prepayment Counterparty Risk**: In peer-to-peer delivery, consumers fear paying upfront via Mobile Money (MTN MoMo, Telecel Cash, AT Money) due to substandard perishable quality or ghost vendors, while merchants refuse cash-on-delivery due to rider robbery and order abandonment.

**ERRAND GHANA** solves this dilemma through a **Consumer-to-Business (C2B) Reverse-Auction Marketplace** coupled with an automated **Distributed Saga Two-Phase Commit (2PC) Mobile Money Escrow Engine**. Consumers post itemized grocery baskets with indigenous volume units (`Olonka`, `Margarine Tin`, `Paint Bucket`, `Tubers`, `Crates`), vetted market merchants place competitive bids against real-time ML price benchmarks, and funds remain cryptographically locked in a neutral platform vault until the shopper physically inspects and confirms the delivery.

---

## 🏗️ System Architecture & 2PC Saga Protocol

```
                                  [ C2B CONSUMER / SHOPPER ]
                                              │
                      1. Post Grocery Demand  │  4. Authorize Phase 1 Lock
                      (Itemized Units/Budget) │     (MTN / Telecel / AT MoMo)
                                              ▼
                         ┌──────────────────────────────────────────┐
                         │      ERRAND GHANA SAGA ORCHESTRATOR      │
                         │    (Node.js / Express + TypeScript)     │
                         └─────┬──────────────────────────────┬─────┘
                               │                              │
          2. Aggregate Demands │ 3. ML Benchmark Bids         │ 5. Lock Escrow Deposit
             to Market Feed    │    (1.18x Supermarket)       │    in Neutral Vault
                               ▼                              ▼
                    ┌─────────────────────┐       ┌────────────────────────┐
                    │   STORE MERCHANTS   │       │  PLATFORM ESCROW VAULT │
                    │  (Makola / Madina)  │       │ (SHA-256 Audit Ledger) │
                    └──────────┬──────────┘       └───────────┬────────────┘
                               │                              │
                               │ 6. Pack & Dispatch Goods     │
                               │    (In-Transit Tracking)     │
                               ▼                              │
                    ┌─────────────────────┐                   │
                    │ PHYSICAL INSPECTION │                   │
                    │  (Quality/Quantity) │                   │
                    └──────────┬──────────┘                   │
                               │                              │
       ┌───────────────────────┴──────────────────────────────┴────────────────────────┐
       │                                                                              │
       ▼ [Case A: Goods Approved]                                                     ▼ [Case B: Dispute / Breach]
┌──────────────────────────────────────┐                       ┌──────────────────────────────────────────┐
│   PHASE 2: COMMIT & SETTLEMENT       │                       │  SAGA COMPENSATING ROLLBACK (ABORT)      │
│  - Vendor Payout Released to MoMo    │                       │  - 100% Funds Reversed to Shopper MoMo   │
│  - 2% Platform Fee Retained          │                       │  - Order Cancelled & Auditor Logged      │
│  - SHA-256 Digital Receipt Issued    │                       │  - Immutable Audit Hash Signed           │
└──────────────────────────────────────┘                       └──────────────────────────────────────────┘
```

---

## 📋 Software Requirements Traceability Matrix (SRTM)

| Requirement ID | Module / Subsystem | Requirement Description | Implementation Artifact | Verification Test |
| :--- | :--- | :--- | :--- | :--- |
| `[SRS-REQ-DEMAND-001]` | C2B Demand Engine | Itemized grocery builder with Ghanaian units (`Olonka`, `Margarine Tin`, `Paint Bucket`, `Tubers`, `kg`) and price ceilings. | `src/components/shopper/CreateDemandListModal.tsx` | UI Integration Test |
| `[SRS-FEAT-ML-002]` | ML Price Engine | Linear regression price baseline comparing Shopper Budget vs Store Bid vs Accra Supermarket Average (1.18x multiplier). | `server/services/mlBenchmarkService.ts` | `MLPriceBenchmarkVisualizer.test.tsx` |
| `[SRS-REQ-ESCROW-003]` | 2PC Escrow Engine | Phase 1 Prepare: Lock MoMo funds in platform vault, deduct 2% fee, generate SHA-256 hash. | `server/services/escrowEngine.ts` | `stateStore.test.ts` |
| `[SRS-REQ-ESCROW-004]` | 2PC Escrow Engine | Phase 2 Commit: Shopper physical goods verification releases vendor settlement to merchant MoMo wallet. | `server/services/escrowEngine.ts` | `stateStore.test.ts` |
| `[SRS-REQ-SAGA-005]` | Saga Orchestrator | Compensating transaction: Returns 100% principal to shopper MoMo wallet upon dispute arbitration. | `server/services/escrowEngine.ts` | `stateStore.test.ts` |
| `[SRS-REQ-AUDIT-006]` | Cryptographic Ledger | Immutable SHA-256 non-repudiation audit trail and printable digital receipts with verification QR. | `src/components/receipt/EscrowReceiptModal.tsx` | Cryptographic Invariant Test |

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Step 1: Clone Repository
```bash
git clone https://github.com/Theo-Dorh/Errand-Ghana.git
cd Errand-Ghana
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Automated Test Suites (Vitest)
```bash
npm test
```

### Step 4: Launch Concurrent Full-Stack Environment
```bash
npm run dev:all
```
- **Frontend Client**: `http://localhost:5173`
- **Backend API & Escrow Engine**: `http://localhost:3001`

---

## 👥 Pre-Configured Test Personas (One-Click Switching)

The application includes an integrated **Role & Persona Switcher** in the top navigation bar:

1. **Kofi Mensah (Shopper - East Legon)**: `shopper.kofi@ug.edu.gh` | MTN MoMo (`0244123456`)
2. **Ama Serwaa (Shopper - Madina)**: `shopper.ama@gmail.com` | Telecel Cash (`0501987654`)
3. **Auntie Naa Baskets (Store Merchant - Makola Wholesale)**: `makola.fresh@gmail.com` | MTN MoMo (`0249876543`)
4. **Uncle Joe (Store Merchant - Kaneshie Organic Hub)**: `kaneshie.mart@gmail.com` | AT Money (`0265551234`)
5. **Prof. Boateng (Escrow Auditor - UG Legon)**: `admin.escrow@errandghana.ug.edu.gh` | Escrow Governance Console

---

## 📚 Academic Documentation Directory
For deep architectural specifications, refer to the `/docs` and `/Supporting_Files` directories:
- `docs/SRS.md`: Complete Software Requirements Specification
- `docs/Software_Effort_Estimation.md`: IFPUG FPA (87 UFP) & COCOMO II (3.915 KLOC)
- `docs/Testing_Report.md`: Automated testing logs & test suite matrix
- `docs/Technical_Debt_Plan.md`: 48-hour trade-offs & Voice AI V2.0 roadmap
- `docs/User_Manual.md`: Operational manual for Shoppers, Merchants, and Auditors
- `Supporting_Files/`: Architecture Level 0 DFD, 2PC State Machine diagrams, Database ERD

---
**Course Attribution**: CSCD 602: Advanced Software Engineering, Department of Computer Science, University of Ghana, Legon.
