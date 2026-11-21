import { z } from "zod"
import { patchSchema } from "./patchSchema.js"

export const categoriaSchema = z
  .object({
    nombre: z.string().trim().min(1),
    descripcion: z.string().trim().min(1),
  })
  .strict()

export const categoriaPatchSchema = patchSchema(categoriaSchema)
