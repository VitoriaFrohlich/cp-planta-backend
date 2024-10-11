import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { GroupsRepository } from './groups.repository';
import { PrismaModule } from 'src/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GroupsController],
  providers: [GroupsService, GroupsRepository]
})
export class GroupsModule {}
