import * as bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.organization.create({
    data: {
      name: 'Test Org',
      users: {
        create: {
          name: 'Admin',
          email: 'admin@test.com',
          password: hashedPassword,
          role: 'MEMBER',
        },
      },
    },
  });

  console.log('Seeded');
}

main();
