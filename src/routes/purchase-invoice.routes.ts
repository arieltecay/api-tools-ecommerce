import { Router } from 'express';
import * as purchaseInvoiceController from '../controllers/purchase-invoice/purchase-invoice.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateAdmin);

router.get('/', purchaseInvoiceController.getAll);
router.post('/', purchaseInvoiceController.create);

export default router;
