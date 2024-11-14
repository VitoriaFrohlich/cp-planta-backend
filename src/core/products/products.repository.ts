import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { products, Prisma, Origin } from '@prisma/client';
//import { Product } from './entities/product.entity';
//import { CreateProductDto } from './dto/create-product.dto';
import {
  //ResponseProductsDto,
  ResponseProductsMadeDto
} from './dto/product-response.dto';

@Injectable()
export class ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.productsCreateInput
  ): Promise<ResponseProductsMadeDto> {
    const product = await this.prisma.products.create({
      data
    });

    const productResponse = {
      description: product.description,
      category_id: product.category_id
      //image:product.photo
    };
    return productResponse;
  }

  async findAll(orderBy: string): Promise<products[]> {
    const validOrderFields = [
      'id',
      'code',
      'description',
      'sku',
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
      'sku',
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
    description: string,
    category_id: number
  ): Promise<products[]> {
    return this.prisma.products.findMany({
      where: {
        OR: [
          { description: { equals: description } },
          { category_id: { equals: category_id } }
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

  async delete(id: number): Promise<void> {
    await this.prisma.products.update({
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
