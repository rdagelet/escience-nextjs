const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const password = await hash('admin123', 12);
    const user = await prisma.user.upsert({
        where: { email: 'admin@electronicscience.net' },
        update: {},
        create: {
            email: 'admin@electronicscience.net',
            name: 'Admin User',
            password,
            role: 'ADMIN',
        },
    });
    console.log({ user });
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
