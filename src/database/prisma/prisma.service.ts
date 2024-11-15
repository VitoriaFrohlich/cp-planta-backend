import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, StockLocation } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  stock_location: StockLocation;
  async onModuleInit() {
    await this.$connect();
  }
  $connect() {
    throw new Error('Method not implemented.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
