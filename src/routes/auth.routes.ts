// Archivo: src/routes/auth.routes.ts
import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { registry } from '../config/swagger';
import { loginSchema } from '../schemas/auth.schema';

const router = Router();

registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  summary: 'Iniciar sesión y obtener token JWT',
  tags: ['Autenticación'],
  request: {
    body: { content: { 'application/json': { schema: loginSchema } } }
  },
  responses: {
    200: { description: 'Autenticación exitosa, retorna el token Bearer' },
    401: { description: 'Credenciales inválidas' }
  }
});

router.post('/login', login);

export default router;