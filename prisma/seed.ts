import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('AdminIkhlas123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@masjid-alikhlas.or.id' },
    update: {},
    create: {
      email: 'admin@masjid-alikhlas.or.id',
      name: 'Super Admin Masjid',
      passwordHash,
      role: Role.ADMIN,
    },
  });
  
  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
