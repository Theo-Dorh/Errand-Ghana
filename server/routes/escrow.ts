import { Router, Request, Response } from 'express';
import { escrowEngine } from '../services/escrowEngine.ts';
import { storageService } from '../services/storageService.ts';

const router = Router();

// POST /api/escrow/prepare-momo (Phase 1: Lock funds in platform escrow vault)
router.post('/prepare-momo', (req: Request, res: Response) => {
  try {
    const { list_id, offer_id, shopper_id, momo_provider, momo_number } = req.body;

    if (!list_id || !offer_id || !shopper_id || !momo_number) {
      return res.status(400).json({ success: false, message: 'Missing required 2PC prepare parameters' });
    }

    const result = escrowEngine.prepareAndLockMoMo(
      list_id,
      offer_id,
      shopper_id,
      momo_provider || 'MTN_MOMO',
      momo_number
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/escrow/commit-release (Phase 2: Release escrow payout to vendor wallet)
router.post('/commit-release', (req: Request, res: Response) => {
  try {
    const { order_id, shopper_id } = req.body;

    if (!order_id || !shopper_id) {
      return res.status(400).json({ success: false, message: 'order_id and shopper_id are required' });
    }

    const result = escrowEngine.commitAndReleasePayout(order_id, shopper_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/escrow/dispute-refund (Saga Compensating Transaction / Refund)
router.post('/dispute-refund', (req: Request, res: Response) => {
  try {
    const { order_id, actor_id, dispute_reason } = req.body;

    if (!order_id || !actor_id || !dispute_reason) {
      return res.status(400).json({ success: false, message: 'order_id, actor_id, and dispute_reason are required' });
    }

    const result = escrowEngine.executeCompensatingRefund(order_id, actor_id, dispute_reason);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/escrow/audit-ledger
router.get('/audit-ledger', (req: Request, res: Response) => {
  try {
    const { order_id } = req.query;
    const ledger = storageService.getAuditLedger(order_id as string);
    res.json({ success: true, count: ledger.length, data: ledger });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
