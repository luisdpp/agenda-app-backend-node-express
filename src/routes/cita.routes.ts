// Archivo: src/routes/cita.routes.ts
import { Router } from 'express';
import { getCitas, createCita } from '../controllers/cita.controller';
import { registry } from '../config/swagger';
import { citaSchema } from '../schemas/cita.schema';
import { z } from 'zod';

const router = Router();

// 1. Documentar GET /api/citas
registry.registerPath({
  method: 'get',
  path: '/api/citas',
  summary: 'Obtener el listado de todas las citas agendadas',
  tags: ['Citas'],
  responses: {
    200: {
      description: 'Listado de citas obtenido con éxito',
      content: { 'application/json': { schema: z.array(citaSchema) } }
    },
    500: { description: 'Error interno del servidor' }
  }
});

// 2. Documentar POST /api/citas
registry.registerPath({
  method: 'post',
  path: '/api/citas',
  summary: 'Agendar una nueva cita',
  tags: ['Citas'],
  request: {
    body: { content: { 'application/json': { schema: citaSchema } } }
  },
  responses: {
    201: { description: 'Cita agendada exitosamente' },
    400: { description: 'Datos inválidos o bloque de horario lleno' },
    500: { description: 'Error interno del servidor' }
  }
});

router.get('/', getCitas);
router.post('/', createCita);

export default router;