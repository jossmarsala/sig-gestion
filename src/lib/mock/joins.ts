import type {
  PedidoRow,
  PedidoWithRelations,
  ProductoRow,
  ProductoWithRelations,
  VentaRow,
  VentaWithDetalle,
} from '@/lib/api/types/db.types'
import { getDb } from './db'

/** Mirrors `select('*, categoria (...), materiales (...)')`. */
export function productoWithRelations(row: ProductoRow): ProductoWithRelations {
  const db = getDb()
  const categoria = db.categoria.find((item) => item.id_categoria === row.id_categoria)
  const material = db.materiales.find((item) => item.id_material === row.id_material)

  return {
    ...row,
    categoria: categoria
      ? { id_categoria: categoria.id_categoria, nombre: categoria.nombre }
      : null,
    materiales: material
      ? { id_material: material.id_material, descripcion: material.descripcion }
      : null,
  }
}

/** Mirrors `select('*, detalle_venta(*, producto(*))')`. */
export function ventaWithDetalle(row: VentaRow): VentaWithDetalle {
  const db = getDb()

  const detalle_venta = db.detalle_venta
    .filter((detalle) => detalle.id_venta === row.id_venta)
    .sort((a, b) => a.id_detalle - b.id_detalle)
    .map((detalle) => ({
      ...detalle,
      producto: db.producto.find((producto) => producto.id_producto === detalle.id_producto) ?? null,
    }))

  return { ...row, detalle_venta }
}

/** Mirrors `select('*, cliente(*), usuario(*)')`. */
export function pedidoWithRelations(row: PedidoRow): PedidoWithRelations {
  const db = getDb()

  return {
    ...row,
    cliente: db.cliente.find((cliente) => cliente.id_cliente === row.id_cliente) ?? null,
    usuario: db.usuario.find((usuario) => usuario.id_usuario === row.id_orfebre) ?? null,
  }
}

export function nextId<T>(rows: T[], key: keyof T): number {
  return rows.reduce((max, row) => Math.max(max, Number(row[key]) || 0), 0) + 1
}
