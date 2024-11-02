import { Injectable } from '@nestjs/common';
//import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class BatchsRepository {
  constructor(private prisma: PrismaService) {}
}
