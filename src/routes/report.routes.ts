import { Router } from 'express';
import * as reportController from '../controllers/report/report.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateAdmin);

router.get('/dashboard', reportController.getDashboard);

export default router;
