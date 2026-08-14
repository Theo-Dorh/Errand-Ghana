import { Router, Request, Response } from 'express';
import { storageService } from '../services/storageService.ts';

const router = Router();

// GET /api/admin/metrics
router.get('/metrics', (_req: Request, res: Response) => {
  try {
    const metrics = storageService.getAdminMetrics();
    res.json({ success: true, data: metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/kyc-stores
router.get('/kyc-stores', (_req: Request, res: Response) => {
  try {
    const stores = storageService.getProfiles().filter((p) => p.role === 'store');
    res.json({ success: true, count: stores.length, data: stores });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/kyc-stores/:id/approve
router.patch('/kyc-stores/:id/approve', (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const { is_approved } = req.body;
    const updated = storageService.updateProfile(id, { is_approved: is_approved ?? true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Store profile not found' });
    }

    storageService.recordAuditEntry({
      action: is_approved ? 'KYC_MERCHANT_APPROVED' : 'KYC_MERCHANT_REJECTED',
      actor_id: '55555555-5555-5555-5555-555555555555',
      actor_role: 'admin',
      state_before: is_approved ? 'UNVERIFIED' : 'APPROVED',
      state_after: is_approved ? 'APPROVED' : 'REJECTED',
      metadata: { store_id: id, store_name: updated.store_name },
    });

    res.json({ success: true, message: `Store KYC status updated to ${is_approved ? 'Approved' : 'Rejected'}`, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/profiles
router.get('/profiles', (_req: Request, res: Response) => {
  try {
    const profiles = storageService.getProfiles();
    res.json({ success: true, count: profiles.length, data: profiles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/users (Create a new user with role)
router.post('/users', (req: Request, res: Response) => {
  try {
    const { email, full_name, role, momo_number, momo_provider, neighborhood, store_name, kyc_ghana_card } = req.body;

    if (!email || !full_name || !role) {
      return res.status(400).json({ success: false, message: 'Email, full name, and role are required' });
    }

    const newProfile = storageService.createProfile({
      email,
      full_name,
      role,
      momo_number: momo_number || '0244000000',
      momo_provider: momo_provider || 'MTN_MOMO',
      neighborhood: neighborhood || 'Accra Central',
      store_name: role === 'store' ? store_name || `${full_name} Mart` : undefined,
      kyc_ghana_card: role === 'store' ? kyc_ghana_card || 'GHA-000000000-0' : undefined,
      is_approved: true,
      rating: 5.0,
    });

    res.status(201).json({ success: true, message: `User created with role ${role}`, data: newProfile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/users/:id/role (Update user role)
router.patch('/users/:id/role', (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const { role } = req.body;

    if (!role || !['shopper', 'store', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Valid role (shopper, store, admin) is required' });
    }

    const updated = storageService.updateProfile(id, { role });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: `User role updated to ${role}`, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const deleted = storageService.deleteProfile(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
