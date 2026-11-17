import { http, HttpResponse } from 'msw'
import { apiBaseUrl } from '@/lib/api/config'
import type { EstadoPedido, PedidoRow } from '@/lib/api/types/db.types'
import { getDb, saveDb } from '../db'
import { nextId, pedidoWithRelations } from '../joins'
import { jsonError, readJson, simulateNetwork } from './utils'

const ESTADOS_VALIDOS: EstadoPedido[] = ['en_espera', 'en_taller', 'listo_entrega', 'entregado']

const pedidosUrl = `${apiBaseUrl}/api/pedidos`

/** GET /api/pedidos */
export const getPedidosHandler = http.get(pedidosUrl, async () => {
  const early = await simulateNetwork()
  if (early) return early

  const db = getDb()
  const pedidos = [...db.pedido]
    .sort((a, b) => b.fecha_inicio.localeCompare(a.fecha_inicio))
    .map(pedidoWithRelations)

  return HttpResponse.json(pedidos)
})

/** POST /api/pedidos */
export const createPedidoHandler = http.post(pedidosUrl, async ({ request }) => {
  const early = await simulateNetwork()
  if (early) return early

  const body = await readJson<Partial<PedidoRow>>(request)
  if (!body) return jsonError('JSON inválido', 400)

  const estado = (body.estado || 'en_espera') as EstadoPedido
  if (!ESTADOS_VALIDOS.includes(estado)) {
    return jsonError(`Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`, 400)
  }

  const db = getDb()
  const nuevo: PedidoRow = {
    id_pedido: nextId(db.pedido, 'id_pedido'),
    id_orfebre: body.id_orfebre ? Number(body.id_orfebre) : null,
    id_cliente: body.id_cliente ? Number(body.id_cliente) : null,
    fecha_inicio: body.fecha_inicio || new Date().toISOString().split('T')[0],
    fecha_entrega: body.fecha_entrega ?? null,
    tipo_trabajo: body.tipo_trabajo || 'otro',
    estado,
    piezas: body.piezas || '',
    observaciones: body.observaciones ?? null,
    ruta_imagen: body.ruta_imagen ?? null,
    pago_total: Number(body.pago_total ?? 0),
  }

  db.pedido.push(nuevo)
  saveDb()

  return HttpResponse.json(nuevo, { status: 201 })
})

/** PUT /api/pedidos/:id */
export const updatePedidoHandler = http.put(`${pedidosUrl}/:id`, async ({ request, params }) => {
  const early = await simulateNetwork()
  if (early) return early

  const id = Number(params.id)
  const body = await readJson<Partial<PedidoRow>>(request)
  if (!body) return jsonError('JSON inválido', 400)

  const { estado, ...restoCampos } = body

  if (estado !== undefined && !ESTADOS_VALIDOS.includes(estado)) {
    return jsonError(`Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`, 400)
  }

  const db = getDb()
  const index = db.pedido.findIndex((pedido) => pedido.id_pedido === id)
  if (index === -1) return jsonError('Pedido no encontrado', 404)

  const actualizado: PedidoRow = {
    ...db.pedido[index],
    ...restoCampos,
    ...(estado !== undefined && { estado }),
  }

  db.pedido[index] = actualizado
  saveDb()

  return HttpResponse.json(actualizado)
})
