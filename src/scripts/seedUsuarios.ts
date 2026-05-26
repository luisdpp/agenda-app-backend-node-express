// Archivo: src/scripts/seedUsuarios.ts
import 'dotenv/config'; // Cargamos el entorno para que Prisma tenga la URL de la BD
import { prisma } from '../config/prisma';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

async function seedUsuarios() {
  const CANTIDAD_USUARIOS = 5; // Define cuántos usuarios quieres crear
  const urlApi = `https://randomuser.me/api/?results=${CANTIDAD_USUARIOS}&nat=es`; // 'nat=es' para nombres en español

  console.log(`\n🚀 Conectando con la API de Random User para traer ${CANTIDAD_USUARIOS} usuarios...`);

  try {
    // 1. Hacemos la petición HTTP nativa a la API pública
    const respuesta = await fetch(urlApi);
    
    if (!respuesta.ok) {
      throw new Error(`Error al conectar con la API: ${respuesta.statusText}`);
    }

    const datos = await respuesta.json();
    const listaUsuariosExternos = datos.results;

    console.log('⏳ Procesando y hasheando contraseñas de los usuarios recibidos...');

    // 2. Mapeamos los datos de la API al formato que requiere nuestra tabla 'Usuario'
    const usuariosParaInsertar = [];

    for (const user of listaUsuariosExternos) {
      // Usamos el mismo password por defecto para todas las pruebas ("password123")
      const passwordHasheado = await bcrypt.hash('password123', 10);

      usuariosParaInsertar.push({
        nombre: `${user.name.first} ${user.name.last}`,
        email: user.email,
        password: passwordHasheado,
        telefono: user.phone,
        rol: Role.CLIENTE // Todos se crearán con rol CLIENTE por defecto
      });
    }

    console.log('💾 Insertando usuarios en PostgreSQL mediante Prisma...');

    // 3. Usamos 'createMany' de Prisma para insertar todo el arreglo de un solo golpe (Bulk Insert)
    // 'skipDuplicates: true' evita que el script falle si la API llega a repetir un email único
    const resultado = await prisma.usuario.createMany({
      data: usuariosParaInsertar,
      skipDuplicates: true
    });

    console.log(`\n✅ ¡Éxito! Se agregaron ${resultado.count} nuevos usuarios de prueba a la base de datos.`);

  } catch (error) {
    console.error('❌ Error durante el proceso de seed:', error);
  } finally {
    // Es una buena práctica cerrar la conexión de Prisma cuando el script termina
    await prisma.$disconnect();
  }
}

// Ejecutamos la función
seedUsuarios();