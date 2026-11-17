import type {
  CatalogosResponse,
  CreateProductoPayload,
  MaterialRow,
  ProductoWithRelations,
  UpdateProductoPayload,
} from '@/lib/api/types/db.types'
import type {
  NewProductFormData,
  ProductCategoryKey,
  ProductItem,
} from '../types/products.types'

const CATEGORY_ALIASES: Record<string, ProductCategoryKey> = {
  anillo: 'Anillos',
  anillos: 'Anillos',
  aro: 'Aros',
  aros: 'Aros',
  cadena: 'Cadenas',
  cadenas: 'Cadenas',
  dije: 'Cadenas',
  dijes: 'Cadenas',
  pulsera: 'Pulseras',
  pulseras: 'Pulseras',
}

function normalize(value: string | null | undefined): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function toCategoryKey(nombre: string | null | undefined): ProductCategoryKey {
  const key = CATEGORY_ALIASES[normalize(nombre)]
  if (!key) {
    console.warn(`[productos] Categoría desconocida "${nombre}", se usa "Anillos".`)
    return 'Anillos'
  }
  return key
}

/** DB row (snake_case) -> UI model (Spanish camelCase). */
export function toProductItem(row: ProductoWithRelations): ProductItem {
  return {
    id: String(row.id_producto),
    name: row.nombre,
    code: row.sku,
    category: toCategoryKey(row.categoria?.nombre),
    price: Number(row.precio),
    stock: Number(row.stock),
    metalPurity: row.materiales?.descripcion ?? undefined,
    imageUrl: row.ruta_imagen ?? undefined,
    description: row.descripcion ?? undefined,
    isRemoteVisible: row.visibilidad,
    // `producto` has no cost, weight, min-stock or history columns, so those
    // optional UI fields stay undefined until the schema adds them.
  }
}

function findCategoriaId(catalogs: CatalogosResponse, category: ProductCategoryKey): number {
  const categoria = catalogs.categorias.find(
    (row) => normalize(row.nombre) === normalize(category)
  )
  if (!categoria) {
    throw new Error(
      `La categoría "${category}" no existe en la base de datos. Agregala en la tabla categoria.`
    )
  }
  return categoria.id_categoria
}

function findMaterial(catalogs: CatalogosResponse, metalPurity?: string): MaterialRow | undefined {
  if (!metalPurity?.trim()) return undefined
  return catalogs.materiales.find(
    (row) => normalize(row.descripcion) === normalize(metalPurity)
  )
}

function defaultImpuestoId(catalogs: CatalogosResponse): number {
  if (catalogs.impuestos.length === 0) {
    throw new Error('No hay impuestos cargados en la base de datos.')
  }

  // Prefer the general VAT rate over "Exento" (the backend sorts by percentage).
  const general = catalogs.impuestos.find((row) => normalize(row.nombre).includes('general'))
  if (general) return general.id_impuesto

  const highest = [...catalogs.impuestos].sort(
    (a, b) => Number(b.porcentaje) - Number(a.porcentaje)
  )[0]
  return highest.id_impuesto
}

/** UI form -> POST /api/productos payload (requires catalog ids). */
export function toCreateProductoPayload(
  form: NewProductFormData,
  catalogs: CatalogosResponse
): CreateProductoPayload {
  const id_categoria = findCategoriaId(catalogs, form.category)

  const material = findMaterial(catalogs, form.metalPurity) ?? catalogs.materiales[0]
  if (!material) {
    throw new Error('No hay materiales cargados en la base de datos.')
  }

  if (form.metalPurity?.trim() && !findMaterial(catalogs, form.metalPurity)) {
    throw new Error(
      `El material "${form.metalPurity}" no existe en la tabla materiales. Elegí un material existente.`
    )
  }

  return {
    sku: form.code,
    nombre: form.name,
    descripcion: form.description?.trim() || null,
    precio: form.price,
    stock: form.stock,
    ruta_imagen: form.imageUrl || null,
    visibilidad: true,
    id_categoria,
    id_material: material.id_material,
    id_impuesto: defaultImpuestoId(catalogs),
  }
}

/**
 * UI form -> PUT /api/productos/:id payload.
 * Only resolves catalog ids when the category/material actually changed.
 */
export function toUpdateProductoPayload(
  form: NewProductFormData,
  current: ProductItem,
  catalogs: CatalogosResponse
): UpdateProductoPayload {
  const payload: UpdateProductoPayload = {
    sku: form.code,
    nombre: form.name,
    precio: form.price,
    stock: form.stock,
    descripcion: form.description?.trim() || null,
    ruta_imagen: form.imageUrl || null,
  }

  if (form.category !== current.category) {
    payload.id_categoria = findCategoriaId(catalogs, form.category)
  }

  const nextMaterialName = form.metalPurity?.trim()
  if (nextMaterialName && nextMaterialName !== current.metalPurity) {
    const material = findMaterial(catalogs, nextMaterialName)
    if (!material) {
      throw new Error(
        `El material "${nextMaterialName}" no existe en la tabla materiales. Elegí un material existente.`
      )
    }
    payload.id_material = material.id_material
  }

  return payload
}
