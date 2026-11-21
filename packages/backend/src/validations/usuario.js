import { z } from "zod"
import { objectIdSchema } from "./objectId.js"
import { patchSchema } from "./patchSchema.js"

export const usuarioSchema = z
  .object({
    nombre: z.string().trim().min(1),
    apellido: z.string().trim().min(1),
    favoritos: z.array(objectIdSchema).optional(),
  })
  .strict()

export const usuarioPatchSchema = patchSchema(usuarioSchema)
