// Archivo: src/routes/categoria.routes.ts
import { Router } from 'express';
import { getCategorias, createCategoria } from '../controllers/categoria.controller';
import { registry } from '../config/swagger';
import { categoriaSchema } from '../schemas/categoria.schema';
import { z } from 'zod';
import { verificarToken } from '../middlewares/auth.middleware';
import { permitirRoles } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Documentación del GET (Listar todas)
registry.registerPath({
  method: 'get',
  path: '/api/categorias',
  summary: 'Obtener todas las categorías',
  tags: ['Categorías'],
  responses: {
    200: {
      description: 'Lista de categorías obtenida exitosamente',
      content: {
        'application/json': {
          // Le decimos a Swagger que responderá un Arreglo de Categorías
          schema: z.array(categoriaSchema),
        },
      },
    },
    500: { description: 'Error interno del servidor' },
  },
});

// Documentamos el POST de categorías
registry.registerPath({
  method: 'post',
  path: '/api/categorias',
  summary: 'Crear una nueva categoría',
  tags: ['Categorías'],
  request: {
    body: { content: { 'application/json': { schema: categoriaSchema } } },
  },
  responses: {
    201: { description: 'Categoría creada exitosamente' },
    400: { description: 'Datos enviados inválidos' }
  },
});

router.get('/', getCategorias);
router.post('/', verificarToken, permitirRoles([Role.ADMIN]), createCategoria);

export default router;