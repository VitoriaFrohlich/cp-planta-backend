import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { ocurrences, Prisma } from '@prisma/client';

@Injectable()
export class OccurrenceRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ocurrencesCreateInput): Promise<ocurrences> {
    return this.prisma.ocurrences.create({
      data: {
        ...data,
        updated_at: new Date() // Ensure updated_at is set
      }
    });
  }

  async update(
    id: number,
    data: Prisma.ocurrencesUpdateInput
  ): Promise<ocurrences> {
    return this.prisma.ocurrences.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date() // Ensure updated_at is set
      }
    });
  }

  async findAll(): Promise<ocurrences[]> {
    return this.prisma.ocurrences.findMany();
  }

  async findOne(id: number): Promise<ocurrences | null> {
    return this.prisma.ocurrences.findUnique({
      where: { id }
    });
  }

  //   async remove(id: number): Promise<ocurrences> {
  //     return this.prisma.ocurrences.update({
  //       where: { id },
  //       data: { active: false }
  //     });
  //   }
}
