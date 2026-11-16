import { api } from '@/lib/api/client'
import type {
  ClienteRow,
  CreateVentaPayload,
  MensajeDataResponse,
  UsuarioRow,
  VentaDiariaResponse,
  VentaWithDetalle,
} from '@/lib/api/types/db.types'

/** Mirrors `src/backend/src/routes/ventaRoutes.js` + personaRoutes.js. */
export const salesApi = {
  list: () => api.get<VentaWithDetalle[]>('/api/ventas'),

  daily: (fecha?: string) =>
    api.get<VentaDiariaResponse>('/api/ventas/diarias', { query: { fecha } }),

  create: (payload: CreateVentaPayload) =>
    api.post<MensajeDataResponse<VentaWithDetalle>>('/api/ventas', payload),

  usuarios: () => api.get<UsuarioRow[]>('/api/usuarios'),

  clientes: () => api.get<ClienteRow[]>('/api/clientes'),
}
