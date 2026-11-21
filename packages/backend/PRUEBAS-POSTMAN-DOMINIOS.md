# Pruebas de dominios en Postman

Iniciá el backend desde la raíz del repositorio:

```powershell
npm run dev:backend
```

La URL base es `http://localhost:8000`. En Postman, para las solicitudes con JSON, seleccioná **Body > raw > JSON** o agregá el encabezado:

```http
Content-Type: application/json
```

Las rutas de la API usan el prefijo `http://localhost:8000/api`. Para probar los casos inválidos, enviá cada JSON por separado y verificá que la API responda con error.
La API genera un campo `id` para cada recurso; guardá ese valor en las variables de Postman indicadas abajo y usalo en las solicitudes relacionadas. Los valores entre `{{llaves}}` son variables de Postman que debés reemplazar por esos IDs. Los datos se conservan en memoria mientras el backend está en ejecución y se pierden al reiniciarlo.

## Usuario

### Crear usuario válido

**POST** `http://localhost:8000/api/Usuario`

```json
{
  "nombre": "Ana",
  "apellido": "Lopez",
  "favoritos": []
}
```

### Nombre obligatorio

**POST** `http://localhost:8000/api/Usuario`

```json
{
  "nombre": "",
  "apellido": "Lopez"
}
```

### Apellido obligatorio

**POST** `http://localhost:8000/api/Usuario`

```json
{
  "nombre": "Ana"
}
```

## Categoría

### Crear categoría válida

**POST** `http://localhost:8000/api/Categoria`

```json
{
  "nombre": "Música",
  "descripcion": "Eventos y recitales musicales"
}
```

### Falta descripción

**POST** `http://localhost:8000/api/Categoria`

```json
{
  "nombre": "Música",
  "descripcion": ""
}
```

## Evento

### Crear evento válido

Creá antes una categoría y un usuario, y guardá sus IDs como `categoriaId` y `organizadorId`.

**POST** `http://localhost:8000/api/Evento`

```json
{
  "nombre": "Recital de prueba",
  "descripcion": "Un evento para probar la API",
  "categoria": "{{categoriaId}}",
  "fecha": "2027-05-20T20:00:00.000Z",
  "multimedia": [],
  "organizador": "{{organizadorId}}"
}
```

### Fecha inválida

**POST** `http://localhost:8000/api/Evento`

```json
{
  "nombre": "Recital de prueba",
  "descripcion": "Un evento para probar la API",
  "categoria": "{{categoriaId}}",
  "fecha": "no-es-una-fecha",
  "organizador": "{{organizadorId}}"
}
```

### Falta organizador

**POST** `http://localhost:8000/api/Evento`

```json
{
  "nombre": "Recital de prueba",
  "descripcion": "Un evento para probar la API",
  "categoria": "{{categoriaId}}",
  "fecha": "2027-05-20T20:00:00.000Z"
}
```

## Tipo de entrada

### Crear tipo de entrada válido

Primero creá el evento y guardá su `id` en la variable `eventoId`.
El campo `evento` de esta solicitud indica a qué evento agregar el tipo. El tipo se guarda como subdocumento dentro del evento.

**POST** `http://localhost:8000/api/TipoEntrada`

```json
{
  "nombre": "General",
  "descripcion": "Entrada general",
  "precio": 15000,
  "cupo": 100,
  "evento": "{{eventoId}}"
}
```

### Precio negativo

**POST** `http://localhost:8000/api/TipoEntrada`

```json
{
  "nombre": "General",
  "descripcion": "Entrada general",
  "precio": -1,
  "cupo": 100,
  "evento": "{{eventoId}}"
}
```

### Cupo no entero

**POST** `http://localhost:8000/api/TipoEntrada`

```json
{
  "nombre": "General",
  "descripcion": "Entrada general",
  "precio": 15000,
  "cupo": 1.5,
  "evento": "{{eventoId}}"
}
```

## Compra

### Crear compra válida

Guardá los `id` devueltos al crear el usuario comprador, el evento y un tipo de entrada de ese mismo evento.

**POST** `http://localhost:8000/api/Compra`

```json
{
  "comprador": "{{compradorId}}",
  "evento": "{{eventoId}}",
  "tipoEntrada": "{{tipoEntradaId}}",
  "cantidad": 2,
  "total": 30000,
  "estado": "pendiente",
  "mensajes": []
}
```

### Cantidad debe ser un entero positivo

**POST** `http://localhost:8000/api/Compra`

```json
{
  "comprador": "{{compradorId}}",
  "evento": "{{eventoId}}",
  "tipoEntrada": "{{tipoEntradaId}}",
  "cantidad": 0,
  "total": 30000,
  "estado": "pendiente"
}
```

### Estado inválido

**POST** `http://localhost:8000/api/Compra`

```json
{
  "comprador": "{{compradorId}}",
  "evento": "{{eventoId}}",
  "tipoEntrada": "{{tipoEntradaId}}",
  "cantidad": 2,
  "total": 30000,
  "estado": "en_proceso"
}
```

## Reseña

### Crear reseña válida

**POST** `http://localhost:8000/api/Resenia`

```json
{
  "comprador": "{{compradorId}}",
  "evento": "{{eventoId}}",
  "detalle": "Estuvo muy bueno",
  "puntuacion": 5
}
```

### Puntuación negativa

**POST** `http://localhost:8000/api/Resenia`

```json
{
  "comprador": "{{compradorId}}",
  "evento": "{{eventoId}}",
  "detalle": "Estuvo muy bueno",
  "puntuacion": -1
}
```

### Falta el detalle

**POST** `http://localhost:8000/api/Resenia`

```json
{
  "comprador": "{{compradorId}}",
  "evento": "{{eventoId}}",
  "puntuacion": 5
}
```

## Mensaje

### Crear mensaje válido

**POST** `http://localhost:8000/api/Mensaje`

```json
{
  "usuario": "{{compradorId}}",
  "mensaje": "Hola, tengo una consulta sobre el evento",
  "enviado": "2026-10-27T17:00:00.000Z"
}
```

### Fecha inválida

**POST** `http://localhost:8000/api/Mensaje`

```json
{
  "usuario": "{{compradorId}}",
  "mensaje": "Hola",
  "enviado": "fecha-invalida"
}
```

### Contenido obligatorio

**POST** `http://localhost:8000/api/Mensaje`

```json
{
  "usuario": "{{compradorId}}",
  "mensaje": " "
}
```

## PUT: reemplazar un registro

Para probar **PUT**, usá el `id` de un registro existente en la URL y enviá todos los campos del recurso. Reemplazá los valores de ejemplo por los IDs que devolvieron tus solicitudes. Se espera `200 OK`.

### Usuario

**PUT** `http://localhost:8000/api/Usuario/{id}`

```json
{
  "nombre": "Ana María",
  "apellido": "Lopez",
  "favoritos": []
}
```

### Categoría

**PUT** `http://localhost:8000/api/Categoria/{id}`

```json
{
  "nombre": "Música en vivo",
  "descripcion": "Recitales y conciertos"
}
```

### Evento

**PUT** `http://localhost:8000/api/Evento/{id}`

```json
{
  "nombre": "Recital actualizado",
  "descripcion": "Descripción actualizada",
  "categoria": "{{categoriaId}}",
  "fecha": "2027-05-20T20:00:00.000Z",
  "multimedia": [],
  "organizador": "{{organizadorId}}"
}
```

### Tipo de entrada

**PUT** `http://localhost:8000/api/TipoEntrada/{id}`

```json
{
  "nombre": "General actualizada",
  "descripcion": "Entrada general actualizada",
  "precio": 18000,
  "cupo": 80,
  "evento": "{{eventoId}}"
}
```

### Compra

**PUT** `http://localhost:8000/api/Compra/{id}`

```json
{
  "comprador": "{{compradorId}}",
  "evento": "{{eventoId}}",
  "tipoEntrada": "{{tipoEntradaId}}",
  "cantidad": 2,
  "total": 36000,
  "estado": "confirmada",
  "mensajes": []
}
```

### Reseña

**PUT** `http://localhost:8000/api/Resenia/{id}`

```json
{
  "comprador": "{{compradorId}}",
  "evento": "{{eventoId}}",
  "detalle": "Reseña actualizada",
  "puntuacion": 4
}
```

### Mensaje

**PUT** `http://localhost:8000/api/Mensaje/{id}`

```json
{
  "usuario": "{{compradorId}}",
  "mensaje": "Mensaje actualizado",
  "enviado": "2026-10-27T17:00:00.000Z"
}
```

### Cambio de estado de compra

**PUT** `http://localhost:8000/api/CambioEstadoCompra/{id}`

```json
{
  "compra": "{{compraId}}",
  "estado": "confirmada",
  "quien": "{{usuarioId}}"
}
```

Para este último, `compra` y `quien` deben ser IDs existentes.

## PATCH: actualizar parcialmente

**PATCH** actualiza solo los campos enviados. Por ejemplo:

**PATCH** `http://localhost:8000/api/Resenia/1`

```json
{
  "detalle": "Actualizo mi reseña"
}
```

El `PATCH` combina los campos enviados con los valores actuales del registro. Para `Compra`, podés cambiar el estado con:

**PATCH** `http://localhost:8000/api/Compra/1`

```json
{
  "estado": "confirmada"
}
```

Usá los `id` reales de tus registros en las rutas y los cuerpos. En particular, el `CambioEstadoCompra` requiere IDs existentes de compra y usuario.

## DELETE: eliminar registros

DELETE no requiere JSON en el body. Usá el `id` real del registro que querés eliminar. Se espera `204 No Content`; después podés hacer un **GET** de la colección para comprobar que ya no aparece.

| Recurso | Solicitud |
|---|---|
| Usuario | **DELETE** `http://localhost:8000/api/Usuario/{id}` |
| Categoría | **DELETE** `http://localhost:8000/api/Categoria/{id}` |
| Evento | **DELETE** `http://localhost:8000/api/Evento/{id}` |
| Tipo de entrada | **DELETE** `http://localhost:8000/api/TipoEntrada/{id}` |
| Compra | **DELETE** `http://localhost:8000/api/Compra/{id}` |
| Reseña | **DELETE** `http://localhost:8000/api/Resenia/{id}` |
| Mensaje | **DELETE** `http://localhost:8000/api/Mensaje/{id}` |
| Cambio de estado | **DELETE** `http://localhost:8000/api/CambioEstadoCompra/{id}` |

Probá DELETE al final o con registros creados solo para la prueba, así no eliminás los datos que necesitás para otros endpoints.

---

## Preparación

Los cambios de estado requieren que existan la compra y el usuario indicados. Crealos antes de probar el endpoint.

### 1. Crear un usuario

**POST** `http://localhost:8000/api/Usuario`

```json
{
  "nombre": "Ana",
  "apellido": "Lopez"
}
```

Anotá el `id` de la respuesta; se usará como `quien`.

### 2. Crear una compra

Antes de este paso, creá un evento y un tipo de entrada asociado a ese evento. Usá también un usuario existente como comprador.

**POST** `http://localhost:8000/api/Compra`

```json
{
  "comprador": "{{compradorId}}",
  "evento": "{{eventoId}}",
  "tipoEntrada": "{{tipoEntradaId}}",
  "cantidad": 2,
  "total": 5000,
  "estado": "pendiente"
}
```

Anotá el `id` de la respuesta; se usará como `compra`.

## Crear un cambio de estado válido

**POST** `http://localhost:8000/api/CambioEstadoCompra`

Reemplazá los valores de `compra` y `quien` con los `id` obtenidos en la preparación.

```json
{
  "compra": "{{compraId}}",
  "estado": "pendiente",
  "quien": "{{usuarioId}}"
}
```

Se espera una respuesta `201 Created`. Anotá el `id` devuelto para probar la actualización.

## Casos que deben ser rechazados

Probá cada JSON por separado con **POST** `http://localhost:8000/api/CambioEstadoCompra`.

### Falta el usuario (`quien`)

```json
{
  "compra": "{{compraId}}",
  "estado": "pendiente"
}
```

### Estado inválido

```json
{
  "compra": "{{compraId}}",
  "estado": "en_proceso",
  "quien": "{{usuarioId}}"
}
```

### La compra no existe

```json
{
  "compra": "000000000000000000000000",
  "estado": "pendiente",
  "quien": "{{usuarioId}}"
}
```

### El usuario no existe

```json
{
  "compra": "{{compraId}}",
  "estado": "pendiente",
  "quien": "000000000000000000000000"
}
```

## Actualizar el estado

Usá el `id` del cambio creado en el primer paso.

**PATCH** `http://localhost:8000/api/CambioEstadoCompra/{id}`

```json
{
  "estado": "confirmada"
}
```

## Estados permitidos

`pendiente`, `confirmada`, `utilizada`, `cancelada`, `reembolsada`.

Los datos de prueba deben crearse de nuevo si reiniciás el backend.
