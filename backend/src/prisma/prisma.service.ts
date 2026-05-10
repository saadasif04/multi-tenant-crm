import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    let retries = 5;

    while (retries > 0) {
      try {
        await this.$connect();
        console.log('✅ Database connected');
        return;
      } catch (err) {
        retries--;
        console.log(`❌ DB connect failed. Retries left: ${retries}`);

        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    throw new Error('❌ Could not connect to database after retries');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}