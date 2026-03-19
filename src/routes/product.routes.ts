import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', productController.getAll);
router.get('/:uuid', productController.getByUuid);
router.get('/slug/:slug', productController.getBySlug);

// Protected routes
router.post('/', authenticateAdmin, productController.create);
router.patch('/:uuid', authenticateAdmin, productController.update);
router.delete('/:uuid', authenticateAdmin, productController.remove);

router.post('/:uuid/images', authenticateAdmin, upload.single('image'), productController.uploadProductImage);

export default router;
