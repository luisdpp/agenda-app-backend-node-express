// Archivo: src/services/bloque.service.ts
import { prisma } from '../config/prisma';

// Definimos la estructura de datos que espera recibir la función
interface CrearBloqueDatos {
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  categoriaId: number;
}

export const obtenerTodosLosBloques = async () => {
  // Prisma te permite usar 'include' para traerte los datos de la categoría relacionados en la misma consulta SQL
  return await prisma.bloqueConfig.findMany({
    include: {
      categoria: true
    }
  });
};

export const guardarBloque = async (datos: CrearBloqueDatos) => {
  return await prisma.bloqueConfig.create({
    data: datos
  });
};