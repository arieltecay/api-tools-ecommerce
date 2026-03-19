import { Router } from 'express';
import * as stockMovementController from '../controllers/stock-movement.controller';

const router = Router();

router.get('/', stockMovementController.getAll);

export default router;
