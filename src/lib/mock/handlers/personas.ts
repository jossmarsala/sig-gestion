import { http, HttpResponse } from 'msw'
import { apiBaseUrl } from '@/lib/api/config'
import { getDb } from '../db'
import { simulateNetwork } from './utils'

const usuariosUrl = `${apiBaseUrl}/api/usuarios`
const clientesUrl = `${apiBaseUrl}/api/clientes`

/** GET /api/usuarios — columnas explícitas (sin contrasena), como el backend. */
export const getUsuariosHandler = http.get(usuariosUrl, async () => {
  const early = await simulateNetwork()
  if (early) return early

  const usuarios = getDb()
    .usuario.map((usuario) => ({
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      mail: usuario.mail,
      telefono: usuario.telefono,
      rol: usuario.rol,
    }))
    .sort((a, b) => a.apellido.localeCompare(b.apellido, 'es'))

  return HttpResponse.json(usuarios)
})

/** GET /api/clientes */
export const getClientesHandler = http.get(clientesUrl, async () => {
  const early = await simulateNetwork()
  if (early) return early

  const clientes = [...getDb().cliente].sort((a, b) =>
    a.apellido.localeCompare(b.apellido, 'es')
  )

  return HttpResponse.json(clientes)
})
