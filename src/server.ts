import express from 'express';
import categoriaRoutes from './routes/categoria.routes';
import bloqueRoutes from './routes/bloque.routes';

const app = express();
const PORT = 3000;

app.use(express.json());

// Conectamos las rutas: todo lo que vaya a '/api/categorias' lo maneja nuestro router
app.use('/api/categorias', categoriaRoutes);
app.use('/api/bloques', bloqueRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});