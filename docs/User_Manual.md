# Operational User Manual
## ERRAND GHANA: Demand-Led C2B Grocery Marketplace & MoMo Escrow Engine

- **Course**: CSCD 602: Advanced Software Engineering, University of Ghana, Legon
- **Developer / Student**: Theophilus Dorh (Student ID: `22425676`)
- **Target Repository**: `https://github.com/Theo-Dorh/Errand-Ghana`

---

## 1. Getting Started & Persona Switching

The top navigation header features a built-in **Persona Switcher** allowing examiners and users to test different roles:
- **Kofi Mensah (Shopper - East Legon)**: `shopper.kofi@ug.edu.gh`
- **Ama Serwaa (Shopper - Madina)**: `shopper.ama@gmail.com`
- **Auntie Naa Baskets (Merchant - Makola)**: `makola.fresh@gmail.com`
- **Uncle Joe (Merchant - Kaneshie)**: `kaneshie.mart@gmail.com`
- **Prof. Boateng (Escrow Auditor)**: `admin.escrow@errandghana.ug.edu.gh`

---

## 2. Shopper User Guide

### Step 2.1: Posting a Demand Basket
1. Select the **Market Demand Feed** tab.
2. Click the green **Post Grocery Demand List** button.
3. Enter a descriptive title (e.g. *Sunday Jollof & Fresh Soup Basket*) and select your neighborhood (e.g. *East Legon*).
4. Add grocery items using customary Ghanaian volumetric units (`Olonka`, `Margarine Tin`, `Paint Bucket`, `Tubers`, `Bag 5kg`, `kg`, `Liter`).
5. Enter your target budget for each item. Observe the live **ML Supermarket Arbitrage Savings** calculation.
6. Click **Publish Demand List to Market**.

### Step 2.2: Reviewing Merchant Bids & ML Price Savings
1. In your **Active Demand Baskets** section, review incoming competitive bids.
2. Examine the **ML Market Price Benchmark** comparative chart comparing your budget, the merchant bid, and the Accra Supermarket retail baseline ($1.18\times$).
3. Verify merchant rating and fulfillment SLA.

### Step 2.3: Authorizing Phase 1 MoMo Escrow Lock
1. Click **Accept Bid & Lock Mobile Money Escrow**.
2. Select your mobile network: **MTN MoMo (*170#)**, **Telecel Cash (*110#)**, or **AT Money (*110#)**.
3. Confirm your MoMo number and click **Prompt Phone for MoMo USSD Authorization**.
4. In the simulated USSD prompt, enter your 4-digit PIN (e.g. `1234`) and click **Authorize Payment**.
5. The funds are now securely locked in the neutral ERRAND GHANA Escrow Vault.

### Step 2.4: Physical Inspection & Phase 2 Payout Release
1. Navigate to the **2PC Escrow Orders** tab.
2. When the delivery arrives, complete the **Physical Goods Inspection Checklist**:
   - [x] Produce Fresh & Undamaged
   - [x] Olonka / kg Quantities Correct
   - [x] Packaging Seal Intact
3. Click **Confirm & Release MoMo Payout**. The vendor payout is instantly released to the merchant's mobile wallet.
4. Click **Digital Audit Receipt** to view or print the cryptographic receipt with the SHA-256 state signature.

---

## 3. Store Merchant User Guide

### Step 3.1: Monitoring Urban Demand & Neighborhood Filtering
1. Switch your persona to **Auntie Naa Baskets** or **Uncle Joe**.
2. Navigate to **Market Demand Feed**.
3. Use the filter chips (*East Legon, Madina, Makola, Kumasi*) to locate shopper requests in your fulfillment radius.

### Step 3.2: Submitting a Reverse-Auction Competitive Bid
1. Click **Place Reverse-Auction Bid** on an open demand card.
2. Enter your wholesale total price, delivery fee, and fulfillment SLA (hours).
3. Review the ML price competitiveness indicator.
4. Click **Submit Bid**.

### Step 3.3: Dispatching Goods & Claiming Settlement
1. Once the shopper locks escrow, navigate to **2PC Escrow Orders**.
2. Click **Mark Packed & In-Transit** when the order is handed to the dispatch rider.
3. Use the **Customer Delivery Notes** chat to coordinate landmark directions.
4. Click **Mark Delivered to Neighborhood** upon arrival.
5. Once the customer verifies the delivery, your payout is automatically credited.

---

## 4. Escrow Auditor & Governance Guide

### Step 4.1: Liquidity & 2% Platform Fee Supervision
1. Switch persona to **Prof. Boateng (Escrow Auditor)**.
2. Navigate to **Vault Governance & Audit**.
3. Review real-time KPI cards: *Locked Escrow Vault*, *2% Fee Revenue*, *Disbursed Payouts*, and *Compensating Refunds*.

### Step 4.2: Merchant KYC Verification
1. Click the **Store KYC Verification Queue** tab.
2. Review store business registrations and Ghana Card credentials.
3. Click **Approve Merchant KYC** or **Revoke Approval**.

### Step 4.3: Dispute Arbitration & Rollbacks
1. Click the **Saga Dispute Arbitration** tab.
2. In the event of a customer dispute, review buyer/merchant notes and either trigger **Force Release** or execute a **Compensating Refund** (which returns 100% principal back to the buyer's MoMo wallet).

### Step 4.4: Inspecting Immutable SHA-256 Audit Trail
1. Click **Cryptographic SHA-256 Audit Trail**.
2. Inspect every timestamped action, actor role, before/after states, and 256-bit hash.
