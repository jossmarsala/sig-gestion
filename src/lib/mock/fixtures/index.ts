import type {
  CajaRow,
  CategoriaRow,
  ClienteRow,
  DetalleVentaRow,
  GastoRow,
  ImpuestoRow,
  MaterialRow,
  PagoPedidoRow,
  PedidoRow,
  ProductoRow,
  ProveedorRow,
  UsuarioRow,
  VentaRow,
} from '@/lib/api/types/db.types'

import { cajasSeed, gastosSeed } from './caja'
import { categoriasSeed, impuestosSeed, materialesSeed, proveedoresSeed } from './catalogos'
import { pagosPedidoSeed, pedidosSeed } from './pedidos'
import { detallesVentaSeed, ventasSeed } from './ventas'
import { clientesSeed, usuariosSeed } from './personas'
import { productosSeed } from './productos'

/**
 * Complete in-memory mirror of the real schema. Handlers read/write this
 * object, so every simulated endpoint behaves like the Express + Supabase one
 * (including stock decrements and generated ids).
 */
export interface MockDatabase {
  categoria: CategoriaRow[]
  materiales: MaterialRow[]
  impuestos: ImpuestoRow[]
  proveedor: ProveedorRow[]
  producto: ProductoRow[]
  usuario: UsuarioRow[]
  cliente: ClienteRow[]
  venta: VentaRow[]
  detalle_venta: DetalleVentaRow[]
  pedido: PedidoRow[]
  pago_pedido: PagoPedidoRow[]
  caja: CajaRow[]
  gasto: GastoRow[]
}

export function createSeedDatabase(): MockDatabase {
  return {
    categoria: categoriasSeed,
    materiales: materialesSeed,
    impuestos: impuestosSeed,
    proveedor: proveedoresSeed,
    producto: productosSeed,
    usuario: usuariosSeed,
    cliente: clientesSeed,
    venta: ventasSeed,
    detalle_venta: detallesVentaSeed,
    pedido: pedidosSeed,
    pago_pedido: pagosPedidoSeed,
    caja: cajasSeed,
    gasto: gastosSeed,
  }
}
