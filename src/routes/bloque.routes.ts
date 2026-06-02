import { Router } from 'express';
import { getBloques, createBloque, updateBloque, deleteBloque, getDisponibilidadHorarios } from '../controllers/bloque.controller';
import { registry } from '../config/swagger';
import { z } from 'zod';
import { bloqueConfigSchema } from '../schemas/bloque.schema';
import { categoriaSchema } from '../schemas/categoria.schema';
import { verificarToken } from '../middlewares/auth.middleware';
import { permitirRoles } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

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

// Documentamos el PUT de bloques de configuración
registry.registerPath({
  method: 'put',
  path: '/api/bloques/:id',
  summary: 'Actualizar un bloque de configuración existente',
  tags: ['Bloques de Configuración'],
  request: {
    body: { content: { 'application/json': { schema: bloqueConfigSchema } } },
  },
  responses: {
    200: { description: 'Bloque actualizado exitosamente' },
    400: { description: 'Datos enviados inválidos' },
    404: { description: 'Bloque no encontrado' }
  },
});

// Documentamos el DELETE de bloques de configuración
registry.registerPath({
  method: 'delete',
  path: '/api/bloques/:id',
  summary: 'Eliminar un bloque de configuración existente',
  tags: ['Bloques de Configuración'],
  responses: {
    200: { description: 'Bloque eliminado exitosamente' },
    404: { description: 'Bloque no encontrado' }
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
router.post('/',verificarToken, permitirRoles([Role.ADMIN]), createBloque);
router.put('/:id',verificarToken, permitirRoles([Role.ADMIN]), updateBloque);
router.delete('/:id',verificarToken, permitirRoles([Role.ADMIN]), deleteBloque);
router.get('/disponibles', getDisponibilidadHorarios);

export default router;