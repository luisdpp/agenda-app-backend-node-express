// Archivo: src/types/response.type.ts

export interface ApiResponse<T = any> {
  success: boolean;       // Reemplaza a error: false/true de forma positiva estándar
  statusCode: number;     // El código HTTP (200, 201, 400, 500)
  mensaje: string;        // Mensaje descriptivo del resultado o del error
  thereIsData: boolean;   // Flag para que el front sepa si data trae contenido útil
  data: T | null;         // El payload genérico (puede ser un objeto, arreglo o null)
  errors?: any;           // Opcional: Para el desglose detallado de Zod o excepciones
}