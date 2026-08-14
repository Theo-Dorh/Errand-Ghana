import { describe, it, expect, beforeEach } from 'vitest';
import { EscrowEngine } from '../../server/services/escrowEngine.ts';
import { MLBenchmarkService } from '../../server/services/mlBenchmarkService.ts';
import { storageService } from '../../server/services/storageService.ts';

describe('Distributed 2PC Saga Escrow Engine & State Machine', () => {
  let escrow: EscrowEngine;
  let mlService: MLBenchmarkService;

  const mockShopperId = '11111111-1111-1111-1111-111111111111';
  const mockStoreId = '33333333-3333-3333-3333-333333333333';

  beforeEach(() => {
    escrow = new EscrowEngine();
    mlService = new MLBenchmarkService();
  });

  it('Phase 1: Locks funds in escrow vault with 2% platform fee deduction', () => {
    // 1. Create demand list
    const list = storageService.createDemandList(
      mockShopperId,
      'Test Sunday Grocery Basket',
      'East Legon',
      'Boundary Rd',
      300.0,
      'Standard (2-4 hrs)',
      'Fresh only',
      [{ name: 'Yams', quantity: 5, unit: 'Tubers', target_price: 60.0, category: 'Tubers' }]
    );

    // 2. Submit store offer
    const offer = storageService.createStoreOffer(list.id, mockStoreId, 280.0, 20.0, 1.5, 'Top quality');

    // 3. Phase 1 Prepare & Lock
    const result = escrow.prepareAndLockMoMo(list.id, offer.id, mockShopperId, 'MTN_MOMO', '0244123456');

    expect(result.success).toBe(true);
    expect(result.order).toBeDefined();
    expect(result.order?.total_amount).toBe(300.0); // 280 + 20
    expect(result.order?.platform_fee).toBe(6.0); // 2% of 300
    expect(result.order?.vendor_payout).toBe(294.0); // 300 - 6
    expect(result.order?.escrow_status).toBe('funded');
    expect(result.order?.sha256_audit_hash).toHaveLength(64);
  });

  it('Progresses order states from funded to in_transit to delivered', () => {
    const list = storageService.createDemandList(
      mockShopperId,
      'Test Transit Basket',
      'Madina',
      'UG Pentagon',
      200.0,
      'Express',
      '',
      [{ name: 'Rice', quantity: 1, unit: 'Bag', target_price: 200.0, category: 'Grains & Cereals' }]
    );
    const offer = storageService.createStoreOffer(list.id, mockStoreId, 190.0, 10.0, 1.0);
    const lockResult = escrow.prepareAndLockMoMo(list.id, offer.id, mockShopperId, 'TELECEL_CASH', '0501987654');

    const orderId = lockResult.order!.id;

    // Transition to in_transit
    const transitRes = escrow.updateTransitStatus(orderId, mockStoreId, 'in_transit');
    expect(transitRes.success).toBe(true);
    expect(transitRes.order?.escrow_status).toBe('in_transit');

    // Transition to delivered
    const deliveredRes = escrow.updateTransitStatus(orderId, mockStoreId, 'delivered');
    expect(deliveredRes.success).toBe(true);
    expect(deliveredRes.order?.escrow_status).toBe('delivered');
  });

  it('Phase 2: Commits and releases escrow payout to vendor wallet upon confirmation', () => {
    const list = storageService.createDemandList(
      mockShopperId,
      'Test Release Basket',
      'Osu',
      'Oxford Street',
      150.0,
      'Standard',
      '',
      [{ name: 'Catfish', quantity: 1, unit: 'Kg', target_price: 150.0, category: 'Meat & Fish' }]
    );
    const offer = storageService.createStoreOffer(list.id, mockStoreId, 140.0, 10.0, 1.0);
    const lockResult = escrow.prepareAndLockMoMo(list.id, offer.id, mockShopperId, 'AT_MONEY', '0265551234');
    const orderId = lockResult.order!.id;

    escrow.updateTransitStatus(orderId, mockStoreId, 'delivered');

    // Phase 2 Commit
    const commitResult = escrow.commitAndReleasePayout(orderId, mockShopperId);
    expect(commitResult.success).toBe(true);
    expect(commitResult.order?.escrow_status).toBe('released');

    const updatedList = storageService.getDemandListById(list.id);
    expect(updatedList?.status).toBe('completed');
  });

  it('Saga Compensating Rollback: Returns 100% funds to shopper upon dispute arbitration', () => {
    const list = storageService.createDemandList(
      mockShopperId,
      'Test Dispute Basket',
      'Cantonments',
      'Embassy Road',
      250.0,
      'Express',
      '',
      [{ name: 'Palm Oil', quantity: 2, unit: 'Liter', target_price: 125.0, category: 'Oils & Spices' }]
    );
    const offer = storageService.createStoreOffer(list.id, mockStoreId, 235.0, 15.0, 2.0);
    const lockResult = escrow.prepareAndLockMoMo(list.id, offer.id, mockShopperId, 'MTN_MOMO', '0244123456');
    const orderId = lockResult.order!.id;

    // Trigger Compensating Saga Rollback
    const refundResult = escrow.executeCompensatingRefund(
      orderId,
      mockShopperId,
      'Items were spoiled and vendor was unresponsive.'
    );

    expect(refundResult.success).toBe(true);
    expect(refundResult.order?.escrow_status).toBe('refunded');
    expect(refundResult.order?.dispute_reason).toContain('Items were spoiled');

    const updatedList = storageService.getDemandListById(list.id);
    expect(updatedList?.status).toBe('cancelled');
  });

  it('ML Benchmark Service accurately computes 1.18x Accra supermarket markup and consumer savings', () => {
    const benchmark = mlService.calculateBenchmark('Ghana Royal Jasmine Rice', 'Grains & Cereals', 100.0, 95.0);

    expect(benchmark.accraRetailBenchmark).toBe(118.0); // 100 * 1.18
    expect(benchmark.consumerSavingsGHS).toBe(23.0); // 118 - 95
    expect(benchmark.supermarketVariancePercent).toBe(19.5); // (118 - 95) / 118 * 100
    expect(benchmark.mlConfidenceScore).toBeGreaterThan(90.0);
  });
});
