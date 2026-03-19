import { Router } from 'express';
import * as discountCodeController from '../controllers/discount-code.controller';

const router = Router();

router.get('/', discountCodeController.getAll);
router.post('/validate', discountCodeController.validate);
router.post('/', discountCodeController.create);

export default router;
