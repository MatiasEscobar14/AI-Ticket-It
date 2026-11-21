import { z } from "zod"
import { objectIdSchema } from "./objectId.js"
import { patchSchema } from "./patchSchema.js"

export const mensajeSchema = z
  .object({
    usuario: objectIdSchema,
    mensaje: z.string().trim().min(1),
  })
  .strict()

export const mensajePatchSchema = patchSchema(mensajeSchema)
