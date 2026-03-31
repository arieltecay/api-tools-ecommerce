import { Router } from 'express';
import { HeroSlideController } from '../controllers/hero-slide/controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public route for Shop
router.get('/public', HeroSlideController.getPublic);

// Protected routes for Admin
router.get('/', authenticateAdmin, HeroSlideController.getAll);
router.get('/:id', authenticateAdmin, HeroSlideController.getById);
router.post('/', authenticateAdmin, HeroSlideController.create);
router.patch('/:id', authenticateAdmin, HeroSlideController.update);
router.delete('/:id', authenticateAdmin, HeroSlideController.delete);

export default router;
