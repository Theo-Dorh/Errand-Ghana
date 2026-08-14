import { Router, Request, Response } from 'express';
import { storageService } from '../services/storageService.ts';

const router = Router();

// GET /api/offers?list_id=xxx
router.get('/', (req: Request, res: Response) => {
  try {
    const { list_id } = req.query;
    if (!list_id) {
      return res.status(400).json({ success: false, message: 'list_id parameter is required' });
    }
    const offers = storageService.getOffersByListId(list_id as string);
    res.json({ success: true, count: offers.length, data: offers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/offers
router.post('/', (req: Request, res: Response) => {
  try {
    const { list_id, store_id, offered_total_price, delivery_fee, fulfillment_time_hours, store_notes } = req.body;

    if (!list_id || !store_id || offered_total_price === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required offer fields' });
    }

    const offer = storageService.createStoreOffer(
      list_id,
      store_id,
      Number(offered_total_price),
      Number(delivery_fee || 15.0),
      Number(fulfillment_time_hours || 2.0),
      store_notes
    );

    res.status(201).json({ success: true, message: 'Merchant offer submitted successfully', data: offer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
