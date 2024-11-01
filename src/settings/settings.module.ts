import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { SettingsRepository } from './settings.repository';
import { PrismaModule } from 'src/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [SettingsService],
  controllers: [SettingsController],
  providers: [SettingsService, SettingsRepository]
})
export class SettingsModule {}
