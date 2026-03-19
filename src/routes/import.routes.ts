import { Router } from 'express';
import * as importController from '../controllers/import.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/products', authenticateAdmin, upload.single('file'), importController.importProducts);

export default router;
