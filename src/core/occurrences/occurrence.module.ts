import { Module } from '@nestjs/common';
import { OccurrenceService } from './occurrence.service';
import { OccurrenceController } from './occurrence.controller';

@Module({
  controllers: [OccurrenceController],
  providers: [OccurrenceService]
})
export class ProductionModule {}
