import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import {
  Prisma,
  production_order_steps,
  production_steps_progress
} from '@prisma/client';

@Injectable()
export class StepsRepository {
  constructor(private prisma: PrismaService) {}

  async createStep(data: Prisma.production_order_stepsCreateInput) {
    return await this.prisma.production_order_steps.create({
      data
    });
  }

  async createStepProgress(
    data: Prisma.production_steps_progressUncheckedCreateInput
  ) {
    return await this.prisma.production_steps_progress.create({
      data
    });
  }

  async getLastSequence(stepId: number): Promise<number> {
    const lastItem = await this.prisma.production_order_steps.findFirst({
      where: { id: stepId },
      orderBy: { id: 'desc' }
    });
    return lastItem ? lastItem.id : 0;
  }

  async getOrderItems(stepId: number): Promise<production_steps_progress[]> {
    return await this.prisma.production_steps_progress.findMany({
      where: { id: stepId },
      orderBy: { sequence: 'asc' }
    });
  }
  //Precisa da order no bd
  async findAll(orderBy: string): Promise<production_order_steps[]> {
    const order = ['id', 'description', 'active', 'created_by', 'updated_by'];
    if (!order.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const result = await this.prisma.production_order_steps.findMany({
      orderBy: { [orderBy]: 'asc' }
    });
    return result;
  }

  async findAllProductionItems(
    orderBy: string
  ): Promise<production_order_steps[]> {
    const order = ['id', 'description', 'active', 'created_by', 'updated_by'];
    if (!order.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const result = await this.prisma.production_order_steps.findMany({
      orderBy: { [orderBy]: 'asc' },
      include: {
        production_steps_progress: {
          select: {
            id: true,
            production_id: true,
            step_id: true,
            sequence: true,
            raw_product_id: true,
            start_time: true,
            end_time: true,
            total_time: true,
            initial_quantity: true,
            final_quantity: true,
            quantity_loss: true,
            machine: true,
            line_id: true,
            image_link: true,
            photo: true,
            observation: true,
            operator_id: true,
            ocurrences: true,
            created_at: true,
            updated_at: true,
            created_by: true
          },
          orderBy: { sequence: 'asc' }
        }
      }
    });

    return result;
  }

  async findById(id: number): Promise<production_order_steps | null> {
    const active = this.prisma.production_order_steps.findUnique({
      where: { id },
      include: {
        production_steps_progress: {
          select: {
            id: true,
            production_id: true,
            sequence: true,
            raw_product_id: true,
            start_time: true,
            end_time: true,
            total_time: true,
            initial_quantity: true,
            final_quantity: true,
            quantity_loss: true,
            machine: true,
            line_id: true,
            image_link: true,
            photo: true,
            observation: true,
            operator_id: true,
            ocurrences: true,
            created_at: true,
            updated_at: true,
            created_by: true
          }
        }
      }
    });

    if (!active) {
      return null;
    }

    return active;
  }

  async updateOrder(
    id: number,
    data: Prisma.production_ordersUpdateInput
  ): Promise<production_order_steps> {
    const product = this.prisma.production_order_steps.update({
      where: { id },
      data
    });

    const productionResponse = {
      ...product
    };
    return productionResponse;
  }

  async updateOrderItem(
    id: number,
    data: Prisma.production_order_stepsUncheckedUpdateInput
  ): Promise<production_order_steps> {
    const product = this.prisma.production_order_steps.update({
      where: { id },
      data
    });

    const productionResponse = {
      ...product
    };
    return productionResponse;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.production_order_steps.deleteMany({
      where: { id: id }
    });

    const progressIds = await this.prisma.production_steps_progress
      .findMany({
        where: { production_id: id },
        select: { id: true }
      })
      .then(results => results.map(result => result.id));

    if (progressIds.length > 0) {
      await this.prisma.ocurrences_of_production_stages.deleteMany({
        where: { stage_ocurred_id: { in: progressIds } }
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
