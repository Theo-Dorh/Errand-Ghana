import { Router, Request, Response } from 'express';
import { storageService } from '../services/storageService.ts';
import { escrowEngine } from '../services/escrowEngine.ts';

const router = Router();

// GET /api/orders
router.get('/', (req: Request, res: Response) => {
  try {
    const { shopper_id, store_id, escrow_status } = req.query;
    const orders = storageService.getOrders({
      shopper_id: shopper_id as string,
      store_id: store_id as string,
      escrow_status: escrow_status as string,
    });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/orders/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const order = storageService.getOrderById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const messages = storageService.getOrderMessages(id);
    res.json({ success: true, data: { ...order, messages } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/orders/accept-offer (Transitions to Escrow Preparation)
router.post('/accept-offer', (req: Request, res: Response) => {
  try {
    const { list_id, offer_id, shopper_id, momo_provider, momo_number } = req.body;

    if (!list_id || !offer_id || !shopper_id || !momo_number) {
      return res.status(400).json({ success: false, message: 'Missing required order placement parameters' });
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

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/orders/:id/status (Merchant status update: in_transit or delivered)
router.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const { actor_id, status } = req.body;

    if (!actor_id || !status || !['in_transit', 'delivered'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status (in_transit, delivered) and actor_id required' });
    }

    const result = escrowEngine.updateTransitStatus(id, actor_id, status as 'in_transit' | 'delivered');
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/orders/:id/messages
router.post('/:id/messages', (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const { sender_id, sender_name, message } = req.body;

    if (!sender_id || !message) {
      return res.status(400).json({ success: false, message: 'Sender ID and message are required' });
    }

    const newMsg = storageService.addOrderMessage(id, sender_id, sender_name || 'User', message);
    res.status(201).json({ success: true, data: newMsg });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
