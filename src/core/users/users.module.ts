import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { SessionService } from '../common/sessionService';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, SessionService]
})
export class UsersModule {}
