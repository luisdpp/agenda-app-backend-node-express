import { test, describe } from 'node:test';
import assert from 'node:assert';
import { guardarCategoria } from './categoria.service';
import { prisma } from '../config/prisma';

describe('Categoria Service Backend Tests', () => {

  test('should successfully save a new category via Prisma', async () => {
    // 1. ARRANGE (Preparar el escenario)
    const datosDePrueba = { nombre: 'Uñas Esculpidas', limitePorBloque: 2 };
    const respuestaSimuladaDb = { id: 10, ...datosDePrueba };

    // Guardamos una copia del método original para no romper Prisma para otros tests
    const originalCreate = prisma.categoria.create;

    // Interceptamos manualmente asignando una función falsa (Mock)
    prisma.categoria.create = async (args: any): Promise<any> => {
      return respuestaSimuladaDb;
    };

    try {
      // 2. ACT (Ejecutar la función real de tu servicio)
      const resultado = await guardarCategoria(datosDePrueba);

      // 3. ASSERT (Comprobar que el servicio procese el retorno del mock)
      assert.strictEqual(resultado.id, 10);
      assert.strictEqual(resultado.nombre, 'Uñas Esculpidas');
      assert.strictEqual(resultado.limitePorBloque, 2);
    } finally {
      // Restauramos el método original de Prisma pase lo que pase
      prisma.categoria.create = originalCreate;
    }
  });
  
});