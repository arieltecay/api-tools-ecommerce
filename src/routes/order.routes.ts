import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = Router();

/**
 * RUTAS PÚBLICAS (Para la Shop)
 */
// Los clientes deben poder crear pedidos sin ser administradores
router.post('/', orderController.create);

/**
 * RUTAS PRIVADAS (Para el Admin)
 */
// Solo los administradores pueden listar, ver detalles o cambiar estados
router.get('/', authenticateAdmin, orderController.getAll);
router.get('/:id', authenticateAdmin, orderController.getById);
router.patch('/:id/status', authenticateAdmin, orderController.updateStatus);

export default router;
