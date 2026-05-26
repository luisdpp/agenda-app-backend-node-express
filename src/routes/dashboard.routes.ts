// Archivo: src/routes/dashboard.routes.ts
import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { verificarToken } from '../middlewares/auth.middleware';
import { permitirRoles } from '../middlewares/role.middleware';
import { registry } from '../config/swagger';
import { Role } from '@prisma/client';

const router = Router();

registry.registerPath({
  method: 'get',
  path: '/api/dashboard/stats',
  summary: 'Obtener métricas consolidadas del negocio bajo estándar DTO',
  tags: ['Dashboard Analytics'],
  responses: {
    200: { description: 'Estructura ApiResponse devuelta de forma exitosa' },
    401: { description: 'No autenticado' },
    403: { description: 'No autorizado' }
  }
});

router.get('/stats', verificarToken, permitirRoles([Role.ADMIN, Role.RECEPCIONISTA]), getDashboardStats);

export default router;