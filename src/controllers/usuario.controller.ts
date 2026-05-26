// Archivo: src/controllers/usuario.controller.ts
import { Request, Response } from 'express';
import { usuarioSchema } from '../schemas/usuario.schema';
import * as usuarioService from '../services/usuario.service';
import { z } from 'zod';
import bcrypt from 'bcrypt';

export const createUsuario = async (req: Request, res: Response) => {
    try {
        const datosValidados = usuarioSchema.parse(req.body);
        
        // Regla de negocio: Verificar duplicados
        const usuarioExistente = await usuarioService.buscarUsuarioPorEmail(datosValidados.email);
        if (usuarioExistente) {
            res.status(400).json({ error: 'El correo electrónico ya está registrado' });
            return; // Detenemos la ejecución aquí
        }

        // Hasheamos la contraseña antes de guardarla en la base de datos
        const passwordHasheada = await bcrypt.hash(datosValidados.password, 10);

        datosValidados.password = passwordHasheada;

        const nuevoUsuario = await usuarioService.guardarUsuario(datosValidados);

        // Por seguridad, eliminamos la contraseña del objeto antes de responderle al cliente
        const { password, ...usuarioSinPassword } = nuevoUsuario;

        res.status(201).json({
            mensaje: 'Usuario creado exitosamente',
            datos: usuarioSinPassword
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