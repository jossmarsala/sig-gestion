import { supabase } from '../config/supabase.js';

// === PARTE 1: CREATE Y DELETE (Santi) ===

// HU-01: Servicio backend para inserción (Create) y validación de datos (issue #65)
export const createProducto = async (req, res) => {
  try {
    const {
      sku,
      nombre,
      descripcion = null,
      precio,
      stock,
      ruta_imagen = null,
      visibilidad = true,
      id_categoria,
      id_material,
      id_impuesto
    } = req.body;

// Validar campos obligatorios segun esquema BaseDatos.md
if (
      !sku ||
      !nombre ||
      precio === undefined ||
      stock === undefined ||
      !id_categoria ||
      !id_material ||
      !id_impuesto
    ) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios: sku, nombre, precio, stock, id_categoria, id_material, id_impuesto'
      });
    }

    if (Number(precio) < 0 || Number(stock) < 0) {
      return res.status(400).json({
        error: 'El precio y el stock no pueden ser negativos'
      });
    }

    const { data, error } = await supabase
      .from('producto')
      .insert([
        {
          sku: String(sku).trim(),
          nombre: String(nombre).trim(),
          descripcion,
          precio: Number(precio),
          stock: Number(stock),
          ruta_imagen,
          visibilidad: Boolean(visibilidad),
          id_categoria: Number(id_categoria),
          id_material: Number(id_material),
          id_impuesto: Number(id_impuesto)
        }
      ])
      .select(`
        *,
        categoria (*),
        materiales (*)
      `)
      .single();

    if (error) {
      // Código 23505 de PostgreSQL = violación de constraint UNIQUE (sku duplicado)
      if (error.code === '23505') {
        return res.status(409).json({ error: `Ya existe un producto con el SKU '${sku}'` });
      }
      throw error;
    }

    return res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      data
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// === PARTE 2: READ Y UPDATE (Franco) ===

// HU-03: Leer productos con soporte para filtro de búsqueda en tiempo real (Issue #69)
export const getProductos = async (req, res) => {
  try {
    const { search } = req.query;

    let query = supabase
      .from('producto')
      .select(`
        *,
        categoria (id_categoria, nombre),
        materiales (id_material, descripcion)
      `)
      .order('nombre', { ascending: true });

    
    if (search && search.trim() !== '') {
      query = query.or(`nombre.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// HU-02: Actualizar producto con validación stock >= 0 (Issue #67)
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sku,
      nombre,
      descripcion,
      precio,
      stock,
      ruta_imagen,
      visibilidad,
      id_categoria,
      id_material,
      id_impuesto
    } = req.body;

    // Validación Issue #67: impedir stock negativo
    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({ error: 'El stock no puede ser negativo (stock >= 0)' });
    }

    
    const camposActualizados = {
      ...(sku !== undefined && { sku }),
      ...(nombre !== undefined && { nombre }),
      ...(descripcion !== undefined && { descripcion }),
      ...(precio !== undefined && { precio }),
      ...(stock !== undefined && { stock }),
      ...(ruta_imagen !== undefined && { ruta_imagen }),
      ...(visibilidad !== undefined && { visibilidad }),
      ...(id_categoria !== undefined && { id_categoria }),
      ...(id_material !== undefined && { id_material }),
      ...(id_impuesto !== undefined && { id_impuesto })
    };

    const { data, error } = await supabase
      .from('producto')
      .update(camposActualizados)
      .eq('id_producto', id)
      .select();

    if (error) throw error;

    res.status(200).json({ mensaje: 'Producto actualizado', data: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// HU-01: Eliminar producto (necesario para el diálogo de borrado del frontend).
// Si el producto ya fue vendido, la FK de detalle_venta devuelve 23503 y se
// responde 409 para no romper el historial.
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('producto')
      .delete()
      .eq('id_producto', id);

    if (error) {
      if (error.code === '23503') {
        return res.status(409).json({
          error:
            'No se puede eliminar el producto porque tiene ventas asociadas. Desactivá su visibilidad en su lugar.',
        });
      }
      throw error;
    }

    return res.status(200).json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};