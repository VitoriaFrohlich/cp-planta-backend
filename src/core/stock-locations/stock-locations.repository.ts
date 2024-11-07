import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Prisma, stock_location } from '@prisma/client';

@Injectable()
export class StockLocationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.stock_locationCreateInput
  ): Promise<stock_location> {
    const stock_location = await this.prisma.stock_location.create({
      data
    });

    return stock_location;
  }

  async findAll(orderBy: string): Promise<stock_location[]> {
    const validOrderFields = ['id', 'description', 'active'];

    if (!validOrderFields.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const result = await this.prisma.stock_location.findMany({
      where: { active: true },
      orderBy: { [orderBy]: 'asc' }
    });

    return result;
  }

  async findById(id: number): Promise<stock_location | null> {
    const stockLocation = await this.prisma.stock_location.findUnique({
      where: { id }
    });

    if (!stockLocation) {
      return null;
    }

    return stockLocation;
  }

  async findByIds(ids: number[]): Promise<stock_location[]> {
    return this.prisma.stock_location.findMany({
      where: {
        id: { in: ids }
      }
    });
  }

  async matchStockLocationByData(
    description: string
  ): Promise<stock_location[]> {
    return this.prisma.stock_location.findMany({
      where: {
        OR: [{ description: { equals: description } }]
      }
    });
  }

  async update(
    id: number,
    data: Prisma.stock_locationUpdateInput
  ): Promise<stock_location> {
    const stock_location = this.prisma.stock_location.update({
      where: { id },
      data
    });

    const stock_locationResponse = {
      ...stock_location
    };
    return stock_locationResponse;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.stock_location.update({
      where: { id },
      data: {
        active: false,
        updated_at: new Date()
      }
    });
  }

  async reactivate(id: number): Promise<void> {
    await this.prisma.stock_location.update({
      where: { id },
      data: {
        active: true,
        updated_at: new Date()
      }
    });
  }
}
