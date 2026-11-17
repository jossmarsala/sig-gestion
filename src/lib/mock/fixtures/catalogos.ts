import type {
  CategoriaRow,
  ImpuestoRow,
  MaterialRow,
  ProveedorRow,
} from '@/lib/api/types/db.types'

export const categoriasSeed: CategoriaRow[] = [
  { id_categoria: 1, nombre: 'Anillos', descripcion: 'Alianzas, solitarios y anillos de sello' },
  { id_categoria: 2, nombre: 'Aros', descripcion: 'Argollas, aros con piedra y caravanas' },
  { id_categoria: 3, nombre: 'Cadenas', descripcion: 'Cadenas, dijes y gargantillas' },
  { id_categoria: 4, nombre: 'Pulseras', descripcion: 'Pulseras rígidas, eslabonadas y de cuero' },
]

export const impuestosSeed: ImpuestoRow[] = [
  { id_impuesto: 1, nombre: 'IVA 21%', porcentaje: 21 },
  { id_impuesto: 2, nombre: 'Exento', porcentaje: 0 },
]

export const materialesSeed: MaterialRow[] = [
  { id_material: 1, descripcion: 'Plata 925', precio_m2: 18500, id_impuesto: 1, id_proveedor: 1 },
  { id_material: 2, descripcion: 'Oro amarillo 18k', precio_m2: 148000, id_impuesto: 1, id_proveedor: 1 },
  { id_material: 3, descripcion: 'Oro blanco 18k', precio_m2: 152000, id_impuesto: 1, id_proveedor: 1 },
  { id_material: 4, descripcion: 'Plata 925 rodiada', precio_m2: 21000, id_impuesto: 1, id_proveedor: 2 },
  { id_material: 5, descripcion: 'Acero quirúrgico', precio_m2: 4200, id_impuesto: 1, id_proveedor: 2 },
  { id_material: 6, descripcion: 'Cuero vacuno', precio_m2: 3800, id_impuesto: 1, id_proveedor: 2 },
  { id_material: 7, descripcion: 'Platino', precio_m2: 210000, id_impuesto: 1, id_proveedor: 1 },
]

export const proveedoresSeed: ProveedorRow[] = [
  {
    id_proveedor: 1,
    nombre: 'Metales Finos S.A.',
    telefono: '+54 11 4001-2200',
    cuit: '30-71234567-8',
    direccion: 'Av. Belgrano 1240, CABA',
  },
  {
    id_proveedor: 2,
    nombre: 'Mayorista Fornituras Sur',
    telefono: '+54 11 4300-7788',
    cuit: '30-70987654-1',
    direccion: 'Rivadavia 3380, CABA',
  },
  {
    id_proveedor: 3,
    nombre: 'Insumos Joyeros del Centro',
    telefono: '+54 11 4381-5510',
    cuit: '30-71456789-3',
    direccion: 'Sarmiento 1890, CABA',
  },
]
