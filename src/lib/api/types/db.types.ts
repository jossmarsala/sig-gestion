/**
 * Types for the REAL Supabase schema (see `derDataBaseActualizado.jpeg` and the
 * backend controllers). The old `lib/supabase/database.types.ts` describes
 * tables that do not exist (`products`, `sales`, `workshop_orders`, ...), so it
 * is intentionally not used by the API layer.
 *
 * Naming mirrors PostgreSQL exactly (Spanish snake_case) so fixtures, MSW
 * handlers and the Express controllers all agree.
 */

export type MedioPago = 'efectivo' | 'mercado_pago' | 'transferencia' | 'tarjeta'

export type EstadoPedido = 'en_espera' | 'en_taller' | 'listo_entrega' | 'entregado'

export type TipoTrabajo = 'reparacion' | 'confeccion' | 'garantia' | 'otro'

export type CategoriaGasto =
  | 'servicios'
  | 'insumos_taller'
  | 'metales_piedras'
  | 'alquiler_expensas'
  | 'sueldos_honorarios'
  | 'mantenimiento'
  | 'otros'

// ---------------------------------------------------------------------------
// Catálogos
// ---------------------------------------------------------------------------

export interface CategoriaRow {
  id_categoria: number
  nombre: string
  descripcion: string | null
}

export interface MaterialRow {
  id_material: number
  descripcion: string
  precio_m2: number | null
  id_impuesto: number | null
  id_proveedor: number | null
}

export interface ImpuestoRow {
  id_impuesto: number
  nombre: string
  porcentaje: number
}

export interface ProveedorRow {
  id_proveedor: number
  nombre: string
  telefono: string | null
  cuit: string | null
  direccion: string | null
}

export interface CatalogosResponse {
  categorias: CategoriaRow[]
  materiales: MaterialRow[]
  impuestos: ImpuestoRow[]
}

// ---------------------------------------------------------------------------
// Producto
// ---------------------------------------------------------------------------

export interface ProductoRow {
  id_producto: number
  sku: string
  nombre: string
  descripcion: string | null
  precio: number
  stock: number
  ruta_imagen: string | null
  visibilidad: boolean
  id_categoria: number
  id_material: number
  id_impuesto: number
}

/** Shape returned by GET/POST /api/productos (nested selects). */
export interface ProductoWithRelations extends ProductoRow {
  categoria: Pick<CategoriaRow, 'id_categoria' | 'nombre'> | null
  materiales: Pick<MaterialRow, 'id_material' | 'descripcion'> | null
}

export interface CreateProductoPayload {
  sku: string
  nombre: string
  descripcion?: string | null
  precio: number
  stock: number
  ruta_imagen?: string | null
  visibilidad?: boolean
  id_categoria: number
  id_material: number
  id_impuesto: number
}

export type UpdateProductoPayload = Partial<CreateProductoPayload>

// ---------------------------------------------------------------------------
// Usuarios / clientes
// ---------------------------------------------------------------------------

export interface UsuarioRow {
  id_usuario: number
  nombre: string
  apellido: string
  mail: string
  contrasena?: string | null
  telefono: string | null
  rol: string | null
}

export interface ClienteRow {
  id_cliente: number
  nombre: string
  apellido: string
  telefono: string | null
  mail: string | null
  dni_cuit: string | null
  fecha_registro: string | null
}

// ---------------------------------------------------------------------------
// Ventas
// ---------------------------------------------------------------------------

export interface VentaRow {
  id_venta: number
  id_vendedor: number
  id_cliente: number | null
  id_caja: number | null
  fecha_venta: string
  descuento: number
  notas: string | null
  medio_pago: MedioPago
  total: number
}

export interface DetalleVentaRow {
  id_detalle: number
  id_venta: number
  id_producto: number
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface DetalleVentaWithProducto extends DetalleVentaRow {
  producto: ProductoRow | null
}

export interface VentaWithDetalle extends VentaRow {
  detalle_venta: DetalleVentaWithProducto[]
}

export interface CreateVentaItemPayload {
  id_producto: number
  cantidad: number
  precio_unitario?: number
}

export interface CreateVentaPayload {
  id_vendedor: number
  id_cliente?: number | null
  id_caja?: number | null
  descuento?: number
  notas?: string | null
  medio_pago: MedioPago
  items: CreateVentaItemPayload[]
}

export interface VentaDiariaResponse {
  fecha: string
  cantidad_ventas: number
  total_recaudado: number
  ventas: VentaWithDetalle[]
}

// ---------------------------------------------------------------------------
// Pedidos de taller
// ---------------------------------------------------------------------------

export interface PedidoRow {
  id_pedido: number
  id_orfebre: number | null
  id_cliente: number | null
  fecha_inicio: string
  fecha_entrega: string | null
  tipo_trabajo: TipoTrabajo | string
  estado: EstadoPedido
  piezas: string
  observaciones: string | null
  ruta_imagen: string | null
  pago_total: number
}

/** Shape returned by GET /api/pedidos (joins cliente + usuario). */
export interface PedidoWithRelations extends PedidoRow {
  cliente: ClienteRow | null
  usuario: UsuarioRow | null
}

export interface PagoPedidoRow {
  id_pago_pedido: number
  id_pedido: number
  id_caja: number | null
  fecha_pago: string
  monto: number
  medio_pago: MedioPago
}

// ---------------------------------------------------------------------------
// Caja / gastos
// ---------------------------------------------------------------------------

export interface CajaRow {
  id_caja: number
  id_usuario_apertura: number
  horario_apertura: string
  horario_cierre: string | null
  efectivo_inicial: number
  efectivo_contado: number | null
  efectivo_esperado: number | null
  observaciones: string | null
}

export interface GastoRow {
  id_gasto: number
  descripcion: string
  monto: number
  fecha: string
  beneficiario: string | null
  categoria: CategoriaGasto | string
  medio_pago: MedioPago
  id_caja: number | null
}

// ---------------------------------------------------------------------------
// Envelopes used by the current Express controllers (they are inconsistent:
// list endpoints return bare arrays, writes return different wrappers).
// ---------------------------------------------------------------------------

export interface MensajeDataResponse<T> {
  mensaje: string
  data: T
}
