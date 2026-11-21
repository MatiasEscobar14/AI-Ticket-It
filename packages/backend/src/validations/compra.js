import { z } from "zod"
import { EstadoCompra } from "../domain/EstadoCompra.js"
import { objectIdSchema } from "./objectId.js"
import { patchSchema } from "./patchSchema.js"

const mensajeSchema = z
  .object({
    usuario: objectIdSchema,
    mensaje: z.string().trim().min(1),
    enviado: z.coerce.date().optional(),
  })
  .strict()

export const compraSchema = z
  .object({
    comprador: objectIdSchema,
    evento: objectIdSchema,
    tipoEntrada: objectIdSchema,
    cantidad: z.number().int().positive(),
    total: z.number().finite().min(0),
    estado: z.enum(Object.values(EstadoCompra)),
    mensajes: z.array(mensajeSchema).optional(),
  })
  .strict()

export const compraPatchSchema = patchSchema(compraSchema)
