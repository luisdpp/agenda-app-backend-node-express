// Archivo: src/schemas/cita.schema.ts
import { z } from 'zod';
import { registry } from '../config/swagger';

export const citaSchema = z.object({
  fecha: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha debe tener el formato YYYY-MM-DD' })
    .transform((str) => {
      // Forzamos a que la fecha se interprete en horario local a la medianoche
      // para evitar problemas de desfase de zona horaria (UTC) al guardar en la BD
      const [year, month, day] = str.split('-').map(Number);
      return new Date(year, month - 1, day);
    }),
  usuarioId: z.number().int().positive({ message: 'El ID de usuario debe ser un número entero positivo' }),
  categoriaId: z.number().int().positive({ message: 'El ID de categoría debe ser un número entero positivo' }),
  bloqueId: z.number().int().positive({ message: 'El ID del bloque debe ser un número entero positivo' })
}).openapi('Cita');

// Registramos el esquema en el componente global de Swagger
registry.register('Cita', citaSchema);