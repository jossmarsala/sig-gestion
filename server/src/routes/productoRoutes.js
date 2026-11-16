import express from 'express';
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from '../controllers/productoController.js';

const router = express.Router();

router.get('/', getProductos);          // GET /api/productos
router.post('/', createProducto);       // POST /api/productos
router.put('/:id', updateProducto);     // PUT /api/productos/:id
router.delete('/:id', deleteProducto);  // DELETE /api/productos/:id

export default router;

