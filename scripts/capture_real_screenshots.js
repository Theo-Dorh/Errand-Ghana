import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.resolve(process.cwd(), 'docs/images');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('🚀 Launching Chrome to capture real screenshots from', BASE_URL);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();

  try {
    // ----------------------------------------------------
    // SCREENSHOT 01: Landing Page Role Gateway
    // ----------------------------------------------------
    console.log('📸 1. Capturing Landing Page Role Gateway...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await sleep(800);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '01_shopper_role_gateway.png') });

    // ----------------------------------------------------
    // SCREENSHOT 02: Landing Page Demo Personas
    // ----------------------------------------------------
    console.log('📸 2. Capturing Demo Personas Tab...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const demoBtn = buttons.find((b) => b.textContent && b.textContent.includes('Demo Personas'));
      if (demoBtn) demoBtn.click();
    });
    await sleep(800);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02_shopper_demo_personas.png') });

    // ----------------------------------------------------
    // LOGIN AS SHOPPER (Kofi Mensah)
    // ----------------------------------------------------
    console.log('🔑 Logging in as Shopper (Kofi Mensah)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const kofiBtn = buttons.find((b) => b.textContent && b.textContent.includes('Kofi Mensah'));
      if (kofiBtn) kofiBtn.click();
    });
    await sleep(1000);

    // ----------------------------------------------------
    // SCREENSHOT 03: Grocery List Builder Modal with Indigenous Units
    // ----------------------------------------------------
    console.log('📸 3. Capturing Grocery List Builder Modal...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const createListBtn = buttons.find((b) => b.textContent && (b.textContent.includes('Create Demand List') || b.textContent.includes('Post Demand List') || b.textContent.includes('Post Grocery')));
      if (createListBtn) createListBtn.click();
    });
    await sleep(800);

    // Pre-fill inputs to look realistic
    await page.evaluate(() => {
      const titleInput = document.querySelector('input[placeholder*="Sunday Jollof"]') || document.querySelector('input[type="text"]');
      if (titleInput) {
        titleInput.value = 'Sunday Jollof & Fresh Soup Basket';
        titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const addressInput = document.querySelector('input[placeholder*="East Legon"]') || document.querySelectorAll('input[type="text"]')[1];
      if (addressInput) {
        addressInput.value = 'Bawaleshie Road, East Legon, Accra';
        addressInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '03_shopper_grocery_builder_modal.png') });

    // Close modal
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const closeBtn = buttons.find((b) => b.textContent && b.textContent.includes('Cancel')) || document.querySelector('button[aria-label="Close"]');
      if (closeBtn) closeBtn.click();
    });
    await sleep(600);

    // ----------------------------------------------------
    // SCREENSHOT 04: Offer Review Card with ML Price Benchmark
    // ----------------------------------------------------
    console.log('📸 4. Capturing Offer Review Card & ML Price Benchmark...');
    await page.evaluate(() => {
      window.scrollTo({ top: 380, behavior: 'instant' });
    });
    await sleep(600);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '04_shopper_offer_ml_benchmark.png') });

    // ----------------------------------------------------
    // SCREENSHOT 05: MoMo Safe Pay Payment Modal
    // ----------------------------------------------------
    console.log('📸 5. Capturing MoMo Safe Pay Payment Modal...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const acceptOfferBtn = buttons.find((b) => b.textContent && (b.textContent.includes('Accept Offer & Lock') || b.textContent.includes('Lock MoMo') || b.textContent.includes('Accept Bid')));
      if (acceptOfferBtn) acceptOfferBtn.click();
    });
    await sleep(800);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '05_shopper_momo_payment_modal.png') });

    // Close MoMo modal
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cancelMoMoBtn = buttons.find((b) => b.textContent && b.textContent.includes('Cancel'));
      if (cancelMoMoBtn) cancelMoMoBtn.click();
    });
    await sleep(600);

    // ----------------------------------------------------
    // SCREENSHOT 06: 4-Step Escrow Timeline (My Orders Tab)
    // ----------------------------------------------------
    console.log('📸 6. Capturing 4-Step Escrow Timeline on Orders Tab...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const ordersTabBtn = buttons.find((b) => b.textContent && (b.textContent.includes('My Orders') || b.textContent.includes('Orders')));
      if (ordersTabBtn) ordersTabBtn.click();
    });
    await sleep(800);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '06_shopper_4step_escrow_timeline.png') });

    // ----------------------------------------------------
    // SCREENSHOT 07: Doorstep Quality Inspection Checklist
    // ----------------------------------------------------
    console.log('📸 7. Capturing Doorstep Inspection Checklist...');
    await page.evaluate(() => {
      window.scrollTo({ top: 320, behavior: 'instant' });
    });
    await sleep(600);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '07_shopper_doorstep_checklist.png') });

    // ----------------------------------------------------
    // SCREENSHOT 08: SHA-256 Digital Receipt Modal
    // ----------------------------------------------------
    console.log('📸 8. Capturing SHA-256 Digital Receipt Modal...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const receiptBtn = buttons.find((b) => b.textContent && (b.textContent.includes('Receipt') || b.textContent.includes('Digital Escrow Receipt')));
      if (receiptBtn) receiptBtn.click();
    });
    await sleep(800);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '08_shopper_digital_receipt_modal.png') });

    // Close receipt modal
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const closeReceiptBtn = buttons.find((b) => b.textContent && (b.textContent.includes('Close') || b.textContent.includes('Done'))) || document.querySelector('button[aria-label="Close"]');
      if (closeReceiptBtn) closeReceiptBtn.click();
    });
    await sleep(600);

    // ----------------------------------------------------
    // SWITCH PERSONA TO STORE MERCHANT (Auntie Naa)
    // ----------------------------------------------------
    console.log('🔑 Switching to Store Merchant (Auntie Naa Baskets)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('header button'));
      const profileBtn = buttons.find((b) => b.querySelector('.truncate') || b.textContent.includes('Kofi') || b.textContent.includes('Shopper'));
      if (profileBtn) profileBtn.click();
    });
    await sleep(600);

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const auntieNaaBtn = buttons.find((b) => b.textContent && b.textContent.includes('Auntie Naa'));
      if (auntieNaaBtn) auntieNaaBtn.click();
    });
    await sleep(1000);

    // ----------------------------------------------------
    // SCREENSHOT 09: Merchant Market Board
    // ----------------------------------------------------
    console.log('📸 9. Capturing Merchant Market Board...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const marketTabBtn = buttons.find((b) => b.textContent && (b.textContent.includes('Market Demands') || b.textContent.includes('Marketplace')));
      if (marketTabBtn) marketTabBtn.click();
    });
    await sleep(800);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '09_merchant_market_board.png') });

    // ----------------------------------------------------
    // SCREENSHOT 10: Neighbourhood Hub Filter Bar
    // ----------------------------------------------------
    console.log('📸 10. Capturing Neighbourhood Hub Filter Bar...');
    await page.evaluate(() => {
      window.scrollTo({ top: 120, behavior: 'instant' });
    });
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '10_merchant_hub_filter_bar.png') });

    // ----------------------------------------------------
    // SCREENSHOT 11: Submit Bid Modal
    // ----------------------------------------------------
    console.log('📸 11. Capturing Submit Bid Modal...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submitOfferBtn = buttons.find((b) => b.textContent && (b.textContent.includes('Submit Offer') || b.textContent.includes('Place Bid') || b.textContent.includes('Submit Wholesale Bid') || b.textContent.includes('Make Offer')));
      if (submitOfferBtn) submitOfferBtn.click();
    });
    await sleep(800);

    await page.evaluate(() => {
      const priceInput = document.querySelector('input[type="number"]');
      if (priceInput) {
        priceInput.value = '375';
        priceInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const notes = document.querySelector('textarea');
      if (notes) {
        notes.value = 'Direct farm harvest from Makola Central Hub. Cleanly packed in sanitized crates with 2-hour priority delivery.';
        notes.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '11_merchant_submit_bid_modal.png') });

    // Close modal
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cancelBidBtn = buttons.find((b) => b.textContent && b.textContent.includes('Cancel'));
      if (cancelBidBtn) cancelBidBtn.click();
    });
    await sleep(600);

    // ----------------------------------------------------
    // SCREENSHOT 12: Merchant Active Orders View
    // ----------------------------------------------------
    console.log('📸 12. Capturing Merchant Active Orders View...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const merchantOrdersTabBtn = buttons.find((b) => b.textContent && (b.textContent.includes('Active Orders') || b.textContent.includes('Orders')));
      if (merchantOrdersTabBtn) merchantOrdersTabBtn.click();
    });
    await sleep(800);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '12_merchant_active_orders_escrow.png') });

    // ----------------------------------------------------
    // SWITCH PERSONA TO ADMIN (Prof. Boateng)
    // ----------------------------------------------------
    console.log('🔑 Switching to Admin (Prof. Boateng)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('header button'));
      const merchantDropdownBtn = buttons.find((b) => b.querySelector('.truncate') || b.textContent.includes('Naa') || b.textContent.includes('Store'));
      if (merchantDropdownBtn) merchantDropdownBtn.click();
    });
    await sleep(600);

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const adminPersonaBtn = buttons.find((b) => b.textContent && (b.textContent.includes('Prof. Boateng') || b.textContent.includes('Admin')));
      if (adminPersonaBtn) adminPersonaBtn.click();
    });
    await sleep(1000);

    // ----------------------------------------------------
    // SCREENSHOT 13: Admin KPI Dashboard
    // ----------------------------------------------------
    console.log('📸 13. Capturing Admin KPI Dashboard...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const adminTabBtn = buttons.find((b) => b.textContent && (b.textContent.includes('Admin') || b.textContent.includes('Operations')));
      if (adminTabBtn) adminTabBtn.click();
    });
    await sleep(800);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '13_admin_kpi_dashboard.png') });

    // ----------------------------------------------------
    // SCREENSHOT 14: Cryptographic Audit Ledger (SHA-256)
    // ----------------------------------------------------
    console.log('📸 14. Capturing Cryptographic Audit Ledger...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const auditLedgerTabBtn = buttons.find((b) => b.textContent && (b.textContent.includes('Audit Ledger') || b.textContent.includes('Audit') || b.textContent.includes('Security Trail')));
      if (auditLedgerTabBtn) auditLedgerTabBtn.click();
    });
    await sleep(600);
    await page.evaluate(() => {
      window.scrollTo({ top: 220, behavior: 'instant' });
    });
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '14_admin_audit_ledger_sha256.png') });

    // ----------------------------------------------------
    // SCREENSHOT 15: Dispute Arbitration Panel
    // ----------------------------------------------------
    console.log('📸 15. Capturing Dispute Arbitration Panel...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const disputeTabBtn = buttons.find((b) => b.textContent && (b.textContent.includes('Disputes') || b.textContent.includes('Arbitration')));
      if (disputeTabBtn) disputeTabBtn.click();
    });
    await sleep(600);
    await page.evaluate(() => window.scrollTo({ top: 180, behavior: 'instant' }));
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '15_admin_dispute_arbitration.png') });

    // ----------------------------------------------------
    // SCREENSHOT 16: Store KYC Queue
    // ----------------------------------------------------
    console.log('📸 16. Capturing Store KYC Queue...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const kycTabBtn = buttons.find((b) => b.textContent && (b.textContent.includes('KYC') || b.textContent.includes('Store Approvals') || b.textContent.includes('Verification')));
      if (kycTabBtn) kycTabBtn.click();
    });
    await sleep(600);
    await page.evaluate(() => window.scrollTo({ top: 180, behavior: 'instant' }));
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '16_admin_store_kyc_queue.png') });

    console.log('🎉 ALL 16 ACTUAL SCREENSHOTS SUCCESSFULLY CAPTURED TO', OUTPUT_DIR);
  } catch (err) {
    console.error('❌ Error during screenshot capture:', err);
  } finally {
    await browser.close();
  }
}

run();
