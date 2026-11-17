import { supabase } from '../config/supabase.js';

const MEDIOS_PAGO_VALIDOS = ['efectivo', 'mercado_pago', 'transferencia', 'tarjeta'];

// POST /api/ventas — Issue #79 (santi-248)
export const createVenta = async (req, res) => {
  try {
    const {
      id_vendedor,
      id_cliente = null,
      id_caja = null,
      descuento = 0,
      notas = null,
      medio_pago,
      items
    } = req.body;

    // 1. Validaciones de entrada
    if (!id_vendedor || !medio_pago) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: id_vendedor y medio_pago'
      });
    }

    if (!MEDIOS_PAGO_VALIDOS.includes(medio_pago)) {
      return res.status(400).json({
        error: `medio_pago inválido. Valores permitidos: ${MEDIOS_PAGO_VALIDOS.join(', ')}`
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'La venta debe incluir al menos un producto en el array items'
      });
    }

    // 2. Verificar existencia y stock disponible de TODOS los productos antes de grabar nada
    const productosEnBD = new Map();

    for (const item of items) {
      if (!item.id_producto || !item.cantidad || Number(item.cantidad) <= 0) {
        return res.status(400).json({
          error: 'Cada item debe tener id_producto y cantidad mayor a 0'
        });
      }

      const { data: prod, error: prodError } = await supabase
        .from('producto')
        .select('id_producto, nombre, precio, stock')
        .eq('id_producto', item.id_producto)
        .single();

      if (prodError || !prod) {
        return res.status(404).json({
          error: `El producto con id_producto=${item.id_producto} no existe`
        });
      }

      if (prod.stock < Number(item.cantidad)) {
        return res.status(400).json({
          error: `Stock insuficiente para '${prod.nombre}'. Disponible: ${prod.stock}, solicitado: ${item.cantidad}`
        });
      }

      productosEnBD.set(item.id_producto, prod);
    }

    // 3. Calcular total final en memoria (subtotal en detalle_venta lo calcula PostgreSQL solo)
    let sumaSubtotales = 0;
    const detallesPreparados = items.map((item) => {
      const prod = productosEnBD.get(item.id_producto);
      const cantidad = Number(item.cantidad);
      const precioUnitario = item.precio_unitario !== undefined ? Number(item.precio_unitario) : Number(prod.precio);
      sumaSubtotales += cantidad * precioUnitario;

      return {
        id_producto: Number(item.id_producto),
        cantidad,
        precio_unitario: precioUnitario
      };
    });

    const descuentoNumerico = Number(descuento) || 0;
    const totalFinal = Math.max(0, sumaSubtotales - descuentoNumerico);

    // 4. Insertar cabecera en 'venta'
    const { data: ventaCreada, error: ventaError } = await supabase
      .from('venta')
      .insert([
        {
          id_vendedor: Number(id_vendedor),
          id_cliente: id_cliente ? Number(id_cliente) : null,
          id_caja: id_caja ? Number(id_caja) : null,
          fecha_venta: new Date().toISOString(),
          descuento: descuentoNumerico,
          notas,
          medio_pago,
          total: totalFinal
        }
      ])
      .select()
      .single();

    if (ventaError) throw ventaError;

    // 5. Insertar renglones en 'detalle_venta' (con rollback manual si falla)
    const filasDetalle = detallesPreparados.map((d) => ({
      id_venta: ventaCreada.id_venta,
      ...d
    }));

    const { data: detallesCreados, error: detalleError } = await supabase
      .from('detalle_venta')
      .insert(filasDetalle)
      .select();

    if (detalleError) {
      await supabase.from('venta').delete().eq('id_venta', ventaCreada.id_venta);
      throw detalleError;
    }

    // 6. Descontar stock en 'producto'
    for (const d of detallesPreparados) {
      const prod = productosEnBD.get(d.id_producto);
      const nuevoStock = prod.stock - d.cantidad;

      const { error: stockError } = await supabase
        .from('producto')
        .update({ stock: nuevoStock })
        .eq('id_producto', d.id_producto);

      if (stockError) throw stockError;
    }

    return res.status(201).json({
      mensaje: 'Venta registrada y stock actualizado correctamente',
      data: {
        ...ventaCreada,
        detalle_venta: detallesCreados
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/ventas — Issue #81 (franrojas1818-ux)
export const getVentas = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('venta')
      .select('*, detalle_venta(*, producto(*))')
      .order('fecha_venta', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error interno al obtener ventas' });
  }
};

// GET /api/ventas/diarias?fecha=YYYY-MM-DD — Issue #81 (franrojas1818-ux)
export const getVentasDiarias = async (req, res) => {
  try {
    const fecha = req.query.fecha || new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('venta')
      .select('*, detalle_venta(*, producto(*))')
      .gte('fecha_venta', `${fecha}T00:00:00`)
      .lte('fecha_venta', `${fecha}T23:59:59`)
      .order('fecha_venta', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    const totalRecaudado = data.reduce((acc, venta) => acc + Number(venta.total || 0), 0);

    return res.json({
      fecha,
      cantidad_ventas: data.length,
      total_recaudado: totalRecaudado,
      ventas: data,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno al calcular ventas diarias' });
  }
};

