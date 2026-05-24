import { Router } from 'express';
import { getBloques, createBloque } from '../controllers/bloque.controller';

const router = Router();

// Rutas relativas para bloques de configuración
router.get('/', getBloques);
router.post('/', createBloque);

export default router;