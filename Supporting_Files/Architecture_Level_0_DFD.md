# Architecture Level 0 Data Flow Diagram (DFD)
## ERRAND GHANA: Demand-Led C2B Marketplace & MoMo Escrow Engine

- **Course**: CSCD 602: Advanced Software Engineering, University of Ghana, Legon
- **Developer / Student**: Theophilus Dorh (Student ID: `22425676`)

---

```mermaid
graph TD
    Shopper[C2B Shopper / Consumer]
    Merchant[Store Merchant / Market Trader]
    Auditor[Escrow Auditor / Admin]
    MoMoSwitch[Ghana Mobile Money Gateway Switch]

    System((0.0 ERRAND GHANA System Core))

    DS_Profiles[(D1: User Profiles & KYC)]
    DS_Demands[(D2: Demand Lists & Items)]
    DS_Offers[(D3: Store Offers & Bids)]
    DS_Orders[(D4: 2PC Escrow Orders)]
    DS_Ledger[(D5: SHA-256 Audit Ledger)]

    Shopper -->|1. Post Grocery Demand Manifest| System
    System -->|Store Demand Manifest| DS_Demands
    System -->|Broadcast Open Market Demands| Merchant

    Merchant -->|2. Submit Reverse-Auction Bid| System
    System -->|Store Bid Details| DS_Offers
    System -->|Notify Incoming Merchant Bids| Shopper

    Shopper -->|3. Accept Bid & Initiate 2PC Lock| System
    System -->|4. Request MoMo USSD Lock| MoMoSwitch
    MoMoSwitch -->|5. USSD PIN Authorization & Tx Ref| System
    System -->|6. Record Funded Order & Vault Lock| DS_Orders
    System -->|7. Append SHA-256 State Digest| DS_Ledger
    System -->|8. Notify Order Funded / Pack Goods| Merchant

    Merchant -->|9. Update Dispatch Status| System
    System -->|10. Update Transit State| DS_Orders
    System -->|11. In-Transit Real-time Alert| Shopper

    Shopper -->|12. Physical Inspection & Confirm Delivery| System
    System -->|13. Commit Phase 2 Payout| MoMoSwitch
    MoMoSwitch -->|14. Credit Vendor MoMo Wallet| Merchant
    System -->|15. Retain 2% Platform Fee & Close Order| DS_Orders
    System -->|16. Sign SHA-256 Settlement Hash| DS_Ledger

    Auditor -->|Supervise Vault Liquidity & Dispute Arbitrate| System
    System -->|Stream Real-time Metrics & Audit Trail| Auditor
```
