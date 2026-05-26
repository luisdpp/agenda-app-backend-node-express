// Archivo: src/services/dashboard.service.ts
import { prisma } from '../config/prisma';

export const obtenerMetricasDashboard = async () => {
  // 1. Distribución por Categoría (Con ceros si está vacío)
  const todasLasCategorias = await prisma.categoria.findMany({ select: { id: true, nombre: true } });
  const citasPorCategoriaRaw = await prisma.cita.groupBy({ by: ['categoriaId'], _count: { id: true } });
  const mapaCategorias = new Map(citasPorCategoriaRaw.map(c => [c.categoriaId, c._count.id]));
  const distribucionCategorias = todasLasCategorias.map(cat => ({
    categoria: cat.nombre,
    citas: mapaCategorias.get(cat.id) || 0
  }));

  // 2. Horarios Pico (Con ceros si está vacío)
  const todosLosBloques = await prisma.bloqueConfig.findMany({ select: { id: true, horaInicio: true, horaFin: true } });
  const citasPorBloqueRaw = await prisma.cita.groupBy({ by: ['bloqueId'], _count: { id: true } });
  const mapaBloques = new Map(citasPorBloqueRaw.map(b => [b.bloqueId, b._count.id]));
  const conteoHorarios: { [rango: string]: number } = {};
  todosLosBloques.forEach(bloque => {
    const rango = `${bloque.horaInicio} - ${bloque.horaFin}`;
    const totalCitas = mapaBloques.get(bloque.id) || 0;
    conteoHorarios[rango] = (conteoHorarios[rango] || 0) + totalCitas;
  });
  const horariosPico = Object.keys(conteoHorarios).map(rango => ({
    horario: rango,
    totalCitas: conteoHorarios[rango]
  }));

  // 3. Histórico Mensual (Garantiza los 12 meses pre-poblados)
  const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const historicoMensual = nombresMeses.map(mes => ({ mes, total: 0 }));
  const añoActual = new Date().getFullYear();
  const citasAñoActual = await prisma.cita.findMany({
    where: { fecha: { gte: new Date(`${añoActual}-01-01`), lte: new Date(`${añoActual}-12-31`) } },
    select: { fecha: true }
  });
  citasAñoActual.forEach(cita => {
    const numeroMes = cita.fecha.getMonth();
    historicoMensual[numeroMes].total += 1;
  });

  return {
    distribucionCategorias,
    horariosPico,
    historicoMensual
  };
};