import { Router } from 'express';
import * as categoryController from '../controllers/category/category.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// Protected routes
router.post('/', authenticateAdmin, categoryController.create);
router.patch('/:id', authenticateAdmin, categoryController.update);
router.delete('/:id', authenticateAdmin, categoryController.remove);

export default router;
