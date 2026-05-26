// Archivo: src/routes/usuario.routes.ts
import { Router } from 'express';
import { createUsuario } from '../controllers/usuario.controller';
import { registry } from '../config/swagger';
import { usuarioSchema } from '../schemas/usuario.schema';

const router = Router();

// Documentamos el POST de usuarios
registry.registerPath({
  method: 'post',
  path: '/api/usuarios',
  summary: 'Crear un nuevo usuario',
  tags: ['Usuarios'],
  request: {
    body: { content: { 'application/json': { schema: usuarioSchema } } },
  },
  responses: {
    201: { description: 'Usuario creado exitosamente' },
    400: { description: 'Datos enviados inválidos' }
  },
});

router.post('/', createUsuario);

export default router;