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

export const obtenerBloquesConDisponibilidad = async (fechaStr: string, categoriaId: number) => {
  // 1. Convertir el string "2026-06-15" a un objeto Date local para extraer el día de la semana
  const [year, month, day] = fechaStr.split('-').map(Number);
  const fechaObj = new Date(year, month - 1, day);
  const diaSemana = fechaObj.getDay(); // Retorna 0 (Dom) a 6 (Sáb)

  // 2. Traer la categoría con sus bloques configurados para ese día de la semana específico
  const categoria = await prisma.categoria.findUnique({
    where: { id: categoriaId },
    include: {
      bloques: {
        where: { diaSemana: diaSemana }
      }
    }
  });

  if (!categoria) {
    throw new Error('La categoría especificada no existe');
  }

  // 3. Traer el conteo de citas ya agendadas para esa fecha y categoría de un solo golpe
  const citasAgendadas = await prisma.cita.groupBy({
    by: ['bloqueId'],
    where: {
      fecha: fechaObj,
      categoriaId: categoriaId
    },
    _count: {
      id: true
    }
  });

  // Convertimos el resultado del conteo en un mapa para buscar de forma instantánea (O(1))
  const mapaCitasConteo = new Map(
    citasAgendadas.map(c => [c.bloqueId, c._count.id])
  );

  // 4. Mapear cada bloque inyectándole si está disponible o no basado en el límite de la categoría
  const bloquesCalculados = categoria.bloques.map(bloque => {
    const totalCitasAgendadas = mapaCitasConteo.get(bloque.id) || 0;
    const cuposDisponibles = categoria.limitePorBloque - totalCitasAgendadas;

    return {
      id: bloque.id,
      horaInicio: bloque.horaInicio,
      horaFin: bloque.horaFin,
      diaSemana: bloque.diaSemana,
      totalCitasAgendadas,
      cuposDisponibles: cuposDisponibles > 0 ? cuposDisponibles : 0,
      disponible: totalCitasAgendadas < categoria.limitePorBloque
    };
  });

  return bloquesCalculados;
};