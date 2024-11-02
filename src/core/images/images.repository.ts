import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class ImagesRepository {
  constructor(private prisma: PrismaService) {}
}
