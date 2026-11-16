import express from 'express';
import { createVenta, getVentas, getVentasDiarias } from '../controllers/ventaController.js';

const router = express.Router();

router.get('/diarias', getVentasDiarias);
router.get('/', getVentas);
router.post('/', createVenta);

export default router;