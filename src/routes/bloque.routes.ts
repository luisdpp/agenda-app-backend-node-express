import { Router } from 'express';
import { getBloques, createBloque, getDisponibilidadHorarios } from '../controllers/bloque.controller';
import { registry } from '../config/swagger';
import { z } from 'zod';
import { bloqueConfigSchema } from '../schemas/bloque.schema';
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

registry.registerPath({
  method: 'get',
  path: '/api/bloques/disponibles',
  summary: 'Consultar bloques de horarios disponibles para una fecha y categoría',
  tags: ['Bloques de Configuración'],
  request: {
    query: z.object({
      fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Formato YYYY-MM-DD" }),
      categoriaId: z.string() // Los query params entran como string
    })
  },
  responses: {
    200: { description: 'Disponibilidad calculada exitosamente' },
    400: { description: 'Parámetros inválidos' }
  }
});

// Rutas relativas para bloques de configuración
router.get('/', getBloques);
router.post('/', createBloque);
router.get('/disponibles', getDisponibilidadHorarios);

export default router;