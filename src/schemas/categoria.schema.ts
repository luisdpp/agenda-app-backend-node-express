import { z } from 'zod';
import { registry } from '../config/swagger'; // Importamos el registro

export const categoriaSchema = z.object({
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  limitePorBloque: z.number().int().positive()
}).openapi('Categoria'); // <- Le damos un nombre para los esquemas de Swagger

// Lo registramos en Swagger
registry.register('Categoria', categoriaSchema);