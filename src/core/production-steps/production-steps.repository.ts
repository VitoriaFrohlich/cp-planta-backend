import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { production_order_steps, Prisma } from '@prisma/client';

@Injectable()
export class ProductionStepsRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.production_order_stepsCreateInput
  ): Promise<production_order_steps> {
    const productionStep = await this.prisma.production_order_steps.create({
      data
    });

    const productionStepResponse = {
      ...productionStep
    };
    return productionStepResponse;
  }

  async findAll(orderBy: string): Promise<production_order_steps[]> {
    const validOrderFields = ['id', 'description'];

    if (!validOrderFields.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const result = await this.prisma.production_order_steps.findMany({
      where: { active: true },
      orderBy: { [orderBy]: 'asc' }
    });

    return result;
  }

  async findById(id: number): Promise<production_order_steps | null> {
    const productionStep = this.prisma.production_order_steps.findUnique({
      where: { id }
    });

    const productionStepWithoutSensitiveFields = {
      ...productionStep,
      created_at: undefined,
      updated_at: undefined
    };

    return productionStepWithoutSensitiveFields;
  }

  async findManyByIds(ids: number[]): Promise<production_order_steps[]> {
    return this.prisma.production_order_steps.findMany({
      where: {
        id: { in: ids }
      }
    });
  }

  async matchByData(description: string): Promise<production_order_steps[]> {
    return this.prisma.production_order_steps.findMany({
      where: {
        OR: [{ description: { equals: description } }]
      }
    });
  }

  async update(
    id: number,
    data: Prisma.production_order_stepsUpdateInput
  ): Promise<production_order_steps> {
    const productionStep = this.prisma.production_order_steps.update({
      where: { id },
      data
    });

    const productionStepResponse = {
      ...productionStep,
      created_by: undefined,
      updated_by: undefined
    };

    return productionStepResponse;
  }

  async delete(id: number, updated_by: string): Promise<void> {
    if (!id) {
      throw new Error('ID not found');
    }
    const existingCategory = await this.findById(id);
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    await this.prisma.production_order_steps.update({
      where: { id },
      data: {
        active: false,
        updated_at: new Date(),
        updated_by: updated_by
      }
    });
  }

  async reactivate(id: number, updated_by: string): Promise<void> {
    await this.prisma.production_order_steps.update({
      where: { id },
      data: {
        active: true,
        updated_at: new Date(),
        updated_by: updated_by
      }
    });
  }
}
