import { Module } from '@nestjs/common';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { ProductionRepository } from './production.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProductionController],
  providers: [ProductionService, ProductionRepository]
})
export class ProductionModule {}
