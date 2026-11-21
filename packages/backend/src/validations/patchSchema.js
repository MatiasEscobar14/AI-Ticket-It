export function patchSchema(schema) {
  return schema.partial().refine(
    (data) => Object.keys(data).length > 0,
    "Debe enviar al menos un campo para actualizar",
  )
}
