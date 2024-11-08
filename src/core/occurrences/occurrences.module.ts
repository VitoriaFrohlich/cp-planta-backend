import { Module } from '@nestjs/common';
import { OccurrenceService } from './occurrences.service';
import { OccurrenceController } from './occurrences.controller';
import { OccurrenceRepository } from './occurrences.repository';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { SessionService } from '../common/sessionService';

@Module({
  controllers: [OccurrenceController],
  providers: [
    OccurrenceService,
    OccurrenceRepository,
    PrismaService,
    SessionService
  ]
})
export class OccurrenceModule {}
