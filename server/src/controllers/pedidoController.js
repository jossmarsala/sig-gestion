import { supabase } from '../config/supabase.js';

const ESTADOS_VALIDOS = ['en_espera', 'en_taller', 'listo_entrega', 'entregado'];

export const getPedidos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pedido')
      .select('*, cliente(*), usuario(*)')
      .order('fecha_inicio', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error interno al obtener pedidos' });
  }
};

export const createPedido = async (req, res) => {
  try {
    const nuevoPedido = {
      ...req.body,
      estado: req.body.estado || 'en_espera',
    };

    if (!ESTADOS_VALIDOS.includes(nuevoPedido.estado)) {
      return res.status(400).json({ error: `Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}` });
    }

    const { data, error } = await supabase
      .from('pedido')
      .insert([nuevoPedido])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error interno al crear el pedido' });
  }
};

export const updatePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, ...restoCampos } = req.body;

    if (estado !== undefined && !ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({
        error: `Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`,
      });
    }

    const payload = estado !== undefined ? { ...restoCampos, estado } : restoCampos;

    const { data, error } = await supabase
      .from('pedido')
      .update(payload)
      .eq('id_pedido', id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error interno al actualizar el pedido' });
  }
};