# Technical Debt Analysis & Version 2.0 Architectural Roadmap
## ERRAND GHANA: Demand-Led C2B Grocery Marketplace & MoMo Escrow Engine

- **Course**: CSCD 602: Advanced Software Engineering, University of Ghana, Legon
- **Developer / Student**: Theophilus Dorh (Student ID: `22425676`)
- **Target Repository**: `https://github.com/Theo-Dorh/Errand-Ghana`

---

## 1. Technical Debt Classification Matrix

During the rapid 48-hour development sprint, pragmatic engineering trade-offs were made to balance delivery speed with distributed architectural correctness.

| Debt Category | Component Affected | Current Implementation | Principal Technical Debt | Remediation Plan & Target Release |
| :--- | :--- | :--- | :--- | :--- |
| **Architecture** | Database Persistence | Dual-mode Supabase PostgreSQL with in-memory fallback | In-memory store does not persist across node restarts when running without live Supabase credentials. | Enforce mandatory managed PostgreSQL container with automated Docker Compose volume persistence in V1.1. |
| **Integrations** | Mobile Money Switch | Simulated USSD gateway callbacks | Uses deterministic simulation rather than live Bank of Ghana GhIPSS ISO 8583 switch. | Integrate live MTN MoMo OpenAPI & Hubtel payment switch with webhook signatures in V1.2. |
| **Performance** | State Synchronization | Periodic HTTP REST polling (8s interval) | Increases server overhead at scale compared to push protocols. | Implement WebSockets / Supabase Realtime Channels for sub-10ms event broadcasts in V1.2. |
| **UX / Accessibility** | Market Merchant UI | Form-based text input | Illiterate or semi-literate market women in Makola/Kejetia struggle with typing. | **Voice AI Engine**: Implement Ghanaian dialect Speech-to-Text (Twi, Ga, Ewe, Fante) in V2.0. |

---

## 2. 48-Hour Sprint Trade-Off Justification

1. **Dual-Mode Persistence Layer**: To enable frictionless academic evaluation on any examiner machine without requiring pre-configured cloud credentials, a high-performance in-memory transactional mock engine was implemented as a seamless fallback.
2. **Deterministic Cryptographic Simulation**: Simulated USSD authorization was engineered with realistic latencies and authentic Ghanaian network codes (`*170#`, `*110#`) while preserving real 256-bit SHA-256 state hashing.

---

## 3. Version 2.0 Engineering Roadmap

### 3.1 Feature 1: Ghanaian Local Dialect Voice AI Assistant (Speech-to-Text)
- **Objective**: Expand platform accessibility to non-literate wholesale traders in Makola, Madina, Agbogbloshie, and Kejetia.
- **Tech Stack**: Fine-tuned Whisper / MMS (Massively Multilingual Speech) models trained on Asante Twi, Akuapem Twi, Ga, and Ewe audio datasets.
- **Workflow**:
  1. Market trader presses audio microphone button and speaks in Twi: *"Mepɛ Olonka nson Navrongo ntos, ne pona bayere du"* (I want 7 Olonkas of Navrongo tomatoes and 10 tubers of Pona yam).
  2. The Voice AI engine parses quantities, units, and categories directly into an itemized JSON manifest with auto-calculated wholesale price bids.

### 3.2 Feature 2: Automated Bank of Ghana GhIPSS Switch Integration
- Direct integration with the Ghana Interbank Payment and Settlement Systems (GhIPSS) Proxy Pay switch for instant inter-wallet settlement across all 23 commercial banks and 3 mobile networks.

### 3.3 Feature 3: Decentralized Identity (DID) Ghana Card KYC Verification
- Integration with the National Identification Authority (NIA) verification API for instant biometric verification of commercial delivery riders and merchants.
