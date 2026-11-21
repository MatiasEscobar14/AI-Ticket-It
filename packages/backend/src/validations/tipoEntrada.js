import { z } from "zod"
import { objectIdSchema } from "./objectId.js"
import { patchSchema } from "./patchSchema.js"

export const tipoEntradaSchema = z
  .object({
    nombre: z.string().trim().min(1),
    descripcion: z.string().trim().min(1),
    precio: z.number().finite().min(0),
    cupo: z.number().int().min(0),
    evento: objectIdSchema,
  })
  .strict()

export const tipoEntradaPatchSchema = patchSchema(tipoEntradaSchema)
