import { Router } from 'express';
import * as importController from '../controllers/import/import.controller';
import { uploadExcel } from '../middleware/upload.middleware';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/products', authenticateAdmin, uploadExcel.single('file'), importController.importProducts);

export default router;
