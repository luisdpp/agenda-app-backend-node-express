// Archivo: src/types/express.d.ts
import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      // Le indicamos a TypeScript que el objeto req ahora puede tener una propiedad opcional 'usuario'
      usuario?: {
        id: number;
        email: string;
        rol: Role;
      };
    }
  }
}