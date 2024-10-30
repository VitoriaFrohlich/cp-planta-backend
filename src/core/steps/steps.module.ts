import { Module } from '@nestjs/common';
import { StepsService } from './steps.service';
import { StepsController } from './steps.controller';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { StepsRepository } from './steps.repository';

@Module({
  imports: [PrismaModule],
  controllers: [StepsController],
  providers: [StepsService, StepsRepository]
})
export class StepsModule {}
