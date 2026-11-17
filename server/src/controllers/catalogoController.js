import { supabase } from '../config/supabase.js';

/**
 * Catálogos necesarios para crear/editar productos.
 * No existían endpoints de lectura para estas tablas y el frontend necesita
 * resolver id_categoria / id_material / id_impuesto por nombre.
 */
export const getCatalogos = async (req, res) => {
  try {
    const [categorias, materiales, impuestos] = await Promise.all([
      supabase.from('categoria').select('*').order('nombre', { ascending: true }),
      supabase.from('materiales').select('*').order('descripcion', { ascending: true }),
      supabase.from('impuestos').select('*').order('porcentaje', { ascending: true }),
    ]);

    for (const result of [categorias, materiales, impuestos]) {
      if (result.error) throw result.error;
    }

    return res.status(200).json({
      categorias: categorias.data ?? [],
      materiales: materiales.data ?? [],
      impuestos: impuestos.data ?? [],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
