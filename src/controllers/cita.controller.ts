// Archivo: src/controllers/cita.controller.ts
import { Request, Response } from 'express';
import { citaSchema } from '../schemas/cita.schema';
import * as citaService from '../services/cita.service';
import { prisma } from '../config/prisma';
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
        // 1. Validar datos de entrada con Zod
        const datosValidados = citaSchema.parse(req.body);

        // 2. NUEVA VALIDACIÓN: Verificar si el bloque realmente pertenece a la categoría
        const bloqueVeridico = await prisma.bloqueConfig.findFirst({
            where: {
                id: datosValidados.bloqueId,
                categoriaId: datosValidados.categoriaId
            }
        });

        if (!bloqueVeridico) {
            res.status(400).json({ 
                error: 'Inconsistencia de datos',
                mensaje: `El bloque con ID ${datosValidados.bloqueId} no está asociado a la categoría con ID ${datosValidados.categoriaId}.` 
            });
            return;
        }

        // 3. Aplicar regla de negocio: ¿Hay espacio disponible en este bloque?
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

        // 4. Si pasa todos los filtros, se guarda la cita con total seguridad
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