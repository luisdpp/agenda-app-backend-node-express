// Archivo: src/config/swagger.ts
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// 1. Extendemos Zod
extendZodWithOpenApi(z);

// 2. Creamos el registro
export const registry = new OpenAPIRegistry();

// 3. Función corregida para cumplir con la firma estricta de TypeScript
export const generarDocumentacionJson = () => {
  // Pasamos el registro directamente en el constructor
  const generator = new OpenApiGeneratorV3(registry.definitions);
  
  // .generateDocument() es el método correcto para armar todo el cascarón de Swagger
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'API de Agenda de Citas',
      version: '1.0.0',
      description: 'Documentación interactiva de los endpoints del Backend',
    },
    servers: [{ url: 'http://localhost:3000' }],
  });
};