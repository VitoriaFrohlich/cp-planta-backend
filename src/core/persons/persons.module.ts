import { Module } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { PersonsController } from './persons.controller';
import { PersonsRepository } from './persons.repository';
import { PrismaModule } from 'src/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PersonsController],
  providers: [PersonsService, PersonsRepository]
})
export class PersonsModule {}
