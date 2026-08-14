import { Router, Request, Response } from 'express';
import { mlBenchmarkService } from '../services/mlBenchmarkService.ts';

const router = Router();

// GET /api/ml/price-benchmark
router.get('/price-benchmark', (req: Request, res: Response) => {
  try {
    const { itemName, category, shopperBudget, storeOffer } = req.query;

    if (!itemName || !shopperBudget) {
      return res.status(400).json({
        success: false,
        message: 'itemName and shopperBudget query parameters are required',
      });
    }

    const result = mlBenchmarkService.calculateBenchmark(
      itemName as string,
      (category as string) || 'Fresh Produce',
      Number(shopperBudget),
      storeOffer ? Number(storeOffer) : undefined
    );

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/ml/list-benchmark
router.post('/list-benchmark', (req: Request, res: Response) => {
  try {
    const { title, items, totalOfferedPrice } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'items array is required' });
    }

    const result = mlBenchmarkService.calculateListBenchmark(
      title || 'Market Demand List',
      items,
      totalOfferedPrice ? Number(totalOfferedPrice) : undefined
    );

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
