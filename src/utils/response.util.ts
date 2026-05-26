// Archivo: src/utils/response.util.ts
import { Response } from 'express';
import { ApiResponse } from '../types/response.type';

export class ResponseBuilder {
  
  // Para respuestas exitosas (200, 201)
  static success<T>(res: Response, statusCode: number, mensaje: string, data: T): void {
    // Si es un arreglo, verificamos si tiene elementos. Si es objeto, que no sea null.
    const thereIsData = Array.isArray(data) ? data.length > 0 : !!data;

    const responseBody: ApiResponse<T> = {
      success: true,
      statusCode,
      mensaje,
      thereIsData,
      data
    };

    res.status(statusCode).json(responseBody);
  }

  // Para respuestas de error (400, 401, 403, 404, 500)
  static error(res: Response, statusCode: number, mensaje: string, errors: any = null): void {
    const responseBody: ApiResponse = {
      success: false,
      statusCode,
      mensaje,
      thereIsData: false,
      data: null,
      ...(errors && { errors }) // Solo añade la propiedad 'errors' si trae detalles
    };

    res.status(statusCode).json(responseBody);
  }
}