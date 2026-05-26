// Archivo: src/services/usuario.service.ts
import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';

// Usamos los tipos que Prisma genera automáticamente para la creación de un usuario
export const guardarUsuario = async (datos: Prisma.UsuarioCreateInput) => {
  return await prisma.usuario.create({
    data: datos
  });
};

export const buscarUsuarioPorEmail = async (email: string) => {
  return await prisma.usuario.findUnique({
    where: { email }
  });
};