import { Router } from 'express';
import * as supplierController from '../controllers/supplier.controller';

const router = Router();

router.get('/', supplierController.getAll);
router.post('/', supplierController.create);
router.patch('/:id', supplierController.update);

export default router;
