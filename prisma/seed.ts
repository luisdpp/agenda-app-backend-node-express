import { prisma } from '../src/config/prisma';
import bcrypt from 'bcrypt';


async function main() {

    console.log('🌱 Sembrando datos con seguridad...');

    await prisma.usuario.deleteMany();

    const passwordHasheada = await bcrypt.hash('testing', 10);

    const usuario = await prisma.usuario.create({
        data: {
            email: 'testing@example.com',
            password: passwordHasheada,
            nombre: 'Testing',
            telefono: '1234567890',
            rol: 'ADMIN'
        }
    });

    const passwordHasheada2 = await bcrypt.hash('testing', 10);

    const usuario2 = await prisma.usuario.create({
        data: {
            email: 'cliente@example.com',
            password: passwordHasheada2,
            nombre: 'Cliente',
            telefono: '0987654321',
            rol: 'CLIENTE'
        }
    });

    console.log('✅ 🌱 Sembrado seguro completado.');
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); process.exit(1); });