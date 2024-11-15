import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { persons, Prisma } from '@prisma/client';

@Injectable()
export class PersonsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.personsCreateInput): Promise<persons> {
    return await this.prisma.persons.create({
      data
    });
  }

  async findAll(orderBy: string): Promise<persons[]> {
    const validOrderFields = ['id', 'name'];

    if (!validOrderFields.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const result = await this.prisma.persons.findMany({
      where: { active: true },
      orderBy: { [orderBy]: 'asc' }
    });

    return result;
  }

  async findById(id: number): Promise<persons | null> {
    return await this.prisma.persons.findUnique({
      where: { id }
    });
  }

  async findManyByIds(ids: number[]): Promise<persons[]> {
    return this.prisma.persons.findMany({
      where: {
        id: { in: ids }
      }
    });
  }

  async matchPersonByData(name: string): Promise<persons[]> {
    return this.prisma.persons.findMany({
      where: {
        OR: [{ name: { equals: name } }]
      }
    });
  }

  async update(id: number, data: Prisma.personsUpdateInput): Promise<persons> {
    return await this.prisma.persons.update({
      where: { id },
      data
    });
  }

  async delete(id: number, updated_by: string): Promise<void> {
    if (!id) {
      throw new Error('ID not found');
    }
    const existingPerson = await this.findById(id);
    if (!existingPerson) {
      throw new Error('Person not found');
    }

    await this.prisma.persons.update({
      where: { id },
      data: {
        active: false,
        updated_at: new Date(),
        updated_by: updated_by
      }
    });
  }

  async reactivate(id: number, updated_by: string): Promise<void> {
    if (!id) {
      throw new Error('ID not found');
    }
    const existingPerson = await this.findById(id);
    if (!existingPerson) {
      throw new Error('Person not found');
    }

    await this.prisma.persons.update({
      where: { id },
      data: {
        active: true,
        updated_at: new Date(),
        updated_by: updated_by
      }
    });
  }
}
