import { Module } from '@nestjs/common';
import { CompositionOrdersService } from './composition.orders.service';
import { CompositionOrdersController } from './composition.orders.controller';
import { CompositionOrdersRepository } from './composition.orders.repository';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { SettingsModule } from 'src/settings/settings.module';
import { BatchService } from '../common/batch.utils';
import { SessionService } from '../common/sessionService';

@Module({
  imports: [PrismaModule, SettingsModule],
  controllers: [CompositionOrdersController],
  providers: [
    CompositionOrdersService,
    CompositionOrdersRepository,
    BatchService,
    SessionService
  ]
})
export class CompositionsModule {}
