// Archivo: src/services/cita.service.ts
import { prisma } from '../config/prisma';

interface CrearCitaDatos {
  fecha: Date;
  usuarioId: number;
  categoriaId: number;
  bloqueId: number;
}

export const verificarDisponibilidadBloque = async (fecha: Date, categoriaId: number, bloqueId: number) => {
  // 1. Buscamos el límite permitido directamente en la categoría
  const categoria = await prisma.categoria.findUnique({
    where: { id: categoriaId },
    select: { limitePorBloque: true }
  });

  if (!categoria) {
    throw new Error('La categoría especificada no existe');
  }

  // 2. Contamos cuántas citas ya existen para esa fecha, categoría y bloque específicos
  const citasAgendadas = await prisma.cita.count({
    where: {
      fecha: fecha,
      categoriaId: categoriaId,
      bloqueId: bloqueId
    }
  });

  // Retornamos true si todavía hay espacio disponible, o false si ya se llenó
  return citasAgendadas < categoria.limitePorBloque;
};

export const guardarCita = async (datos: CrearCitaDatos) => {
  return await prisma.cita.create({
    data: datos,
    include: {
      usuario: { select: { id: true, nombre: true, email: true } },
      categoria: { select: { id: true, nombre: true } },
      bloque: true
    }
  });
};

export const obtenerTodasLasCitas = async () => {
  return await prisma.cita.findMany({
    include: {
      usuario: { select: { id: true, nombre: true, email: true } },
      categoria: { select: { id: true, nombre: true } },
      bloque: true
    }
  });
};