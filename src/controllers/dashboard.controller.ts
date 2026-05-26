// Archivo: src/controllers/dashboard.controller.ts
import { Request, Response } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { ResponseBuilder } from '../utils/response.util';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const estadisticas = await dashboardService.obtenerMetricasDashboard();
        
        // Despachamos usando el constructor de éxito estandarizado
        ResponseBuilder.success(
            res, 
            200, 
            'Métricas del dashboard compiladas exitosamente', 
            estadisticas
        );
    } catch (error: any) {
        console.error(error);
        
        // Despachamos usando el constructor de error estandarizado
        ResponseBuilder.error(
            res, 
            500, 
            'Error interno al compilar las métricas analíticas', 
            error.message
        );
    }
};