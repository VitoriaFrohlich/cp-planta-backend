import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { categories, Prisma } from '@prisma/client';

@Injectable()
export class CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.categoriesCreateInput): Promise<categories> {
    const category = await this.prisma.categories.create({
      data
    });

    const categoryResponse = {
      ...category
    };
    return categoryResponse;
  }

  async findAll(orderBy: string): Promise<categories[]> {
    const validOrderFields = ['id', 'description'];

    if (!validOrderFields.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const result = await this.prisma.categories.findMany({
      where: { active: true },
      orderBy: { [orderBy]: 'asc' }
    });

    return result;
  }

  async findById(id: number): Promise<categories | null> {
    const category = this.prisma.categories.findUnique({
      where: { id }
    });

    const categoryWithoutSensitiveFields = {
      ...category,
      created_at: undefined,
      updated_at: undefined
    };

    return categoryWithoutSensitiveFields;
  }

  async findManyByIds(ids: number[]): Promise<categories[]> {
    return this.prisma.categories.findMany({
      where: {
        id: { in: ids }
      }
    });
  }

  async matchCategoryByData(description: string): Promise<categories[]> {
    return this.prisma.categories.findMany({
      where: {
        OR: [{ description: { equals: description } }]
      }
    });
  }

  async update(
    id: number,
    data: Prisma.categoriesUpdateInput
  ): Promise<categories> {
    const category = this.prisma.categories.update({
      where: { id },
      data
    });

    const categoryResponse = {
      ...category,
      created_by: undefined,
      updated_by: undefined
    };

    return categoryResponse;
  }

  async delete(id: number): Promise<void> {
    if (!id) {
      throw new Error('ID not found');
    }
    const existingCategory = await this.findById(id);
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    await this.prisma.categories.update({
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
    const existingCategory = await this.findById(id);
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    await this.prisma.categories.update({
      where: { id },
      data: {
        active: true,
        updated_at: new Date()
      }
    });
  }
}
