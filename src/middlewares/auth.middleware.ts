// Archivo: src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

interface JwtPayload {
  id: number;
  email: string;
  rol: Role;
}

// 1. Creamos una interfaz local que hereda de Request y le añade la propiedad 'usuario'
interface RequestAutenticado extends Request {
  usuario?: JwtPayload;
}

// 2. Usamos 'RequestAutenticado' en lugar del 'Request' genérico para el parámetro 'req'
export const verificarToken = (req: RequestAutenticado, res: Response, next: NextFunction) => {
  // Obtener la cabecera Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
     res.status(401).json({ error: 'Acceso denegado', mensaje: 'No se proporcionó un token de autenticación.' });
     return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'secret_fallback';
    
    // Verificar el token usando la librería
    const verificado = jwt.verify(token, secret) as JwtPayload;
    
    // 3. Ahora TypeScript sabe al 100% que 'req.usuario' existe gracias a la interfaz local
    req.usuario = verificado;
    
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido', mensaje: 'El token proporcionado no es válido o ya expiró.' });
  }
};