import { http, HttpResponse } from 'msw'
import { apiBaseUrl } from '@/lib/api/config'
import type {
  CreateProductoPayload,
  ProductoRow,
  UpdateProductoPayload,
} from '@/lib/api/types/db.types'
import { getDb, saveDb } from '../db'
import { nextId, productoWithRelations } from '../joins'
import { jsonError, readJson, simulateNetwork } from './utils'

const productosUrl = `${apiBaseUrl}/api/productos`

/** GET /api/productos?search= */
export const getProductosHandler = http.get(productosUrl, async ({ request }) => {
  const early = await simulateNetwork()
  if (early) return early

  const search = new URL(request.url).searchParams.get('search')?.trim().toLowerCase()
  const db = getDb()

  const rows = db.producto
    .filter((producto) => {
      if (!search) return true
      return (
        producto.nombre.toLowerCase().includes(search) ||
        producto.sku.toLowerCase().includes(search)
      )
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    .map(productoWithRelations)

  return HttpResponse.json(rows)
})

/** POST /api/productos */
export const createProductoHandler = http.post(productosUrl, async ({ request }) => {
  const early = await simulateNetwork()
  if (early) return early

  const body = await readJson<CreateProductoPayload>(request)
  if (!body) return jsonError('JSON inválido', 400)

  if (
    !body.sku ||
    !body.nombre ||
    body.precio === undefined ||
    body.stock === undefined ||
    !body.id_categoria ||
    !body.id_material ||
    !body.id_impuesto
  ) {
    return jsonError(
      'Faltan campos obligatorios: sku, nombre, precio, stock, id_categoria, id_material, id_impuesto',
      400
    )
  }

  if (Number(body.precio) < 0 || Number(body.stock) < 0) {
    return jsonError('El precio y el stock no pueden ser negativos', 400)
  }

  const db = getDb()
  const sku = String(body.sku).trim()

  if (db.producto.some((producto) => producto.sku.toLowerCase() === sku.toLowerCase())) {
    return jsonError(`Ya existe un producto con el SKU '${sku}'`, 409)
  }

  const nuevo: ProductoRow = {
    id_producto: nextId(db.producto, 'id_producto'),
    sku,
    nombre: String(body.nombre).trim(),
    descripcion: body.descripcion ?? null,
    precio: Number(body.precio),
    stock: Number(body.stock),
    ruta_imagen: body.ruta_imagen ?? null,
    visibilidad: body.visibilidad === undefined ? true : Boolean(body.visibilidad),
    id_categoria: Number(body.id_categoria),
    id_material: Number(body.id_material),
    id_impuesto: Number(body.id_impuesto),
  }

  db.producto.push(nuevo)
  saveDb()

  return HttpResponse.json(
    { mensaje: 'Producto creado exitosamente', data: productoWithRelations(nuevo) },
    { status: 201 }
  )
})

/** PUT /api/productos/:id */
export const updateProductoHandler = http.put(`${productosUrl}/:id`, async ({ request, params }) => {
  const early = await simulateNetwork()
  if (early) return early

  const id = Number(params.id)
  const body = await readJson<UpdateProductoPayload>(request)
  if (!body) return jsonError('JSON inválido', 400)

  if (body.stock !== undefined && Number(body.stock) < 0) {
    return jsonError('El stock no puede ser negativo (stock >= 0)', 400)
  }

  const db = getDb()
  const index = db.producto.findIndex((producto) => producto.id_producto === id)
  if (index === -1) return jsonError('Producto no encontrado', 404)

  const actual = db.producto[index]
  const actualizado: ProductoRow = {
    ...actual,
    ...(body.sku !== undefined && { sku: body.sku }),
    ...(body.nombre !== undefined && { nombre: body.nombre }),
    ...(body.descripcion !== undefined && { descripcion: body.descripcion }),
    ...(body.precio !== undefined && { precio: Number(body.precio) }),
    ...(body.stock !== undefined && { stock: Number(body.stock) }),
    ...(body.ruta_imagen !== undefined && { ruta_imagen: body.ruta_imagen }),
    ...(body.visibilidad !== undefined && { visibilidad: Boolean(body.visibilidad) }),
    ...(body.id_categoria !== undefined && { id_categoria: Number(body.id_categoria) }),
    ...(body.id_material !== undefined && { id_material: Number(body.id_material) }),
    ...(body.id_impuesto !== undefined && { id_impuesto: Number(body.id_impuesto) }),
  }

  db.producto[index] = actualizado
  saveDb()

  return HttpResponse.json({ mensaje: 'Producto actualizado', data: actualizado })
})

/**
 * DELETE /api/productos/:id
 * Not present in the original controller; added to the backend as a hard
 * delete and mirrored here (409 when referenced by a sale).
 */
export const deleteProductoHandler = http.delete(`${productosUrl}/:id`, async ({ params }) => {
  const early = await simulateNetwork()
  if (early) return early

  const id = Number(params.id)
  const db = getDb()
  const index = db.producto.findIndex((producto) => producto.id_producto === id)
  if (index === -1) return jsonError('Producto no encontrado', 404)

  const referenced = db.detalle_venta.some((detalle) => detalle.id_producto === id)
  if (referenced) {
    return jsonError(
      'No se puede eliminar el producto porque tiene ventas asociadas. Desactivá su visibilidad en su lugar.',
      409
    )
  }

  db.producto.splice(index, 1)
  saveDb()

  return HttpResponse.json({ mensaje: 'Producto eliminado' })
})

/** GET /api/catalogos */
export const getCatalogosHandler = http.get(`${apiBaseUrl}/api/catalogos`, async () => {
  const early = await simulateNetwork()
  if (early) return early

  const db = getDb()
  return HttpResponse.json({
    categorias: db.categoria,
    materiales: db.materiales,
    impuestos: db.impuestos,
  })
})
