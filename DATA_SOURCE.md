# Capa de datos: API real vs. datos simulados

La UI **no sabe** de dónde vienen los datos. Todos los módulos hablan con
`src/lib/api/client.ts`; el origen se decide en un único lugar:
`src/lib/api/config.ts`.

```
Componente / hook  ->  feature/api/*.api.ts  ->  apiRequest()
                                                        |
                          VITE_DATA_SOURCE=mock ------> MSW (fixtures con forma de la DB)
                          VITE_DATA_SOURCE=api  ------> Express http://localhost:3001
```

## Cambiar de modo

### 1. Variable de entorno (recomendado para CI / deploy)

`src/frontend/.env`:

```bash
VITE_DATA_SOURCE=mock   # datos simulados
VITE_API_URL=http://localhost:3001
VITE_MOCK_LATENCY_MS=350
```

Para usar la base real:

```bash
VITE_DATA_SOURCE=api
```

### 2. Sin rebuilding (runtime)

Desde la consola del navegador:

```js
aguamarinaDataSource.set('api')    // recarga y usa el backend
aguamarinaDataSource.set('mock')   // recarga y usa fixtures
aguamarinaDataSource.clear()       // vuelve al valor de .env
```

En desarrollo también hay un indicador en el pie del sidebar
(`Datos simulados` / `API real`): un click cambia de modo y recarga. El botón
de reset vuelve al valor de `.env`.

> En builds de producción el indicador no se muestra (`import.meta.env.DEV`).
> Si no se define `VITE_DATA_SOURCE`, en producción se usa `api` y en
> desarrollo `mock`.

## Qué está simulado hoy

Los handlers replican **el backend real**, incluidos sus envelopes irregulares,
validaciones, mensajes de error y efectos secundarios:

| Endpoint | Handler | Notas de fidelidad |
|---|---|---|
| `GET /api/productos?search=` | `mock/handlers/productos.ts` | array plano, joins `categoria` + `materiales`, orden por nombre |
| `POST /api/productos` | idem | 400 campos faltantes/negativos, 409 SKU duplicado, 201 `{mensaje,data}` |
| `PUT /api/productos/:id` | idem | stock >= 0, actualización parcial, 200 `{mensaje,data}` |
| `DELETE /api/productos/:id` | idem | 409 si el producto tiene ventas (FK) |
| `GET /api/catalogos` | idem | categorías, materiales e impuestos |
| `GET /api/ventas` | `mock/handlers/ventas.ts` | array con `detalle_venta.producto` |
| `GET /api/ventas/diarias?fecha=` | idem | `{fecha,cantidad_ventas,total_recaudado,ventas}` |
| `POST /api/ventas` | idem | valida medio de pago, stock, descuenta stock, crea detalle |
| `GET /api/pedidos` | `mock/handlers/pedidos.ts` | joins `cliente` + `usuario` |
| `POST /api/pedidos` | idem | estado por defecto `en_espera`, valida enum |
| `PUT /api/pedidos/:id` | idem | valida enum, respuesta = fila plana |
| `GET /api/usuarios` | `mock/handlers/personas.ts` | columnas explícitas (sin `contrasena`), orden por apellido |
| `GET /api/clientes` | idem | filas de `cliente`, orden por apellido |

Las fixtures (`mock/fixtures/*.ts`) son filas de PostgreSQL, no modelos de UI:

```
categoria, materiales, impuestos, proveedor, producto,
usuario, cliente, venta, detalle_venta, pedido, pago_pedido, caja, gasto
```

Los adaptadores (`features/<modulo>/api/*.adapters.ts`) traducen
`snake_case` de la DB al modelo que ya usan los componentes.

### Persistencia y helpers

- Las mutaciones simuladas se guardan en `localStorage`
  (`aguamarina:mock-db:v1`), así que sobreviven a un refresh.
- `aguamarinaMock.reset()` restaura las fixtures originales.
- `aguamarinaMock.failNext(500)` hace fallar la próxima request simulada
  (sirve para probar el manejo de errores; también acepta 401/404).
- La latencia se controla con `VITE_MOCK_LATENCY_MS`.

## Módulos integrados

| Módulo | Estado | Data real |
|---|---|---|
| Productos | ✅ integrado y verificado | `GET/POST/PUT/DELETE /api/productos` + `/api/catalogos` |
| Ventas | ✅ integrado y verificado (lectura) | `GET /api/ventas` (+ `/usuarios`, `/clientes` para nombres), `POST /api/ventas` |
| Pedidos | 🔜 capa lista, UI pendiente | `GET/POST/PUT /api/pedidos` |
| Gastos, Caja, Estadísticas, Resumen | ⛔ sin endpoints | siguen usando mocks locales |
| Auth | ⛔ | Supabase directo + perfil dev de fallback |

En Productos:

- Categoría, material e impuesto salen de `GET /api/catalogos`; nunca se
  escriben ids a mano.
- El material es un `<Select>` con las filas reales de `materiales` (el
  formulario no permite texto libre en modo API, así la FK siempre existe).
- El impuesto por defecto prefiere la tasa general (`IVA General`) en lugar de
  la primera fila, que suele ser `Exento`.
- `visibilidad`, stock y precio se actualizan con `PUT /api/productos/:id`; el
  stock en 0 se sigue mostrando como `Sin stock`.

En Ventas:

- Los KPIs (ventas e ingresos del mes vs. mes anterior) se calculan a partir de
  las mismas filas de `venta` que muestra la tabla.
- El diálogo de venta usa el catálogo real (`useProducts`): los `id` de cada
  artículo son `id_producto`, y las cantidades se topan con el stock disponible.
- `id_vendedor` sale de `VITE_DEFAULT_VENDEDOR_ID` (el perfil de Supabase no
  está vinculado a la tabla `usuario` todavía).
- **Anular/eliminar ventas no existe**: es regla de negocio y la acción se
  quitó de la tabla y del contexto.
- **Cambios de producto** no están soportados por el backend: el diálogo sigue
  visible, pero `confirmExchange` rechaza con 501 y se muestra el mensaje.

## Gaps conocidos del backend (importante)

1. **No hay endpoints de escritura** para `gasto`, `historial_caja`,
   `pago_pedido`, `cliente`, `usuario` ni agregaciones de estadísticas. De
   `categoria`, `materiales` e `impuestos` solo existe el `GET /api/catalogos`
   agregado. `usuario` y `cliente` ahora tienen GET de solo lectura.
2. `GET /api/ventas` no hace join con `usuario`/`cliente`; el frontend resuelve
   los nombres con `GET /api/usuarios` y `GET /api/clientes`.
3. `GET /api/pedidos` no trae `pago_pedido`; la UI no puede mostrar pagos
   parciales de pedidos reales todavía.
4. `POST /api/pedidos` requiere `id_cliente` / `id_orfebre` numéricos y
   `tipo_trabajo` como enum; el formulario actual maneja nombres libres.
   Falta un selector que resuelva esos ids (los GET ya existen).
5. `producto` no tiene columnas para costo, peso, stock mínimo ni historial
   (`history` / `priceHistory` de la UI). En modo real esos campos quedan
   vacíos y los ajustes de stock/precio no dejan historial.
6. La tabla `venta` guarda un solo `medio_pago`: los pagos divididos se
   registran con el primer método y el detalle queda en `notas`. El nombre del
   cliente (texto libre) también se guarda en `notas`, con `id_cliente = null`.
7. No existe tabla ni endpoint de cambios/devoluciones (`confirmExchange`).
8. No hay middleware de auth/roles en Express: cualquier request entra.
   El login del frontend sigue yendo contra Supabase, no contra `usuario`.
9. Los envelopes son inconsistentes (arrays planos vs `{mensaje,data}` vs fila
   plana). Los adaptadores ya lo contemplan.

## Agregar un módulo nuevo

1. Agregá las filas/tipos en `src/lib/api/types/db.types.ts`.
2. Sumá la fixture en `src/lib/mock/fixtures/` y al `MockDatabase`.
3. Escribí el handler en `src/lib/mock/handlers/` y registralo en
   `handlers/index.ts` (un handler por ruta real).
4. Creá `features/<modulo>/api/<modulo>.api.ts` + `*.adapters.ts`.
5. Creá `features/<modulo>/hooks/use<Modulo>.ts` con React Query
   (`queryKey`, `queryFn`, mutaciones + `invalidateQueries`).
6. Reemplazá el `useState(INITIAL_...)` de la página por el hook. Los
   componentes/hijos no cambian.

## Backend agregado en este cambio

- `GET /api/catalogos` (`catalogoController.js` / `catalogoRoutes.js`):
  necesario para resolver `id_categoria`, `id_material`, `id_impuesto` al
  crear/editar productos.
- `GET /api/usuarios` y `GET /api/clientes` (`personaController.js` /
  `personaRoutes.js`): nombres de vendedor y cliente en ventas. `usuario` se
  selecciona con columnas explícitas para no exponer `contrasena`.
- `DELETE /api/productos/:id`: hard delete, 409 si la FK de `detalle_venta`
  lo impide.
- `index.js`: rutas de pedidos registradas antes de `listen`, 404 JSON para
  `/api/*`.

## Cómo probar

```bash
# Terminal 1 — backend (necesita src/backend/.env con SUPABASE_URL/KEY)
cd src/backend && npm install && npm run dev

# Terminal 2 — frontend
cd src/frontend && npm install && npm run dev
```

- Modo simulado: `VITE_DATA_SOURCE=mock`, abrir `/productos`.
- Modo real: `VITE_DATA_SOURCE=api` (o el badge del sidebar).
- Si el backend está caído, la página muestra el error y un botón
  `Reintentar`; las mutaciones muestran el mensaje del backend en el toast.

## Verificación contra la base real

Última corrida con `VITE_DATA_SOURCE=api` contra el Supabase del proyecto
(4 productos, 3 ventas, 1 cliente con nombre):

- `/productos`: 4 filas reales, categorías y materiales correctos, sin errores
  de consola. Alta de producto (POST 201 + refetch) y borrado (DELETE 200)
  probados con una fila temporal, ya eliminada.
- `/ventas`: 3 ventas reales, cliente `Valentina Ruiz`, KPIs 3 / `$573.000`,
  fechas en hora local. No se crearon ventas de prueba (no hay endpoint de
  anulación y el `POST` descuenta stock de forma permanente).
- El formulario de producto muestra el `<Select>` de material con las 3 filas
  reales (`Oro 18k Amarillo (gramo)`, `Oro Blanco 18k con Diamante`,
  `Plata 925 (gramo)`) y persiste el `id_material` elegido.

> `src/backend/.env` está gitignoreado. No commitear credenciales; la
> publishable key vieja sigue en el historial y conviene rotarla.

