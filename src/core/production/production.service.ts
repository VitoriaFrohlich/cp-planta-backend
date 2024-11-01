import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductionDto } from './dto/create-production.dto';
//import { CreateProductionItemsDto } from './dto/create-production.dto';
import { UpdateProductionDto } from './dto/update-production.dto';
import { ProductionRepository } from './production.repository';
import { production_orders } from '@prisma/client';
import { format } from 'date-fns';

@Injectable()
export class ProductionService {
  constructor(private readonly productionRepository: ProductionRepository) {}

  async create(createProductionDto: CreateProductionDto) {
    const production = await this.productionRepository.createOrder({
      number: createProductionDto.number,
      description: createProductionDto.description,
      production_date: new Date(createProductionDto.production_date),
      Production_Status: createProductionDto.Production_Status,
      created_at: new Date(),
      updated_at: new Date()
    });

    let sequence = 1;
    for (const item of createProductionDto.production_items) {
      await this.productionRepository.createOrderItem({
        production_order_id: production.id,
        sequence: sequence,
        final_product_id: item.final_product_id,
        production_quantity_estimated: item.production_quantity_estimated,
        production_quantity_real: item.production_quantity_real,
        production_quantity_loss:
          item.production_quantity_estimated - item.production_quantity_real,
        lote: item.lote,
        lote_expiration: item.lote_expiration,
        created_at: new Date(),
        updated_at: new Date()
      });

      sequence++;
    }
    return { production, items: createProductionDto.production_items };
  }

  async findAll(orderBy: string): Promise<
    (Omit<
      production_orders,
      'created_at' | 'updated_at' | 'production_date'
    > & {
      created_at: string;
      updated_at: string;
      production_date: string;
    })[]
  > {
    const findedProduction =
      await this.productionRepository.findAllProductionItems(orderBy);
    return findedProduction.map(production =>
      this.formatProductionDate(production)
    );
  }

  async findOne(id: number): Promise<
    Omit<production_orders, 'created_at' | 'updated_at' | 'production_date'> & {
      created_at: string;
      updated_at: string;
      production_date: string;
    }
  > {
    const order = await this.productionRepository.findById(id);

    if (!order) {
      throw new NotFoundException(`Production with ID ${id} not found`);
    }

    return this.formatProductionDate(order);
  }

  async update(id: number, updateProductionDto: UpdateProductionDto) {
    await this.productionRepository.updateOrder(id, {
      description: updateProductionDto.description ?? undefined,
      production_date: updateProductionDto.production_date
        ? new Date(updateProductionDto.production_date)
        : undefined,
      Production_Status: updateProductionDto.Production_Status ?? undefined,
      updated_at: new Date(),
      updated_by: updateProductionDto.updated_by ?? undefined
    });

    const existingItems = await this.productionRepository.getOrderItems(id);
    const updatedItems = [];

    let sequence = (await this.productionRepository.getLastSequence(id)) + 1;

    for (const item of updateProductionDto.production_items) {
      const existingItem = existingItems.find(
        i => i.final_product_id === item.final_product_id
      );

      if (existingItem) {
        await this.productionRepository.updateOrderItem(
          item.production_order_id,
          {
            final_product_id: item.final_product_id,
            production_quantity_estimated:
              item.production_quantity_estimated ?? undefined,
            production_quantity_real:
              item.production_quantity_real ?? undefined,
            production_quantity_loss:
              item.production_quantity_estimated &&
              item.production_quantity_real
                ? item.production_quantity_estimated -
                  item.production_quantity_real
                : undefined,
            updated_at: new Date(),
            updated_by: updateProductionDto.updated_by ?? undefined
          }
        );
        updatedItems.push({ ...existingItem, ...item });
      } else {
        // Cria um novo item
        const newItem = await this.productionRepository.createOrderItem({
          production_order_id: id,
          sequence: sequence,
          final_product_id: item.final_product_id!,
          production_quantity_estimated: item.production_quantity_estimated!,
          production_quantity_real: item.production_quantity_real!,
          production_quantity_loss:
            item.production_quantity_estimated && item.production_quantity_real
              ? item.production_quantity_estimated -
                item.production_quantity_real
              : 0,
          lote: item.lote!,
          lote_expiration: item.lote_expiration!,
          created_at: new Date(),
          updated_at: new Date(),
          created_by: updateProductionDto.updated_by!,
          updated_by: updateProductionDto.updated_by!
        });
        updatedItems.push(newItem);
        sequence++;
      }
    }

    const allItems = updatedItems.concat(existingItems);
    allItems.sort((a, b) => a.sequence - b.sequence);

    return {
      production: {
        id,
        description: updateProductionDto.description,
        updated_at: new Date(),
        updated_by: updateProductionDto.updated_by,
        items: updatedItems.concat(
          existingItems.filter(i => !updatedItems.includes(i))
        )
      }
    };
  }

  async remove(id: number) {
    await this.isValid(id);
    await this.productionRepository.delete(id);
  }

  private formatProductionDate(production: production_orders): Omit<
    production_orders,
    'created_at' | 'updated_at' | 'production_date'
  > & {
    created_at: string;
    updated_at: string;
    production_date: string;
  } {
    return {
      ...production,
      created_at: format(
        new Date(production.created_at),
        'dd/MM/yyyy HH:mm:ss'
      ),
      updated_at: format(
        new Date(production.updated_at),
        'dd/MM/yyyy HH:mm:ss'
      ),
      production_date: format(
        new Date(production.production_date),
        'dd/MM/yyyy HH:mm:ss'
      )
    };
  }

  async isValid(id: number) {
    const order = await this.productionRepository.findById(id);

    if (!order) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return order;
  }
}
