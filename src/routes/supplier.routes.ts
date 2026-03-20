import { Router } from 'express';
import * as supplierController from '../controllers/supplier.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateAdmin);

router.get('/', supplierController.getAll);
router.post('/', supplierController.create);
router.patch('/:id', supplierController.update);

export default router;
