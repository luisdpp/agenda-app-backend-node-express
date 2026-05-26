// Archivo: src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { loginSchema } from '../schemas/auth.schema';
import { buscarUsuarioPorEmail } from '../services/usuario.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

export const login = async (req: Request, res: Response) => {
    try {
        // 1. Validar campos de entrada
        const credenciales = loginSchema.parse(req.body);

        // 2. Verificar si el usuario existe
        const usuario = await buscarUsuarioPorEmail(credenciales.email);
        if (!usuario) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }

        // 3. Comparar la contraseña en texto plano con el Hash de la BD
        const passwordCorrecto = await bcrypt.compare(credenciales.password, usuario.password);
        if (!passwordCorrecto) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }

        // 4. Generar el Token JWT si todo es correcto
        // Guardamos los datos clave (payload) que necesitaremos identificar en las rutas protegidas
        const payload = {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol
        };

        const secret = process.env.JWT_SECRET || 'secret_fallback';
        
        // El token expirará en 2 horas para mantener una buena práctica de seguridad
        const token = jwt.sign(payload, secret, { expiresIn: '2h' });

        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            token: token
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Datos inválidos', detalles: error.issues });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};