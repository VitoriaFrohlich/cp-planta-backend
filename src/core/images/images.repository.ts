import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { images, Prisma } from '@prisma/client';
import { Owner } from '../common/enums';

@Injectable()
export class ImagesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.imagesCreateInput): Promise<images> {
    return await this.prisma.images.create({
      data
    });
  }

  async findAll(owner: string, ownerId: number): Promise<images[]> {
    return this.prisma.images.findMany({
      where: {
        owner: Owner[owner],
        owner_id: ownerId
      },

      orderBy: { id: 'asc' }
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
