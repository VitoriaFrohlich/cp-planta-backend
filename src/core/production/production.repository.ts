import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import {
  production_orders,
  Prisma,
  production_orders_items,
  composition_items,
  compositions,
  stock_items
} from '@prisma/client';

@Injectable()
export class ProductionRepository {
  constructor(private prisma: PrismaService) {}

  async createOrder(data: Prisma.production_ordersCreateInput) {
    return await this.prisma.production_orders.create({
      data
    });
  }

  async createOrderItem(
    data: Prisma.production_orders_itemsUncheckedCreateInput
  ) {
    return await this.prisma.production_orders_items.create({
      data
    });
  }

  async getLastSequence(productionOrderId: number): Promise<number> {
    const lastItem = await this.prisma.production_orders_items.findFirst({
      where: { production_order_id: productionOrderId },
      orderBy: { sequence: 'desc' }
    });
    return lastItem ? lastItem.sequence : 0;
  }

  async getOrderItems(
    productionOrderId: number
  ): Promise<production_orders_items[]> {
    return await this.prisma.production_orders_items.findMany({
      where: { production_order_id: productionOrderId },
      orderBy: { sequence: 'asc' }
    });
  }

  async findAll(orderBy: string): Promise<production_orders[]> {
    const order = [
      'id',
      'number',
      'description',
      'production_date',
      'production_line',
      'Production_Status',
      'created_by',
      'updated_by'
    ];
    if (!order.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const result = await this.prisma.production_orders.findMany({
      orderBy: { [orderBy]: 'asc' }
    });
    return result;
  }

  async findAllProductionItems(orderBy: string): Promise<production_orders[]> {
    const order = [
      'id',
      'number',
      'description',
      'production_date',
      'Production_Status',
      'created_by',
      'updated_by'
    ];
    if (!order.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const result = await this.prisma.production_orders.findMany({
      orderBy: { [orderBy]: 'asc' },
      include: {
        production_item: {
          select: {
            id: true,
            production_order_id: true,
            sequence: true,
            raw_product_id: true,
            raw_product_initial_quantity: true,
            raw_product_used_quantity: true,
            used_batchs: true,
            created_at: true,
            updated_at: true,
            created_by: true,
            updated_by: true
          },
          orderBy: { sequence: 'asc' }
        }
      }
    });

    return result;
  }

  async findById(id: number): Promise<production_orders | null> {
    const order = this.prisma.production_orders.findUnique({
      where: { id },
      include: {
        production_item: {
          select: {
            id: true,
            production_order_id: true,
            sequence: true,
            raw_product_id: true,
            raw_product: {
              select: {
                description: true
              }
            },
            raw_product_initial_quantity: true,
            raw_product_used_quantity: true,
            used_batchs: true,
            created_at: true,
            updated_at: true,
            created_by: true,
            updated_by: true
          }
        }
      }
    });

    if (!order) {
      return null;
    }

    return order;
  }

  async findProductDescriptionById(id: number): Promise<string> {
    const product = await this.prisma.products.findUnique({
      where: { id },
      select: { description: true }
    });

    return product.description;
  }

  async findStockItemById(id: number): Promise<stock_items> {
    return await this.prisma.stock_items.findUnique({
      where: { id }
    });
  }

  async findCompositionById(id: number): Promise<compositions> {
    return this.prisma.compositions.findFirst({
      where: { final_product: id }
    });
  }

  async findCompositionItemsById(id: number): Promise<composition_items[]> {
    return this.prisma.composition_items.findMany({
      where: { composition_id: id }
    });
  }

  async findCompositionItemById(id: number): Promise<composition_items> {
    return this.prisma.composition_items.findUnique({
      where: { id: id }
    });
  }

  async updateOrder(
    id: number,
    data: Prisma.production_ordersUpdateInput
  ): Promise<production_orders> {
    return this.prisma.production_orders.update({
      where: { id },
      data
    });
  }

  async updateOrderItem(
    id: number,
    data: Prisma.production_orders_itemsUpdateInput
  ): Promise<production_orders_items> {
    return this.prisma.production_orders_items.update({
      where: { id },
      data: {
        production_order: {
          connect: { id: Number(data.production_order?.connect?.id) }
        },
        raw_product: {
          connect: { id: Number(data.raw_product?.connect?.id) }
        },
        raw_product_initial_quantity: data.raw_product_initial_quantity,
        raw_product_used_quantity: data.raw_product_used_quantity,
        updated_at: data.updated_at,
        updated_by: data.updated_by
      }
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.production_orders_items.deleteMany({
      where: { production_order_id: id }
    });

    const progressIds = await this.prisma.production_steps_progress
      .findMany({
        where: { production_id: id },
        select: { id: true }
      })
      .then(results => results.map(result => result.id));

    if (progressIds.length > 0) {
      await this.prisma.occurrences_of_production_stages.deleteMany({
        where: { stage_occurred_id: { in: progressIds } }
      });
    }

    await this.prisma.production_steps_progress.deleteMany({
      where: { production_id: id }
    });

    await this.prisma.production_orders.delete({
      where: { id }
    });
  }
}
