import { Router } from 'express';
import * as purchaseInvoiceController from '../controllers/purchase-invoice.controller';

const router = Router();

router.get('/', purchaseInvoiceController.getAll);
router.post('/', purchaseInvoiceController.create);

export default router;
