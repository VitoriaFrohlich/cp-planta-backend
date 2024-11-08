import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { SessionService } from '../common/sessionService';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, SessionService]
})
export class CategoriesModule {}
