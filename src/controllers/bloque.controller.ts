// Archivo: src/controllers/bloque.controller.ts
import { Request, Response } from 'express';
import { bloqueConfigSchema } from '../schemas/bloque.schema';
import * as bloqueService from '../services/bloque.service';
import { z } from 'zod';

export const getBloques = async (req: Request, res: Response) => {
    try {
        const bloques = await bloqueService.obtenerTodosLosBloques();
        res.status(200).json(bloques);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los bloques de configuración' });
    }
};

export const createBloque = async (req: Request, res: Response) => {
    try {
        // Validamos los datos de entrada (incluyendo el formato HH:MM y la relación de horas)
        const datosValidados = bloqueConfigSchema.parse(req.body);
        
        const nuevoBloque = await bloqueService.guardarBloque(datosValidados);

        res.status(201).json({
            mensaje: 'Bloque de configuración creado exitosamente',
            datos: nuevoBloque
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
};

export const getDisponibilidadHorarios = async (req: Request, res: Response) => {
    try {
        const { fecha, categoriaId } = req.query;

        // Validaciones básicas de los query params
        if (!fecha || !categoriaId) {
             res.status(400).json({ error: 'Faltan parámetros', mensaje: 'Se requieren los parámetros ?fecha=YYYY-MM-DD&categoriaId=X' });
             return;
        }

        const resultados = await bloqueService.obtenerBloquesConDisponibilidad(
            String(fecha),
            Number(categoriaId)
        );

        res.status(200).json(resultados);

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Error al calcular la disponibilidad', detalles: error.message });
    }
};