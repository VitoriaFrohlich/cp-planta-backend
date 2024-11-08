import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import {
  production_orders,
  Prisma,
  production_orders_items
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
            final_product_id: true,
            production_quantity_estimated: true,
            production_quantity_real: true,
            production_quantity_loss: true,
            batch: true,
            batch_expiration: true,
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
            final_product_id: true,
            final_product_made: {
              select: {
                description: true
              }
            },
            production_quantity_estimated: true,
            production_quantity_real: true,
            production_quantity_loss: true,
            batch: true,
            batch_expiration: true,
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
        final_product_made: {
          connect: { id: Number(data.final_product_made?.connect?.id) }
        },
        production_quantity_estimated: data.production_quantity_estimated,
        production_quantity_real: data.production_quantity_real,
        production_quantity_loss: data.production_quantity_loss,
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
