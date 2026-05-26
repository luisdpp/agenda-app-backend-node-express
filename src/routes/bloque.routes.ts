import { Router } from 'express';
import { getBloques, createBloque } from '../controllers/bloque.controller';
import { registry } from '../config/swagger';
import { bloqueConfigSchema } from '../schemas/bloque.schema';
import { z } from 'zod';
import { categoriaSchema } from '../schemas/categoria.schema';

const router = Router();

// Creamos un esquema especial para la respuesta del GET que incluye la categoría anidada
const bloqueConCategoriaSchema = bloqueConfigSchema.extend({
  categoria: categoriaSchema
});

// Documentación del GET de Bloques
registry.registerPath({
  method: 'get',
  path: '/api/bloques',
  summary: 'Obtener todos los bloques de configuración',
  tags: ['Bloques de Configuración'],
  responses: {
    200: {
      description: 'Lista de bloques obtenida exitosamente',
      content: {
        'application/json': {
          schema: z.array(bloqueConCategoriaSchema),
        },
      },
    },
    500: { description: 'Error interno del servidor' },
  },
});

// Documentamos el POST de bloques de configuración
registry.registerPath({
  method: 'post',
  path: '/api/bloques',
  summary: 'Crear un nuevo bloque de configuración',
  tags: ['Bloques de Configuración'],
  request: {
    body: { content: { 'application/json': { schema: bloqueConfigSchema } } },
  },
  responses: {
    201: { description: 'Bloque creado exitosamente' },
    400: { description: 'Datos enviados inválidos' }
  },
});

// Rutas relativas para bloques de configuración
router.get('/', getBloques);
router.post('/', createBloque);

export default router;