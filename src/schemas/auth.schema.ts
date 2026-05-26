// Archivo: src/schemas/auth.schema.ts
import { z } from 'zod';
import { registry } from '../config/swagger';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Formato de correo inválido' }),
  password: z.string().min(1, { message: 'La contraseña es obligatoria' })
}).openapi('LoginCredentials');

registry.register('LoginCredentials', loginSchema);