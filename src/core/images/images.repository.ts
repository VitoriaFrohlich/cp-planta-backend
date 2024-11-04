import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { images, Prisma } from '@prisma/client';

@Injectable()
export class ImagesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.imagesCreateInput): Promise<images> {
    return await this.prisma.images.create({
      data
    });
  }

  async findAll(orderBy: string, imageType: string): Promise<images[]> {
    const validOrderFields = ['id', 'description'];

    if (!validOrderFields.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    let whereCondition = {};

    if (imageType === 'products') {
      whereCondition = { product: { not: null } };
    } else if (imageType === 'steps') {
      whereCondition = { steps_progress: { not: null } };
    } else if (imageType === 'stock') {
      whereCondition = { stock_item: { not: null } };
    } else {
      throw new Error('Invalid image type');
    }

    return this.prisma.images.findMany({
      where: whereCondition,
      orderBy: { [orderBy]: 'asc' }
    });
  }

  async findById(id: number): Promise<images | null> {
    const image = this.prisma.images.findUnique({
      where: { id }
    });

    const imageWithoutSensitiveFields = {
      ...image,
      created_at: undefined,
      updated_at: undefined
    };

    return imageWithoutSensitiveFields;
  }

  async findByHash(hash: string): Promise<images | null> {
    return this.prisma.images.findFirst({
      where: { hash }
    });
  }

  async findManyByIds(ids: number[]): Promise<images[]> {
    return this.prisma.images.findMany({
      where: {
        id: { in: ids }
      }
    });
  }

  async update(id: number, data: Prisma.imagesUpdateInput): Promise<images> {
    const image = this.prisma.images.update({
      where: { id },
      data
    });

    const imageResponse = {
      ...image,
      created_by: undefined,
      updated_by: undefined
    };

    return imageResponse;
  }

  async delete(id: number): Promise<void> {
    if (!id) {
      throw new Error('ID not found');
    }
    const existingImage = await this.findById(id);
    if (!existingImage) {
      throw new Error('Image not found');
    }

    await this.prisma.images.delete({
      where: { id }
    });
  }
}
