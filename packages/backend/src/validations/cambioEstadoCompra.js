import { z } from "zod"
import { EstadoCompra } from "../domain/EstadoCompra.js"
import { objectIdSchema } from "./objectId.js"
import { patchSchema } from "./patchSchema.js"

export const cambioEstadoCompraSchema = z
  .object({
    compra: objectIdSchema,
    estado: z.enum(Object.values(EstadoCompra)),
    quien: objectIdSchema,
  })
  .strict()

export const cambioEstadoCompraPatchSchema = patchSchema(cambioEstadoCompraSchema)
