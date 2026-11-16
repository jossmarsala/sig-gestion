import { http, HttpResponse } from 'msw'
import { apiBaseUrl } from '@/lib/api/config'
import type {
  CreateVentaPayload,
  DetalleVentaRow,
  MedioPago,
  VentaRow,
} from '@/lib/api/types/db.types'
import { getDb, saveDb } from '../db'
import { nextId, ventaWithDetalle } from '../joins'
import { jsonError, readJson, simulateNetwork } from './utils'

const MEDIOS_PAGO_VALIDOS: MedioPago[] = ['efectivo', 'mercado_pago', 'transferencia', 'tarjeta']

const ventasUrl = `${apiBaseUrl}/api/ventas`

/** GET /api/ventas/diarias?fecha=YYYY-MM-DD */
export const getVentasDiariasHandler = http.get(`${ventasUrl}/diarias`, async ({ request }) => {
  const early = await simulateNetwork()
  if (early) return early

  const fechaParam = new URL(request.url).searchParams.get('fecha')
  const fecha = fechaParam || new Date().toISOString().split('T')[0]

  const db = getDb()
  const ventas = db.venta
    .filter((venta) => venta.fecha_venta >= `${fecha}T00:00:00` && venta.fecha_venta <= `${fecha}T23:59:59`)
    .sort((a, b) => b.fecha_venta.localeCompare(a.fecha_venta))
    .map(ventaWithDetalle)

  const totalRecaudado = ventas.reduce((acc, venta) => acc + Number(venta.total || 0), 0)

  return HttpResponse.json({
    fecha,
    cantidad_ventas: ventas.length,
    total_recaudado: totalRecaudado,
    ventas,
  })
})

/** GET /api/ventas */
export const getVentasHandler = http.get(ventasUrl, async () => {
  const early = await simulateNetwork()
  if (early) return early

  const db = getDb()
  const ventas = [...db.venta]
    .sort((a, b) => b.fecha_venta.localeCompare(a.fecha_venta))
    .map(ventaWithDetalle)

  return HttpResponse.json(ventas)
})

/** POST /api/ventas */
export const createVentaHandler = http.post(ventasUrl, async ({ request }) => {
  const early = await simulateNetwork()
  if (early) return early

  const body = await readJson<CreateVentaPayload>(request)
  if (!body) return jsonError('JSON inválido', 400)

  if (!body.id_vendedor || !body.medio_pago) {
    return jsonError('Faltan campos obligatorios: id_vendedor y medio_pago', 400)
  }

  if (!MEDIOS_PAGO_VALIDOS.includes(body.medio_pago)) {
    return jsonError(
      `medio_pago inválido. Valores permitidos: ${MEDIOS_PAGO_VALIDOS.join(', ')}`,
      400
    )
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return jsonError('La venta debe incluir al menos un producto en el array items', 400)
  }

  const db = getDb()
  const productos = new Map<number, (typeof db.producto)[number]>()

  for (const item of body.items) {
    if (!item.id_producto || !item.cantidad || Number(item.cantidad) <= 0) {
      return jsonError('Cada item debe tener id_producto y cantidad mayor a 0', 400)
    }

    const producto = db.producto.find((row) => row.id_producto === Number(item.id_producto))
    if (!producto) {
      return jsonError(`El producto con id_producto=${item.id_producto} no existe`, 404)
    }

    if (producto.stock < Number(item.cantidad)) {
      return jsonError(
        `Stock insuficiente para '${producto.nombre}'. Disponible: ${producto.stock}, solicitado: ${item.cantidad}`,
        400
      )
    }

    productos.set(producto.id_producto, producto)
  }

  let sumaSubtotales = 0
  const detallesPreparados = body.items.map((item) => {
    const producto = productos.get(Number(item.id_producto))!
    const cantidad = Number(item.cantidad)
    const precioUnitario =
      item.precio_unitario !== undefined ? Number(item.precio_unitario) : Number(producto.precio)
    sumaSubtotales += cantidad * precioUnitario

    return {
      id_producto: producto.id_producto,
      cantidad,
      precio_unitario: precioUnitario,
    }
  })

  const descuento = Number(body.descuento) || 0
  const totalFinal = Math.max(0, sumaSubtotales - descuento)

  const ventaCreada: VentaRow = {
    id_venta: nextId(db.venta, 'id_venta'),
    id_vendedor: Number(body.id_vendedor),
    id_cliente: body.id_cliente ? Number(body.id_cliente) : null,
    id_caja: body.id_caja ? Number(body.id_caja) : null,
    fecha_venta: new Date().toISOString(),
    descuento,
    notas: body.notas ?? null,
    medio_pago: body.medio_pago,
    total: totalFinal,
  }

  db.venta.push(ventaCreada)

  const detallesCreados: DetalleVentaRow[] = detallesPreparados.map((detalle) => {
    const fila: DetalleVentaRow = {
      id_detalle: nextId(db.detalle_venta, 'id_detalle'),
      id_venta: ventaCreada.id_venta,
      id_producto: detalle.id_producto,
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precio_unitario,
      subtotal: detalle.cantidad * detalle.precio_unitario,
    }
    db.detalle_venta.push(fila)
    return fila
  })

  for (const detalle of detallesPreparados) {
    const producto = db.producto.find((row) => row.id_producto === detalle.id_producto)!
    producto.stock -= detalle.cantidad
  }

  saveDb()

  return HttpResponse.json(
    {
      mensaje: 'Venta registrada y stock actualizado correctamente',
      data: { ...ventaCreada, detalle_venta: detallesCreados },
    },
    { status: 201 }
  )
})
