// Archivo: src/middlewares/role.middleware.ts
import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

// Reutilizamos la interfaz extendida que armamos en el paso anterior para que TypeScript no proteste
import { Request } from 'express';

interface RequestAutenticado extends Request {
  usuario?: {
    id: number;
    email: string;
    rol: Role;
  };
}

// Este middleware recibe un arreglo de roles permitidos (ej: [Role.ADMIN, Role.RECEPCIONISTA])
export const permitirRoles = (rolesPermitidos: Role[]) => {
  return (req: RequestAutenticado, res: Response, next: NextFunction) => {
    
    // 1. Validar que el usuario ya haya pasado por el middleware de autenticación
    if (!req.usuario) {
       res.status(500).json({ error: 'Error de configuración', mensaje: 'El middleware de roles requiere que verificarToken se ejecute primero.' });
       return;
    }

    // 2. Verificar si el rol del usuario actual está incluido en los roles permitidos
    const tienePermiso = rolesPermitidos.includes(req.usuario.rol);

    if (!tienePermiso) {
       res.status(403).json({ 
        error: 'Acceso prohibido', 
        mensaje: `Tu rol (${req.usuario.rol}) no tiene los permisos necesarios para realizar esta acción.` 
      });
       return;
    }

    // 3. Si tiene el rol adecuado, se le concede el paso al controlador
    next();
  };
};