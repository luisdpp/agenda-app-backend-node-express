import { Router } from 'express';
import { getCategorias, createCategoria } from '../controllers/categoria.controller';

const router = Router();

// Fíjate que no ponemos '/api/categorias' aquí, solo la ruta relativa
router.get('/', getCategorias);
router.post('/', createCategoria);

export default router;