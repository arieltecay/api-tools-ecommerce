import { Router } from 'express';
import * as stockMovementController from '../controllers/stock-movement.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateAdmin);

router.get('/', stockMovementController.getAll);

export default router;
