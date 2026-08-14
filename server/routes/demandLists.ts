import { Router, Request, Response } from 'express';
import { storageService } from '../services/storageService.ts';

const router = Router();

// GET /api/demand-lists
router.get('/', (req: Request, res: Response) => {
  try {
    const { neighborhood, category, status } = req.query;
    const lists = storageService.getDemandLists({
      neighborhood: neighborhood as string,
      category: category as string,
      status: status as string,
    });
    res.json({ success: true, count: lists.length, data: lists });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/demand-lists/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const list = storageService.getDemandListById(id);
    if (!list) {
      return res.status(404).json({ success: false, message: 'Demand list not found' });
    }
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/demand-lists
router.post('/', (req: Request, res: Response) => {
  try {
    const { shopper_id, title, neighborhood, delivery_address, total_target_budget, urgency, notes, items } = req.body;

    if (!shopper_id || !title || !neighborhood || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'Missing required demand list fields or items' });
    }

    const calculatedBudget = total_target_budget || items.reduce((sum: number, item: any) => sum + (item.target_price * item.quantity), 0);

    const newList = storageService.createDemandList(
      shopper_id,
      title,
      neighborhood,
      delivery_address || `${neighborhood}, Greater Accra`,
      calculatedBudget,
      urgency || 'Standard (2-4 hrs)',
      notes || '',
      items
    );

    res.status(201).json({ success: true, message: 'Demand list published to marketplace', data: newList });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
