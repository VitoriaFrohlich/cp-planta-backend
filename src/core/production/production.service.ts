import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductionDto } from './dto/create.production.dto';
import { UpdateProductionDto } from './dto/update.production.dto';
import { ProductionRepository } from './production.repository';
import { production_orders } from '@prisma/client';
import { format } from 'date-fns';
import { SettingsService } from 'src/settings/settings.service';
import { SessionService } from '../common/sessionService';
import { Production_Status } from '../common/enums';
import { formatDate } from '../common/utils';

@Injectable()
export class ProductionService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly productionRepository: ProductionRepository,
    private readonly settingsService: SettingsService
  ) {}

  async create(createProductionDto: CreateProductionDto) {
    const firstProductId =
      createProductionDto.production_items[0]?.final_product_id;

    const descriptionProduct = firstProductId
      ? await this.productionRepository.findProductDescriptionById(
          firstProductId
        )
      : 'Produto não encontrado';

    const currentUser = this.sessionService.getCurrentUser();
    const numberString = await this.settingsService.get('lastOrderNumber');
    const number = Number(numberString) + 1;
    const description = `Ordem ${descriptionProduct} - ${number}`;
    const status = Production_Status.CREATED;

    const production = await this.productionRepository.createOrder({
      number: number,
      description: description,
      production_date: new Date(createProductionDto.production_date),
      Production_Status: status,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: currentUser,
      updated_by: currentUser
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
        batch: item.batch,
        batch_expiration: item.batch_expiration,
        created_at: new Date(),
        updated_at: new Date()
      });

      sequence++;
      this.settingsService.incrementOrderNumber();
    }
    const allItems = await this.productionRepository.getOrderItems(
      production.id
    );

    const formattedItems = allItems.map(item => ({
      ...item,
      batch_expiration: formatDate(item.batch_expiration),
      created_at: formatDate(item.created_at),
      updated_at: formatDate(item.updated_at)
    }));

    return {
      production: {
        id: production.id,
        description: production.description,
        production_date: formatDate(production.production_date),
        created_at: formatDate(production.created_at),
        updated_at: formatDate(production.updated_at),
        Production_Status: production.Production_Status,
        items: formattedItems.sort((a, b) => a.sequence - b.sequence)
      }
    };
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
    const currentUser = this.sessionService.getCurrentUser();

    const existingOrder = await this.productionRepository.findById(id);

    if (!existingOrder) {
      throw new NotFoundException(`Production with ID ${id} not found`);
    }

    const updatedOrder = await this.productionRepository.updateOrder(id, {
      description: updateProductionDto.description ?? undefined,
      production_date: updateProductionDto.production_date
        ? new Date(updateProductionDto.production_date)
        : undefined,
      Production_Status: updateProductionDto.Production_Status ?? undefined,
      updated_at: new Date(),
      updated_by: currentUser
    });

    const existingItems = await this.productionRepository.getOrderItems(
      updatedOrder.id
    );

    let sequence = (await this.productionRepository.getLastSequence(id)) + 1;

    for (const item of updateProductionDto.production_items) {
      const existingItem = existingItems.find(i => i.id === item.id);

      if (existingItem) {
        const updateItem = {
          id: existingItem.id,
          production_order: { connect: { id: Number(updatedOrder.id) } },
          final_product_made: {
            connect: { id: Number(existingItem.final_product_id) }
          },
          production_quantity_estimated:
            item.production_quantity_estimated ?? undefined,
          production_quantity_real: item.production_quantity_real ?? undefined,
          production_quantity_loss:
            item.production_quantity_estimated && item.production_quantity_real
              ? item.production_quantity_estimated -
                item.production_quantity_real
              : undefined,
          updated_at: new Date(),
          updated_by: currentUser
        };

        await this.productionRepository.updateOrderItem(
          updateItem.id,
          updateItem
        );
      } else {
        for (const item of updateProductionDto.production_items) {
          if (
            !existingItems.find(
              i => i.final_product_id === item.final_product_id
            )
          ) {
            await this.productionRepository.createOrderItem({
              production_order_id: id,
              sequence: sequence,
              final_product_id: item.final_product_id!,
              production_quantity_estimated:
                item.production_quantity_estimated!,
              production_quantity_real: item.production_quantity_real!,
              production_quantity_loss:
                item.production_quantity_estimated &&
                item.production_quantity_real
                  ? item.production_quantity_estimated -
                    item.production_quantity_real
                  : 0,
              batch: item.batch!,
              batch_expiration: item.batch_expiration!,
              created_at: new Date(),
              updated_at: new Date(),
              created_by: currentUser!,
              updated_by: currentUser!
            });
            sequence++;
          }
        }
      }
    }
    const allItems = await this.productionRepository.getOrderItems(
      updatedOrder.id
    );

    const formattedItems = allItems.map(item => ({
      ...item,
      batch_expiration: formatDate(item.batch_expiration),
      created_at: formatDate(item.created_at),
      updated_at: formatDate(item.updated_at)
    }));

    return {
      production: {
        id,
        description: updateProductionDto.description,
        updated_at: formatDate(updatedOrder.updated_at),
        updated_by: updateProductionDto.updated_by,
        items: formattedItems.sort((a, b) => a.sequence - b.sequence)
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
