import { prisma } from '../config/prisma';

export const obtenerTodasLasCategorias = async () => {
    return await prisma.categoria.findMany();
};

export const guardarCategoria = async (datos: { nombre: string; limitePorBloque: number }) => {
    return await prisma.categoria.create({
        data: datos
    });
};