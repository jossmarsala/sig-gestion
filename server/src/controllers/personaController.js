import { supabase } from '../config/supabase.js';

/**
 * GET /api/usuarios
 * El frontend necesita resolver id_vendedor / id_orfebre a un nombre.
 * Se listan columnas explícitas para no exponer `contrasena`.
 */
export const getUsuarios = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('id_usuario, nombre, apellido, mail, telefono, rol')
      .order('apellido', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data ?? []);
  } catch (err) {
    return res.status(500).json({ error: 'Error interno al obtener usuarios' });
  }
};

/**
 * GET /api/clientes
 * Necesario para mostrar el cliente de una venta y, más adelante, para
 * resolver id_cliente al crear pedidos.
 */
export const getClientes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cliente')
      .select('*')
      .order('apellido', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data ?? []);
  } catch (err) {
    return res.status(500).json({ error: 'Error interno al obtener clientes' });
  }
};
