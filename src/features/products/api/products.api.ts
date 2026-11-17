import { api } from '@/lib/api/client'
import type {
  CatalogosResponse,
  CreateProductoPayload,
  MensajeDataResponse,
  ProductoRow,
  ProductoWithRelations,
  UpdateProductoPayload,
} from '@/lib/api/types/db.types'

/** Mirrors `src/backend/src/routes/productoRoutes.js` + `catalogoRoutes.js`. */
export const productsApi = {
  list: (search?: string) =>
    api.get<ProductoWithRelations[]>('/api/productos', { query: { search } }),

  create: (payload: CreateProductoPayload) =>
    api.post<MensajeDataResponse<ProductoWithRelations>>('/api/productos', payload),

  update: (id: string | number, payload: UpdateProductoPayload) =>
    api.put<MensajeDataResponse<ProductoRow>>(`/api/productos/${id}`, payload),

  remove: (id: string | number) =>
    api.delete<{ mensaje: string }>(`/api/productos/${id}`),

  catalogs: () => api.get<CatalogosResponse>('/api/catalogos'),
}
