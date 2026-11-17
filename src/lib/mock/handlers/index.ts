import {
  createProductoHandler,
  deleteProductoHandler,
  getCatalogosHandler,
  getProductosHandler,
  updateProductoHandler,
} from './productos'
import { getPedidosHandler, createPedidoHandler, updatePedidoHandler } from './pedidos'
import { createVentaHandler, getVentasDiariasHandler, getVentasHandler } from './ventas'
import { getClientesHandler, getUsuariosHandler } from './personas'

/**
 * One handler per real backend route. Keep this list in sync with
 * `src/backend/src/routes/*.js`.
 */
export const handlers = [
  getCatalogosHandler,
  getProductosHandler,
  createProductoHandler,
  updateProductoHandler,
  deleteProductoHandler,
  getVentasDiariasHandler,
  getVentasHandler,
  createVentaHandler,
  getPedidosHandler,
  createPedidoHandler,
  updatePedidoHandler,
  getUsuariosHandler,
  getClientesHandler,
]
