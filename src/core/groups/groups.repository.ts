import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { groups, Prisma } from '@prisma/client';

@Injectable()
export class GroupsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.groupsCreateInput): Promise<groups> {
    return await this.prisma.groups.create({
      data
    });
  }

  async findAll(orderBy: string): Promise<groups[]> {
    const validOrderFields = ['id', 'description'];

    if (!validOrderFields.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const result = await this.prisma.groups.findMany({
      where: { active: true },
      orderBy: { [orderBy]: 'asc' }
    });

    return result;
  }

  async findById(id: number): Promise<groups | null> {
    const group = this.prisma.groups.findUnique({
      where: { id }
    });

    const groupWithoutSensitiveFields = {
      ...group,
      created_at: undefined,
      updated_at: undefined
    };

    return groupWithoutSensitiveFields;
  }

  async findManyByIds(ids: number[]): Promise<groups[]> {
    return this.prisma.groups.findMany({
      where: {
        id: { in: ids }
      }
    });
  }

  async matchGroupByData(description: string): Promise<groups[]> {
    return this.prisma.groups.findMany({
      where: {
        OR: [{ description: { equals: description } }]
      }
    });
  }

  async update(id: number, data: Prisma.groupsUpdateInput): Promise<groups> {
    return this.prisma.groups.update({
      where: { id },
      data
    });
  }

  async delete(id: number, updated_by: string): Promise<void> {
    await this.prisma.groups.update({
      where: { id },
      data: {
        active: false,
        updated_at: new Date(),
        updated_by: updated_by
      }
    });
  }

  async reactivate(id: number, updated_by: string): Promise<void> {
    await this.prisma.groups.update({
      where: { id },
      data: {
        active: true,
        updated_at: new Date(),
        updated_by: updated_by
      }
    });
  }
}
