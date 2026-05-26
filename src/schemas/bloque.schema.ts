// Archivo: src/schemas/bloque.schema.ts
import { z } from 'zod';
import { registry } from '../config/swagger'; // Importamos el registroº

export const bloqueConfigSchema = z.object({
  diaSemana: z.number().int().min(0).max(6, {
    message: 'El día de la semana debe ser un número entre 0 (Domingo) y 6 (Sábado)'
  }),
  horaInicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de inicio debe tener el formato HH:MM (24 horas)'
  }),
  horaFin: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de fin debe tener el formato HH:MM (24 horas)'
  }),
  categoriaId: z.number().int().positive({
    message: 'El ID de la categoría debe ser un número entero positivo'
  })
}).refine((data) => data.horaInicio < data.horaFin, {
  message: 'La hora de inicio debe ser menor que la hora de fin',
  path: ['horaFin'] // El error se marcará específicamente en este campo
}).openapi('Bloque'); // <- Le damos un nombre para los esquemas de Swagger

registry.register('Bloque', bloqueConfigSchema);