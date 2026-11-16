import { Router } from 'express';
import { getPedidos, createPedido, updatePedido } from '../controllers/pedidoController.js';

const router = Router();

router.get('/', getPedidos);
router.post('/', createPedido);
router.put('/:id', updatePedido);

export default router;