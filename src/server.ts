import express from 'express';

import swaggerUi from 'swagger-ui-express';
import { generarDocumentacionJson } from './config/swagger';

import categoriaRoutes from './routes/categoria.routes';
import bloqueRoutes from './routes/bloque.routes';
import usuarioRoutes from './routes/usuario.routes';
import citaRoutes from './routes/cita.routes';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(generarDocumentacionJson()));

// Conectamos las rutas: todo lo que vaya a '/api/categorias' lo maneja nuestro router
app.use('/api/categorias', categoriaRoutes);
app.use('/api/bloques', bloqueRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});