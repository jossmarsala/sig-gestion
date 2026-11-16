import type {
  ClienteRow,
  CreateVentaPayload,
  MedioPago,
  UsuarioRow,
  VentaWithDetalle,
} from '@/lib/api/types/db.types'
import type {
  NewSaleFormData,
  PaymentMethod,
  SaleItem,
  SaleRecord,
  SalesKpiData,
} from '../types/sales.types'

const PAYMENT_TO_MEDIO: Record<Exclude<PaymentMethod, 'Dividido'>, MedioPago> = {
  Efectivo: 'efectivo',
  Transferencia: 'transferencia',
  'Mercado Pago': 'mercado_pago',
  Tarjeta: 'tarjeta',
}

const MEDIO_TO_PAYMENT: Record<MedioPago, PaymentMethod> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  mercado_pago: 'Mercado Pago',
  tarjeta: 'Tarjeta',
}

/** Fallback when the product name doesn't reveal the category. */
const CATEGORY_BY_ID: Record<number, SaleItem['category']> = {
  1: 'Anillos',
  2: 'Aros',
  3: 'Cadenas',
  4: 'Pulseras',
}

export interface SalesLookups {
  usuarios: UsuarioRow[]
  clientes: ClienteRow[]
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function categoryOf(nombre: string, idCategoria?: number): SaleItem['category'] {
  const name = normalize(nombre)

  if (name.includes('anillo') || name.includes('alianza')) return 'Anillos'
  if (name.includes('aro') || name.includes('argolla')) return 'Aros'
  if (name.includes('cadena') || name.includes('dije') || name.includes('gargantilla')) {
    return 'Cadenas'
  }
  if (name.includes('pulsera')) return 'Pulseras'

  return (idCategoria ? CATEGORY_BY_ID[idCategoria] : undefined) ?? 'Anillos'
}

function toDate(value: string): Date {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date() : date
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function formatHora(date: Date): string {
  return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

function fullName(nombre: string, apellido: string): string {
  return `${nombre} ${apellido}`.trim()
}

/** DB row (snake_case + detalle) -> UI model used by SalesPage/Dashboard. */
export function toSaleRecord(row: VentaWithDetalle, lookups: SalesLookups): SaleRecord {
  const fecha = toDate(row.fecha_venta)
  const cliente = lookups.clientes.find((item) => item.id_cliente === row.id_cliente)
  const vendedor = lookups.usuarios.find((item) => item.id_usuario === row.id_vendedor)

  const items: SaleItem[] = (row.detalle_venta ?? []).map((detalle) => ({
    id: String(detalle.id_producto),
    name: detalle.producto?.nombre ?? `Producto #${detalle.id_producto}`,
    category: categoryOf(detalle.producto?.nombre ?? '', detalle.producto?.id_categoria),
    quantity: Number(detalle.cantidad),
    unitPrice: Number(detalle.precio_unitario),
  }))

  return {
    id: String(row.id_venta),
    ticketNumber: `TK-${String(row.id_venta).padStart(5, '0')}`,
    fecha: isSameLocalDay(fecha, new Date()) ? 'Hoy' : fecha.toLocaleDateString('es-AR'),
    fechaCompleta: fecha.toLocaleDateString('es-AR'),
    hora: formatHora(fecha),
    productosTexto: items.map((item) => item.name).join(', '),
    items,
    total: Number(row.total),
    cliente: cliente
      ? fullName(cliente.nombre, cliente.apellido)
      : row.id_cliente
        ? `Cliente #${row.id_cliente}`
        : 'Consumidor final',
    clienteContacto: cliente?.telefono ?? cliente?.mail ?? undefined,
    estado: 'completado',
    pago: MEDIO_TO_PAYMENT[row.medio_pago] ?? 'Efectivo',
    discountAmount: Number(row.descuento) > 0 ? Number(row.descuento) : undefined,
    vendedor: vendedor
      ? fullName(vendedor.nombre, vendedor.apellido)
      : `Usuario #${row.id_vendedor}`,
    notas: row.notas ?? undefined,
  }
}

/** Numeric `id_vendedor` required by POST /api/ventas. */
export function resolveVendedorId(profileId?: string | null): number {
  if (profileId && /^\d+$/.test(profileId)) return Number(profileId)

  const fromEnv = Number(import.meta.env.VITE_DEFAULT_VENDEDOR_ID)
  return Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : 1
}

/**
 * UI form -> POST /api/ventas payload.
 *
 * Limitations of the current backend that are made explicit here:
 * - the schema stores a single `medio_pago`; split payments are kept in `notas`
 *   and the first method is stored as the sale method;
 * - `id_cliente` can't be resolved from a free-text name (no client picker yet),
 *   so the name is preserved in `notas` and the FK is left null.
 */
export function toCreateVentaPayload(
  form: NewSaleFormData,
  vendedorId: number
): CreateVentaPayload {
  if (form.items.length === 0) {
    throw new Error('La venta debe incluir al menos un producto.')
  }

  const items = form.items.map((item) => {
    const idProducto = Number(item.id)
    if (!Number.isInteger(idProducto) || idProducto <= 0) {
      throw new Error(
        `El artículo "${item.name}" no tiene un id_producto válido. Agregalo desde el catálogo.`
      )
    }

    return {
      id_producto: idProducto,
      cantidad: item.quantity,
      precio_unitario: item.unitPrice,
    }
  })

  const rawTotal = form.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )
  const descuento = form.discountPercent
    ? Math.round((rawTotal * form.discountPercent) / 100)
    : 0

  const metodo =
    form.pago === 'Dividido'
      ? form.splitPayments?.[0]?.method ?? 'Efectivo'
      : form.pago

  const notas: string[] = []
  if (form.notas?.trim()) notas.push(form.notas.trim())

  const cliente = form.cliente.trim()
  if (cliente && !/^consumidor final$/i.test(cliente)) {
    notas.push(`Cliente: ${cliente}`)
  }

  if (form.pago === 'Dividido' && form.splitPayments?.length) {
    const detalle = form.splitPayments
      .filter((split) => split.amount > 0)
      .map((split) => `${split.method} $${split.amount.toLocaleString('es-AR')}`)
      .join(' + ')
    if (detalle) notas.push(`Pago dividido: ${detalle}`)
  }

  return {
    id_vendedor: vendedorId,
    id_cliente: null,
    id_caja: null,
    descuento,
    notas: notas.length > 0 ? notas.join(' • ') : null,
    medio_pago: PAYMENT_TO_MEDIO[metodo],
    items,
  }
}

/** Builds the record returned by `createSale` (used for the success toast). */
export function buildCreatedSaleRecord(
  form: NewSaleFormData,
  created: VentaWithDetalle,
  vendedorNombre: string
): SaleRecord {
  const fecha = toDate(created.fecha_venta)

  return {
    id: String(created.id_venta),
    ticketNumber: `TK-${String(created.id_venta).padStart(5, '0')}`,
    fecha: 'Hoy',
    fechaCompleta: fecha.toLocaleDateString('es-AR'),
    hora: formatHora(fecha),
    productosTexto: form.items.map((item) => item.name).join(', '),
    items: form.items,
    total: Number(created.total),
    cliente: form.cliente || 'Consumidor final',
    clienteContacto: form.clienteContacto,
    estado: 'completado',
    pago: form.pago,
    splitPayments: form.splitPayments,
    discountAmount: Number(created.descuento) > 0 ? Number(created.descuento) : undefined,
    discountCode: form.discountCode,
    vendedor: vendedorNombre,
    notas: created.notas ?? form.notas,
    ringSize: form.ringSize,
  }
}

const pctChange = (current: number, previous: number): number => {
  if (previous > 0) return Math.round(((current - previous) / previous) * 100)
  return current > 0 ? 100 : 0
}

/**
 * KPIs derived from the same rows the table shows: current month vs previous
 * month (count and revenue).
 */
export function computeSalesKpis(rows: VentaWithDetalle[]): SalesKpiData {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const previous = new Date(currentYear, currentMonth - 1, 1)

  let ventasEsteMes = 0
  let ingresosTotales = 0
  let ventasMesPasado = 0
  let ingresosMesPasado = 0

  for (const row of rows) {
    const fecha = toDate(row.fecha_venta)
    const total = Number(row.total) || 0

    if (fecha.getFullYear() === currentYear && fecha.getMonth() === currentMonth) {
      ventasEsteMes += 1
      ingresosTotales += total
    } else if (
      fecha.getFullYear() === previous.getFullYear() &&
      fecha.getMonth() === previous.getMonth()
    ) {
      ventasMesPasado += 1
      ingresosMesPasado += total
    }
  }

  return {
    ventasEsteMes,
    ventasMesPasado,
    ventasVariacionPct: pctChange(ventasEsteMes, ventasMesPasado),
    ingresosTotales,
    ingresosMesPasado,
    ingresosVariacionPct: pctChange(ingresosTotales, ingresosMesPasado),
  }
}
