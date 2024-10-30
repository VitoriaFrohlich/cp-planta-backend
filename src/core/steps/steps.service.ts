import { Injectable, NotFoundException } from '@nestjs/common';
//import { UpdateStepDto } from './dto/update-step.dto';
//import { number } from 'zod';
import { CreateStepDto } from './dto/create-step.dto';
import { StepsRepository } from './steps.repository';
import { production_order_steps } from '@prisma/client';
import { format } from 'date-fns';

@Injectable()
export class StepsService {
  constructor(private readonly stepsRepository: StepsRepository) {}

  async create(createStepDto: CreateStepDto) {
    const production = await this.stepsRepository.createStep({
      description: createStepDto.description,
      active: createStepDto.active,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: createStepDto.created_by,
      updated_by: createStepDto.updated_by
    });

    let sequence = 1;
    for (const item of createStepDto.production_items) {
      await this.stepsRepository.createStepProgress({
        id: item.id,
        production_id: item.production_id,
        step_id: production.id,
        sequence: sequence,
        raw_product_id: item.raw_product_id,
        start_time: item.start_time,
        end_time: item.end_time,
        total_time: item.total_time,
        initial_quantity: item.initial_quantity,
        final_quantity: item.final_quantity,
        quantity_loss: item.quantity_loss,
        machine: item.machine,
        line_id: item.line_id,
        image_link: item.image_link,
        //photo: item.photo,
        observation: item.observation,
        operator_id: item.operator_id,
        ocurrences: item.ocurrences,
        created_at: new Date(),
        updated_at: new Date()
      });

      sequence++;
    }
    return { production, items: createStepDto.production_items };
  }

  async findAll(orderBy: string): Promise<
    (Omit<production_order_steps, 'created_at' | 'updated_at'> & {
      created_at: string;
      updated_at: string;
    })[]
  > {
    const findedProducts = await this.stepsRepository.findAll(orderBy);
    return findedProducts.map(product => this.formatProductionDate(product));
  }

  async findOne(id: number): Promise<
    Omit<production_order_steps, 'created_at' | 'updated_at'> & {
      created_at: string;
      updated_at: string;
    }
  > {
    const order = await this.stepsRepository.findById(id);

    if (!order) {
      throw new NotFoundException(`Production with ID ${id} not found`);
    }

    return this.formatProductionDate(order);
  }

  // async update(id: number, updateProductionDto: UpdateStepDto) {
  //   await this.stepsRepository.updateOrder(id, {
  //     description: updateProductionDto.description ?? undefined,
  //     production_date: updateProductionDto.production_date
  //       ? new Date(updateProductionDto.production_date)
  //       : undefined,
  //     Production_Status: updateProductionDto.Production_Status ?? undefined,
  //     updated_at: new Date(),
  //     updated_by: updateProductionDto.updated_by ?? undefined
  //   });

  //   const existingItems = await this.productionRepository.getOrderItems(id);
  //   const updatedItems = [];

  //   let sequence = (await this.productionRepository.getLastSequence(id)) + 1;

  //   for (const item of updateProductionDto.production_items) {
  //     const existingItem = existingItems.find(
  //       i => i.final_product_id === item.final_product_id
  //     );

  //     if (existingItem) {
  //       await this.productionRepository.updateOrderItem(
  //         item.production_order_id,
  //         {
  //           final_product_id: item.final_product_id,
  //           prodution_quantity_estimated:
  //             item.prodution_quantity_estimated ?? undefined,
  //           production_quantity_real:
  //             item.production_quantity_real ?? undefined,
  //           production_quantity_loss:
  //             item.prodution_quantity_estimated && item.production_quantity_real
  //               ? item.prodution_quantity_estimated -
  //                 item.production_quantity_real
  //               : undefined,
  //           updated_at: new Date(),
  //           updated_by: updateProductionDto.updated_by ?? undefined
  //         }
  //       );
  //       updatedItems.push({ ...existingItem, ...item });
  //     } else {
  //       // Cria um novo item
  //       const newItem = await this.productionRepository.createOrderItem({
  //         production_order_id: id,
  //         sequence: sequence,
  //         final_product_id: item.final_product_id!,
  //         prodution_quantity_estimated: item.prodution_quantity_estimated!,
  //         production_quantity_real: item.production_quantity_real!,
  //         production_quantity_loss:
  //           item.prodution_quantity_estimated && item.production_quantity_real
  //             ? item.prodution_quantity_estimated -
  //               item.production_quantity_real
  //             : 0,
  //         lote: item.lote!,
  //         lote_expiration: item.lote_expiration!,
  //         created_at: new Date(),
  //         updated_at: new Date(),
  //         created_by: updateProductionDto.updated_by!,
  //         updated_by: updateProductionDto.updated_by!
  //       });
  //       updatedItems.push(newItem);
  //       sequence++;
  //     }
  //   }

  //   const allItems = updatedItems.concat(existingItems);
  //   allItems.sort((a, b) => a.sequence - b.sequence);

  //   return {
  //     production: {
  //       id,
  //       description: updateProductionDto.description,
  //       updated_at: new Date(),
  //       updated_by: updateProductionDto.updated_by,
  //       items: updatedItems.concat(
  //         existingItems.filter(i => !updatedItems.includes(i))
  //       )
  //     }
  //   };
  // }

  // async remove(id: number) {
  //   await this.isValid(id);
  //   await this.stepsRepository.delete(id);
  // }

  private formatProductionDate(production: production_order_steps): Omit<
    production_order_steps,
    'created_at' | 'updated_at'
  > & {
    created_at: string;
    updated_at: string;
  } {
    return {
      ...production,
      created_at: format(
        new Date(production.created_at),
        'dd/MM/yyyy HH:mm:ss'
      ),
      updated_at: format(new Date(production.updated_at), 'dd/MM/yyyy HH:mm:ss')
    };
  }

  async isValid(id: number) {
    const order = await this.stepsRepository.findById(id);

    if (!order) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return order;
  }
}
