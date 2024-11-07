import { Module } from '@nestjs/common';
import { ProductionProgressService } from './production-progress.service';
import { ProductionProgressController } from './production-progress.controller';
import { ProductionProgressRepository } from './production-progress.repository';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { SessionService } from '../common/sessionService';

@Module({
  imports: [PrismaModule],
  controllers: [ProductionProgressController],
  providers: [
    ProductionProgressService,
    ProductionProgressRepository,
    SessionService
  ]
})
export class ProductionProgressModule {}
