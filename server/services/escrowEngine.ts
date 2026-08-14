import crypto from 'crypto';
import { storageService } from './storageService.ts';
import { Order, MoMoProvider } from '../types/index.ts';

export class EscrowEngine {
  private platformFeePercent = 2.0; // 2% platform fee

  /**
   * Phase 1 (Prepare & Lock): Locks Shopper MoMo funds into platform escrow vault
   */
  public prepareAndLockMoMo(
    listId: string,
    offerId: string,
    shopperId: string,
    momoProvider: MoMoProvider,
    momoNumber: string
  ): { success: boolean; order?: Order; message: string } {
    const list = storageService.getDemandListById(listId);
    const offer = storageService.getOfferById(offerId);
    const shopper = storageService.getProfileById(shopperId);

    if (!list) return { success: false, message: 'Demand list not found' };
    if (!offer) return { success: false, message: 'Store offer not found' };
    if (!shopper) return { success: false, message: 'Shopper profile not found' };

    const totalAmount = offer.offered_total_price + offer.delivery_fee;
    const platformFee = Math.round((totalAmount * (this.platformFeePercent / 100)) * 100) / 100;
    const vendorPayout = Math.round((totalAmount - platformFee) * 100) / 100;

    const orderId = crypto.randomUUID();
    const momoTxId = `${momoProvider.substring(0, 3)}-TX-${Math.floor(100000 + Math.random() * 900000)}-GH`;
    const timestamp = new Date().toISOString();

    const rawPayload = `${orderId}|${listId}|${shopperId}|${offer.store_id}|${totalAmount}|funded|${momoTxId}|${timestamp}`;
    const sha256_audit_hash = crypto.createHash('sha256').update(rawPayload).digest('hex');

    const newOrder: Order = {
      id: orderId,
      list_id: listId,
      offer_id: offerId,
      shopper_id: shopperId,
      store_id: offer.store_id,
      total_amount: totalAmount,
      platform_fee: platformFee,
      vendor_payout: vendorPayout,
      escrow_status: 'funded',
      momo_provider: momoProvider,
      momo_number: momoNumber,
      momo_transaction_id: momoTxId,
      sha256_audit_hash,
      created_at: timestamp,
      updated_at: timestamp,
    };

    // Save order
    storageService.saveOrder(newOrder);

    // Update list status and offer status
    storageService.updateDemandListStatus(listId, 'funded');
    offer.status = 'accepted';

    // Record Immutable Audit Log
    storageService.recordAuditEntry({
      order_id: orderId,
      action: '2PC_SAGA_PHASE_1_LOCK',
      actor_id: shopperId,
      actor_role: 'shopper',
      state_before: 'CREATED',
      state_after: 'FUNDED',
      amount: totalAmount,
      metadata: {
        momo_provider: momoProvider,
        momo_number: momoNumber,
        momo_transaction_id: momoTxId,
        platform_fee: platformFee,
        vendor_payout: vendorPayout,
        sha256_hash: sha256_audit_hash,
      },
    });

    return {
      success: true,
      order: storageService.getOrderById(orderId),
      message: `Phase 1 MoMo Lock Successful. GH₵ ${totalAmount.toFixed(2)} secured in platform vault via ${momoProvider}.`,
    };
  }

  /**
   * Update Order Progress State (e.g. funded -> in_transit -> delivered)
   */
  public updateTransitStatus(
    orderId: string,
    actorId: string,
    targetStatus: 'in_transit' | 'delivered'
  ): { success: boolean; order?: Order; message: string } {
    const order = storageService.getOrderById(orderId);
    if (!order) return { success: false, message: 'Order not found' };

    const previousStatus = order.escrow_status;

    // Validate state progression
    if (targetStatus === 'in_transit' && previousStatus !== 'funded') {
      return { success: false, message: 'Order must be funded before dispatching' };
    }
    if (targetStatus === 'delivered' && previousStatus !== 'in_transit' && previousStatus !== 'funded') {
      return { success: false, message: 'Invalid state transition' };
    }

    order.escrow_status = targetStatus;
    order.updated_at = new Date().toISOString();

    const rawPayload = `${order.id}|${order.list_id}|${order.shopper_id}|${order.store_id}|${order.total_amount}|${targetStatus}|${order.momo_transaction_id}|${order.updated_at}`;
    order.sha256_audit_hash = crypto.createHash('sha256').update(rawPayload).digest('hex');

    storageService.saveOrder(order);

    storageService.recordAuditEntry({
      order_id: orderId,
      action: targetStatus === 'in_transit' ? 'ORDER_DISPATCHED' : 'ORDER_DELIVERED',
      actor_id: actorId,
      actor_role: 'store_merchant',
      state_before: previousStatus.toUpperCase(),
      state_after: targetStatus.toUpperCase(),
      amount: order.total_amount,
      metadata: { sha256_hash: order.sha256_audit_hash },
    });

    return {
      success: true,
      order: storageService.getOrderById(orderId),
      message: `Order marked as ${targetStatus}.`,
    };
  }

  /**
   * Phase 2 (Commit & Release): Releases escrow payout to store merchant wallet
   */
  public commitAndReleasePayout(
    orderId: string,
    shopperId: string
  ): { success: boolean; order?: Order; message: string } {
    const order = storageService.getOrderById(orderId);
    if (!order) return { success: false, message: 'Order not found' };

    if (order.shopper_id !== shopperId && shopperId !== '55555555-5555-5555-5555-555555555555') {
      return { success: false, message: 'Unauthorized: Only buyer or admin can release escrow' };
    }

    if (order.escrow_status === 'released') {
      return { success: false, message: 'Escrow already released' };
    }

    if (order.escrow_status !== 'delivered' && order.escrow_status !== 'in_transit' && order.escrow_status !== 'funded') {
      return { success: false, message: `Cannot release escrow from status: ${order.escrow_status}` };
    }

    const stateBefore = order.escrow_status;
    order.escrow_status = 'released';
    order.updated_at = new Date().toISOString();

    const rawPayload = `${order.id}|${order.list_id}|${order.shopper_id}|${order.store_id}|${order.total_amount}|released|${order.momo_transaction_id}|${order.updated_at}`;
    order.sha256_audit_hash = crypto.createHash('sha256').update(rawPayload).digest('hex');

    storageService.saveOrder(order);

    storageService.updateDemandListStatus(order.list_id, 'completed');

    // Record Immutable Audit Log
    storageService.recordAuditEntry({
      order_id: orderId,
      action: '2PC_SAGA_PHASE_2_COMMIT_RELEASE',
      actor_id: shopperId,
      actor_role: 'shopper',
      state_before: stateBefore.toUpperCase(),
      state_after: 'RELEASED',
      amount: order.vendor_payout,
      metadata: {
        vendor_payout: order.vendor_payout,
        platform_fee: order.platform_fee,
        payout_destination: `${order.momo_provider} (${order.momo_number})`,
        sha256_hash: order.sha256_audit_hash,
      },
    });

    return {
      success: true,
      order: storageService.getOrderById(orderId),
      message: `Phase 2 Commit Successful. Vendor payout GH₵ ${order.vendor_payout.toFixed(2)} released to merchant wallet. Platform fee GH₵ ${order.platform_fee.toFixed(2)} collected.`,
    };
  }

  /**
   * Compensating Saga Transaction (Abort & Dispute Refund): Returns escrow funds to Shopper
   */
  public executeCompensatingRefund(
    orderId: string,
    actorId: string,
    disputeReason: string
  ): { success: boolean; order?: Order; message: string } {
    const order = storageService.getOrderById(orderId);
    if (!order) return { success: false, message: 'Order not found' };

    if (order.escrow_status === 'released') {
      return { success: false, message: 'Cannot refund after funds have already been released to vendor' };
    }

    if (order.escrow_status === 'refunded') {
      return { success: false, message: 'Order is already refunded' };
    }

    const stateBefore = order.escrow_status;
    order.escrow_status = 'refunded';
    order.dispute_reason = disputeReason;
    order.updated_at = new Date().toISOString();

    const rawPayload = `${order.id}|${order.list_id}|${order.shopper_id}|${order.store_id}|${order.total_amount}|refunded|${order.momo_transaction_id}|${order.updated_at}`;
    order.sha256_audit_hash = crypto.createHash('sha256').update(rawPayload).digest('hex');

    storageService.saveOrder(order);

    storageService.updateDemandListStatus(order.list_id, 'cancelled');

    // Record Immutable Audit Log
    storageService.recordAuditEntry({
      order_id: orderId,
      action: '2PC_SAGA_COMPENSATING_REFUND',
      actor_id: actorId,
      actor_role: 'admin_arbitrator',
      state_before: stateBefore.toUpperCase(),
      state_after: 'REFUNDED',
      amount: order.total_amount,
      metadata: {
        refund_reason: disputeReason,
        refund_amount: order.total_amount,
        recipient_momo: `${order.momo_provider} (${order.momo_number})`,
        sha256_hash: order.sha256_audit_hash,
      },
    });

    return {
      success: true,
      order: storageService.getOrderById(orderId),
      message: `Saga Compensating Rollback Executed. 100% refund of GH₵ ${order.total_amount.toFixed(2)} dispatched to Shopper MoMo account.`,
    };
  }
}

export const escrowEngine = new EscrowEngine();
