import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateAdmin);

router.get('/', customerController.getAll);
router.get('/:id', customerController.getById);
router.post('/', customerController.create);
router.patch('/:id', customerController.update);
router.delete('/:id', customerController.remove);

export default router;
