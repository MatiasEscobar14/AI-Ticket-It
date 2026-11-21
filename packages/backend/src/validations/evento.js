import { z } from "zod"
import { objectIdSchema } from "./objectId.js"
import { patchSchema } from "./patchSchema.js"

const tipoEntradaSchema = z
  .object({
    nombre: z.string().trim().min(1),
    descripcion: z.string().trim().min(1),
    precio: z.number().finite().min(0),
    cupo: z.number().int().min(0),
  })
  .strict()

export const eventoSchema = z
  .object({
    nombre: z.string().trim().min(1),
    descripcion: z.string().trim().min(1),
    categoria: objectIdSchema,
    fecha: z.coerce.date(),
    tiposEntrada: z.array(tipoEntradaSchema).optional(),
    multimedia: z.array(z.string()).optional(),
    organizador: objectIdSchema,
  })
  .strict()

export const eventoPatchSchema = patchSchema(eventoSchema)
