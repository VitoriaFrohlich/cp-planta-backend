import { Module } from '@nestjs/common';
import { OccurrenceService } from './occurrence.service';
import { OccurrenceController } from './occurrence.controller';
import { OccurrenceRepository } from './occurrence.repository';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Module({
  controllers: [OccurrenceController],
  providers: [OccurrenceService, OccurrenceRepository, PrismaService]
})
export class OccurrenceModule {}
