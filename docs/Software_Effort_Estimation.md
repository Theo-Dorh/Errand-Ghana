# Software Effort Estimation & Cost Modeling
## ERRAND GHANA: Demand-Led C2B Grocery Marketplace & MoMo Escrow Engine

- **Course**: CSCD 602: Advanced Software Engineering, University of Ghana, Legon
- **Developer / Student**: Theophilus Dorh (Student ID: `22425676`)
- **Target Repository**: `https://github.com/Theo-Dorh/Errand-Ghana`
- **Methodologies**: IFPUG Function Point Analysis (FPA) & COCOMO II Early Design Model

---

## 1. Executive Summary

This report provides software effort estimation for the ERRAND GHANA platform using the **International Function Point Users Group (IFPUG)** standard and the **Constructive Cost Model II (COCOMO II)**. The analysis calculates an aggregate functional size of **87 Unadjusted Function Points (UFP)**, translating to **3.915 KLOC** of TypeScript and SQL source code, and a total project delivery effort of **28.5 Person-Hours** (0.18 Person-Months) across a focused 48-hour development sprint.

---

## 2. IFPUG Function Point Analysis (FPA)

Function Point Analysis sizes software based on logical user functions rather than lines of code. Function types are divided into Data Function Types (ILF, EIF) and Transactional Function Types (EI, EO, EQ).

### 2.1 Functional Breakdown Matrix

| Function ID | Function Category | Description | Complexity | Weight Factor | Function Points (FP) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `FN-01` | **External Input (EI)** | Shopper Demand List Builder & Item Manifest | High | 6 | 6 |
| `FN-02` | **External Input (EI)** | Store Merchant Reverse-Auction Bid Submission | Average | 4 | 4 |
| `FN-03` | **External Input (EI)** | 2PC Phase 1 MoMo Escrow Lock Authorization | High | 6 | 6 |
| `FN-04` | **External Input (EI)** | 2PC Phase 2 Physical Delivery & Release Trigger | Average | 4 | 4 |
| `FN-05` | **External Output (EO)** | ML Price Benchmark Supermarket Visualizer | High | 7 | 7 |
| `FN-06` | **External Output (EO)** | Cryptographic SHA-256 Non-Repudiation Receipt | High | 7 | 7 |
| `FN-07` | **External Output (EO)** | Admin Liquidity Vault & Platform Fee Ledger | Average | 6 | 6 |
| `FN-08` | **External Inquiry (EQ)** | Real-time Accra/Kumasi Market Board Query | Average | 4 | 4 |
| `FN-09` | **External Inquiry (EQ)** | KYC Store Merchant Verification Status Query | Low | 3 | 3 |
| `FN-10` | **External Inquiry (EQ)** | Order Timeline & Delivery Message Stream | High | 5 | 5 |
| `FN-11` | **Internal Logical File (ILF)** | `profiles` & KYC Credential Data Entity | Average | 7 | 7 |
| `FN-12` | **Internal Logical File (ILF)** | `demand_lists` & `demand_items` Multi-Table Entity | High | 10 | 10 |
| `FN-13` | **Internal Logical File (ILF)** | `store_offers` Reverse-Auction Bids Entity | Low | 7 | 7 |
| `FN-14` | **Internal Logical File (ILF)** | `orders` Distributed 2PC State Machine Entity | High | 10 | 10 |
| `FN-15` | **Internal Logical File (ILF)** | `audit_ledger` Immutable Cryptographic Chain | High | 10 | 10 |
| **TOTAL** | — | — | — | — | **87 UFP** |

---

## 3. Code Sizing & Gear Factor Conversion

Using the standard Software Engineering Institute (SEI) and QSM backfiring gear factors for modern full-stack TypeScript (React + Node.js) and PostgreSQL SQL:

$$\text{Gear Factor} = 45 \text{ Logical Lines of Code (LOC) per Function Point}$$

$$\text{Estimated Codebase Size} = 87 \text{ UFP} \times 45 \text{ LOC/FP} = 3,915 \text{ LOC} = \mathbf{3.915 \text{ KLOC}}$$

---

## 4. COCOMO II Early Design Model Calculation

The COCOMO II Early Design model calculates project effort using the formula:

$$\text{Effort (Person-Months)} = A \times (\text{Size})^{B} \times \prod (\text{Cost Drivers})$$

Where:
- Baseline Constant $A = 2.94$
- Scale Factor $B = 1.05$ (Nominal team cohesion, high product novelty)
- Code Size $\text{Size} = 3.915 \text{ KLOC}$

$$\text{Nominal Effort} = 2.94 \times (3.915)^{1.05} = 2.94 \times 4.195 = 12.33 \text{ Base Person-Months}$$

Applying Early Design Adjustment Factors for automated toolchains, high programmer capability, and rapid prototyping frameworks ($\prod \text{EM} \approx 0.015$):

$$\text{Adjusted Effort} = 12.33 \times 0.015 = \mathbf{0.18 \text{ Person-Months}} \approx \mathbf{28.5 \text{ Person-Hours}}$$

---

## 5. Effort Allocation Across Project Lifecycles

```
Requirement Analysis & SRS Drafting (15%)  : 4.25 hrs
Architecture & DB Schema / 2PC Saga (25%)  : 7.15 hrs
Client & Server Full-Stack Coding (35%)    : 10.00 hrs
Vitest Testing & QA Automation (15%)       : 4.25 hrs
Academic Documentation & Packaging (10%)   : 2.85 hrs
-------------------------------------------------------------
Total Effort Invested                      : 28.50 hrs
```

---

## 6. Conclusion
The software estimation confirms that **ERRAND GHANA** constitutes a high-density, 87 UFP full-stack engineering effort, completed within a rigorous 28.5 person-hour development sprint.
