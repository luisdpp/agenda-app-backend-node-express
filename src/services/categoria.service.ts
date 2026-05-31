import { prisma } from '../config/prisma';

export const obtenerTodasLasCategorias = async () => {
    return await prisma.categoria.findMany({
        orderBy: { id: 'asc' }
    });
};

export const guardarCategoria = async (datos: { nombre: string; limitePorBloque: number }) => {
    return await prisma.categoria.create({
        data: datos
    });
};

export const actualizarCategoria = async (id: number, datos: { nombre: string; limitePorBloque: number }) => {
    return await prisma.categoria.update({
        where: { id },
        data: datos
    });
};

export const eliminarCategoria = async (id: number) => {
    return await prisma.categoria.delete({
        where: { id }
    });
};