import { Request, Response } from 'express';
import { categoriaSchema } from '../schemas/categoria.schema';
import * as categoriaService from '../services/categoria.service';
import { z } from 'zod';

export const getCategorias = async (req: Request, res: Response) => {
    try {
        // 'await' espera a que la BD devuelva las filas antes de pasar a la siguiente línea
        const categorias = await categoriaService.obtenerTodasLasCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
};

export const createCategoria = async (req: Request, res: Response) => {
    try {
        const datosValidados = categoriaSchema.parse(req.body);
        
        // Esperamos a que Prisma inserte el registro en PostgreSQL
        const nuevaCategoria = await categoriaService.guardarCategoria(datosValidados);

        res.status(201).json({
            mensaje: 'Categoría creada exitosamente',
            datos: nuevaCategoria
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: 'Datos inválidos',
                detalles: error.issues 
            });
        } else {
            console.error(error); // Nos permite ver el error real en la consola del contenedor
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

export const updateCategoria = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const datosValidados = categoriaSchema.parse(req.body);

        const categoriaActualizada = await categoriaService.actualizarCategoria(Number(id), datosValidados);

        if (!categoriaActualizada) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.status(200).json({
            mensaje: 'Categoría actualizada exitosamente',
            datos: categoriaActualizada
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: 'Datos inválidos',
                detalles: error.issues
            });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

export const deleteCategoria = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const categoriaEliminada = await categoriaService.eliminarCategoria(Number(id));

        if (!categoriaEliminada) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.status(200).json({
            mensaje: 'Categoría eliminada exitosamente',
            datos: categoriaEliminada
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}