import { Injectable } from '@nestjs/common';
import {
  Prisma,
  compositions,
  composition_items,
  products
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
@Injectable()
export class CompositionsRepository {
  constructor(private prisma: PrismaService) {}

  async createCompositions(data: Prisma.compositionsCreateInput) {
    const createdComposition = await this.prisma.compositions.create({
      data: {
        description: data.description,
        production_steps: data.production_steps,
        created_at: new Date(),
        updated_at: new Date(),
        product_made: {
          connect: { id: Number(data.product_made?.connect?.id) }
        },
        created_by: data.created_by,
        updated_by: data.updated_by
      }
    });

    return createdComposition;
  }

  async createCompositionsItems(
    data: Partial<Prisma.composition_itemsCreateInput>
  ) {
    return await this.prisma.composition_items.create({
      data: {
        sequence: data.sequence,
        quantity: data.quantity,
        created_at: new Date(),
        updated_at: new Date(),
        compositions: {
          connect: { id: Number(data.compositions?.connect?.id) }
        },
        product_raw: {
          connect: { id: Number(data.product_raw?.connect?.id) }
        },
        created_by: data.created_by,
        updated_by: data.updated_by
      },
      include: {
        product_raw: {
          select: {
            description: true
          }
        }
      }
    });
  }

  async updateCompositions(
    id: number,
    data: Prisma.compositionsUpdateInput
  ): Promise<compositions> {
    const compositions = await this.prisma.compositions.update({
      where: { id },
      data: {
        description: data.description,
        production_steps: data.production_steps,
        updated_at: new Date(),
        updated_by: data.updated_by
      }
    });

    return compositions;
  }

  async updateCompositionsItems(
    id: number,
    data: Partial<Prisma.composition_itemsUpdateInput>
  ) {
    const composition_items = await this.prisma.composition_items.update({
      where: { id },
      data: {
        quantity: data.quantity,
        updated_at: new Date(),
        updated_by: data.updated_by
      },
      include: {
        product_raw: {
          select: {
            description: true
          }
        }
      }
    });

    return composition_items;
  }

  async getLastSequence(compositionsId: number): Promise<number> {
    const lastItem = await this.prisma.composition_items.findFirst({
      where: { composition_id: compositionsId },
      orderBy: { sequence: 'desc' }
    });
    return lastItem ? lastItem.sequence : 0;
  }

  async findByProductMade(final_product: number): Promise<compositions | null> {
    return this.prisma.compositions.findFirst({
      where: { final_product: final_product }
    });
  }

  async getCompositionsItems(
    compositionsId: number
  ): Promise<(composition_items & { product_raw: { description: string } })[]> {
    return await this.prisma.composition_items.findMany({
      where: { composition_id: compositionsId },
      orderBy: { sequence: 'asc' },
      include: {
        product_raw: {
          select: {
            description: true
          }
        }
      }
    });
  }

  async findItemsByCompositionsId(
    composition_id: number
  ): Promise<composition_items[]> {
    return await this.prisma.composition_items.findMany({
      where: { composition_id },
      orderBy: { sequence: 'asc' }
    });
  }

  async findFinalProductById(id: number): Promise<products> {
    const product = await this.prisma.products.findUnique({
      where: { id }
    });

    return product;
  }

  async findAllCompositionsItems(orderBy: string): Promise<compositions[]> {
    const validOrderFields = ['id', 'product_id', 'created_at', 'updated_at'];

    if (!validOrderFields.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const compositions = await this.prisma.compositions.findMany({
      orderBy: { [orderBy]: 'asc' },
      include: {
        composition_items: {
          select: {
            id: true,
            composition_id: true,
            sequence: true,
            raw_product: true,
            product_raw: {
              select: {
                description: true
              }
            },
            quantity: true,
            created_at: true,
            updated_at: true,
            created_by: true,
            updated_by: true
          },
          orderBy: { sequence: 'asc' }
        }
      }
    });

    return compositions;
  }

  async findById(id: number): Promise<compositions | null> {
    const composition = await this.prisma.compositions.findUnique({
      where: { id },
      include: {
        composition_items: {
          select: {
            id: true,
            composition_id: true,
            sequence: true,
            raw_product: true,
            product_raw: {
              select: {
                description: true
              }
            },
            quantity: true,
            created_at: true,
            updated_at: true,
            created_by: true,
            updated_by: true
          },
          orderBy: { sequence: 'asc' }
        }
      }
    });

    if (!composition) {
      throw new Error('Composition not found');
    }

    return composition;
  }

  async findManyByIds(ids: number[]): Promise<compositions[]> {
    return this.prisma.compositions.findMany({
      where: {
        id: { in: ids }
      }
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.composition_items.deleteMany({
      where: {
        composition_id: id
      }
    });

    await this.prisma.compositions.delete({
      where: {
        id
      }
    });
  }
}
