import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateAdmin);

router.get('/', settingsController.get);
router.patch('/', settingsController.update);

export default router;
