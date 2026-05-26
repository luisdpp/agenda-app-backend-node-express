// Archivo: src/controllers/cita.controller.ts
import { Request, Response } from 'express';
import { citaSchema } from '../schemas/cita.schema';
import * as citaService from '../services/cita.service';
import { z } from 'zod';

export const getCitas = async (req: Request, res: Response) => {
    try {
        const citas = await citaService.obtenerTodasLasCitas();
        res.status(200).json(citas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las citas' });
    }
};

export const createCita = async (req: Request, res: Response) => {
    try {
        // 1. Validar datos de entrada y transformar la fecha en objeto Date
        const datosValidados = citaSchema.parse(req.body);

        // 2. Aplicar regla de negocio: ¿Hay espacio disponible en este bloque?
        const estaDisponible = await citaService.verificarDisponibilidadBloque(
            datosValidados.fecha,
            datosValidados.categoriaId,
            datosValidados.bloqueId
        );

        if (!estaDisponible) {
             res.status(400).json({ 
                error: 'Bloque de horario lleno',
                mensaje: 'Lo sentimos, este turno ya completó el máximo de citas permitido para esta categoría en la fecha seleccionada.' 
            });
            return;
        }

        // 3. Si hay cupo, se guarda la cita
        const nuevaCita = await citaService.guardarCita(datosValidados);

        res.status(201).json({
            mensaje: 'Cita agendada exitosamente',
            datos: nuevaCita
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