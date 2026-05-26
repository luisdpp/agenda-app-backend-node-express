import { z } from 'zod';
import { Role } from '@prisma/client';
import { registry } from '../config/swagger';

export const usuarioSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  telefono: z.string().optional(),
  rol: z.nativeEnum(Role).optional()
}).openapi('Usuario');

registry.register('Usuario', usuarioSchema);