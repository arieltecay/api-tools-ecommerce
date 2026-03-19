import { Router } from 'express';
import * as reportController from '../controllers/report.controller';

const router = Router();

router.get('/dashboard', reportController.getDashboard);

export default router;
