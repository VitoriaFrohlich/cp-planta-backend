import { Module } from '@nestjs/common';
import { BatchsController } from './batchs.controller';
import { BatchsService } from './batchs.service';
import { BatchsRepository } from './batchs.repository';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [BatchsController],
  providers: [BatchsService, BatchsRepository]
})
export class BatchsModule {}
