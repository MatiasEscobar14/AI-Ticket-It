import { z } from "zod"
import { objectIdSchema } from "./objectId.js"
import { patchSchema } from "./patchSchema.js"

export const reseniaSchema = z
  .object({
    comprador: objectIdSchema,
    evento: objectIdSchema,
    detalle: z.string().trim().min(1),
    puntuacion: z.number().finite().min(0).max(5),
  })
  .strict()

export const reseniaPatchSchema = patchSchema(reseniaSchema)
