import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { groups, Prisma } from '@prisma/client';

@Injectable()
export class GroupsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.groupsCreateInput): Promise<groups> {
    const group = await this.prisma.groups.create({
      data
    });

    const groupResponse = {
      ...group
    };
    return groupResponse;
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
    const group = this.prisma.groups.update({
      where: { id },
      data
    });

    const groupResponse = {
      ...group,
      created_by: undefined,
      updated_by: undefined
    };
    return groupResponse;
  }

  async delete(id: number): Promise<void> {
    if (!id) {
      throw new Error('ID not found');
    }
    const existingGroup = await this.findById(id);
    if (!existingGroup) {
      throw new Error('Group not found');
    }

    await this.prisma.groups.update({
      where: { id },
      data: {
        active: false,
        updated_at: new Date()
      }
    });
  }

  async reactivate(id: number): Promise<void> {
    if (!id) {
      throw new Error('ID not found');
    }
    const existingGroup = await this.findById(id);
    if (!existingGroup) {
      throw new Error('Group not found');
    }

    await this.prisma.groups.update({
      where: { id },
      data: {
        active: true,
        updated_at: new Date()
      }
    });
  }
}
