import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockRepository } from './stock.repository';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { SettingsModule } from 'src/settings/settings.module';
import { BatchService } from '../common/batch.utils';
import { SessionService } from '../common/sessionService';

@Module({
  imports: [PrismaModule, SettingsModule],
  controllers: [StockController],
  providers: [StockService, StockRepository, BatchService, SessionService]
})
export class StockModule {}
