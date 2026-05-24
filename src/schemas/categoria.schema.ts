import { z } from 'zod';

export const categoriaSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    limitePorBloque: z.number().int().positive("El límite debe ser un número positivo")
});