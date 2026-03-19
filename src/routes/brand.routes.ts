import { Router } from 'express';
import * as brandController from '../controllers/brand.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', brandController.getAll);
router.get('/:id', brandController.getById);

// Protected routes
router.post('/', authenticateAdmin, brandController.create);
router.patch('/:id', authenticateAdmin, brandController.update);
router.delete('/:id', authenticateAdmin, brandController.remove);

export default router;
