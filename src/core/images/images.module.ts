import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ImagesRepository } from './images.repository';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { SessionService } from '../common/sessionService';

@Module({
  imports: [PrismaModule],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesRepository, SessionService]
})
export class ImagesModule {}
