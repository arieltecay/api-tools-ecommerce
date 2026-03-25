import { Router } from 'express';
import * as discountCodeController from '../controllers/discount-code/discount-code.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateAdmin, discountCodeController.getAll);
router.post('/validate', discountCodeController.validate);
router.post('/', authenticateAdmin, discountCodeController.create);

export default router;
