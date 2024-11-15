import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { products, Prisma, Origin } from '@prisma/client';

@Injectable()
export class ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.productsCreateInput): Promise<products> {
    const product = await this.prisma.products.create({
      data
    });

    const productResponse = {
      ...product
    };
    return productResponse;
  }

  async findAll(orderBy: string): Promise<products[]> {
    const validOrderFields = [
      'id',
      'code',
      'description',
      'origin',
      'unit_measure',
      'category_id',
      'group_id'
    ];

    if (!validOrderFields.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const result = await this.prisma.products.findMany({
      where: { active: true },
      orderBy: { [orderBy]: 'asc' }
    });

    return result;
  }

  async findByOrigin(orderBy: string, origin: string): Promise<products[]> {
    const validOrderFields = [
      'id',
      'code',
      'description',
      'unit_measure',
      'category_id',
      'group_id'
    ];

    if (!validOrderFields.includes(orderBy)) {
      throw new Error('Invalid order field');
    }
    if (origin === Origin.MADE) {
      const result = await this.prisma.products.findMany({
        where: { active: true, origin: origin },
        orderBy: { [orderBy]: 'asc' }
      });
      return result;
    }

    const result = await this.prisma.products.findMany({
      where: { active: true, origin: { not: 'MADE' } },
      orderBy: { [orderBy]: 'asc' }
    });

    return result;
  }

  async findById(id: number): Promise<products | null> {
    const product = this.prisma.products.findUnique({
      where: { id }
    });

    if (!product) {
      return null;
    }

    return product;
  }

  async findManyByIds(ids: number[]): Promise<products[]> {
    return this.prisma.products.findMany({
      where: {
        id: { in: ids }
      }
    });
  }

  async matchProductByData(
    code: string,
    description: string
  ): Promise<products[]> {
    return this.prisma.products.findMany({
      where: {
        OR: [
          { code: { equals: code } },
          { description: { equals: description } }
        ]
      }
    });
  }

  async update(
    id: number,
    data: Prisma.productsUpdateInput
  ): Promise<products> {
    const product = this.prisma.products.update({ where: { id }, data });

    const productResponse = {
      ...product
    };
    return productResponse;
  }

  async delete(id: number, updated_by: string): Promise<void> {
    await this.prisma.products.update({
      where: { id },
      data: {
        active: false,
        updated_at: new Date(),
        updated_by: updated_by
      }
    });
  }

  async reactivate(id: number): Promise<void> {
    if (!id) {
      throw new Error('ID not found');
    }
    const existingProduct = await this.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    await this.prisma.products.update({
      where: { id },
      data: {
        active: true,
        updated_at: new Date()
      }
    });
  }
}
