import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateStockDto, CreateStockItemsDto } from './dto/create.stock.dto';
import { UpdateStockDto } from './dto/update.stock.dto';
import { StockRepository } from './stock.repository';
import { SettingsService } from 'src/settings/settings.service';
import { BatchService } from '../common/batch.utils';
import { format } from 'date-fns';
import { stock } from '@prisma/client';
import { Stock_Moviment } from '../common/enums';
import { SessionService } from '../common/sessionService';
import { formatDate } from '../common/utils';

@Injectable()
export class StockService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly stockRepository: StockRepository,
    private readonly settingsService: SettingsService,
    private readonly batchService: BatchService
  ) {}

  stockMovimentsToCheck = new Set([
    Stock_Moviment.OUTPUT,
    Stock_Moviment.RESERVED,
    Stock_Moviment.ADJUST
  ]);

  async create(createStockDto: CreateStockDto) {
    const errorMessages = [];
    if (!Array.isArray(createStockDto.stock_items)) {
      throw new BadRequestException('Items must be an array');
    }

    const currentUser = this.sessionService.getCurrentUser();
    let documentNumber = '';
    let isInput = false;

    if (createStockDto.stock_moviment === Stock_Moviment.INPUT) {
      isInput = true;

      documentNumber = await this.settingsService.get(
        'lastInputDocumentNumber'
      );
    } else {
      isInput = false;

      documentNumber = await this.settingsService.get(
        'lastOutputDocumentNumber'
      );
    }

    const number = Number(documentNumber) + 1;

    const existingStock = await this.stockRepository.findByDocumentNumber(
      number.toString()
    );
    if (existingStock) {
      throw new BadRequestException(`Document number ${number} already exists`);
    }

    if (!isInput) {
      const enableNegativeStock = await this.settingsService.get(
        'enableNegativeStock'
      );

      if (enableNegativeStock == 'false') {
        await this.validateStock(createStockDto.stock_items, errorMessages);
      }
    }

    if (errorMessages.length > 0) {
      return {
        success: false,
        errors: errorMessages,
        message:
          'Não foi possível processar todos os itens devido a saldos insuficientes.'
      };
    }

    let stockDocument;
    const createdItems = [];
    try {
      stockDocument = await this.stockRepository.createStock({
        document_number: number.toString(),
        document_date: new Date(),
        stock_moviment: createStockDto.stock_moviment,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: currentUser,
        updated_by: currentUser
      });

      let sequencia = 1;

      const stock_location_default_str = await this.settingsService.get(
        'defaultStockLocation'
      );
      const stock_location_default = parseInt(stock_location_default_str, 10);

      for (const item of createStockDto.stock_items) {
        let batch;
        let batch_expiration;
        if (!item.batch) {
          [batch, batch_expiration] = await this.getLote(
            stockDocument.stock_moviment
          );
        } else {
          batch = item.batch;
          batch_expiration = new Date(item.batch_expiration);
        }

        await this.stockRepository.createStockItems({
          stock_id: stockDocument.id,
          product_id: item.product_id,
          sequence: sequencia,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.unit_price * item.quantity,
          batch: batch,
          batch_expiration: batch_expiration.toISOString(),
          observation: item.observation!,
          supplier: item.supplier!,
          costumer: item.costumer!,
          stock_location_id: item.stock_location_id || stock_location_default,
          created_at: new Date(),
          updated_at: new Date()
        });
        sequencia++;

        await this.settingsService.set(
          isInput ? 'lastInputDocumentNumber' : 'lastOutputDocumentNumber',
          number.toString()
        );
      }

      const allItems = await this.stockRepository.getStockItems(
        stockDocument.id
      );

      createdItems.push(
        ...allItems.map(item => ({
          ...item,
          batch_expiration: formatDate(item.batch_expiration),
          created_at: formatDate(item.created_at),
          updated_at: formatDate(item.updated_at)
        }))
      );

      return {
        stockDocument: {
          id: stockDocument.id,
          document_number: stockDocument.document_number,
          document_date: formatDate(stockDocument.document_date),
          stock_moviment: stockDocument.stock_moviment,
          created_at: formatDate(stockDocument.created_at),
          items: createdItems
        }
      };
    } catch (error) {
      console.error('Error during item insertion:', (error as Error).message); // Log do erro capturado

      if (stockDocument?.id) {
        try {
          await this.stockRepository.deleteStock(stockDocument.id);
        } catch (deleteError) {
          console.error(
            'Error removing stock document:',
            (deleteError as Error).message
          );
        }
      }

      return {
        success: false,
        message:
          'Erro ao criar itens do documento de estoque. Documento foi removido.'
      };
    }
  }

  async getLote(stockMoviment: Stock_Moviment): Promise<[string, Date]> {
    const batchGenerated = await this.batchService.generateBatch(
      stockMoviment === Stock_Moviment.INPUT ? 'INPUT' : 'OUTPUT'
    );
    const [batch, batch_expiration] = batchGenerated.split('-');
    return [batch, new Date(batch_expiration)];
  }

  private async validateStock(
    items: CreateStockItemsDto[],
    errorMessages: string[]
  ) {
    for (const item of items) {
      const saldoAtual = await this.checkStock(item.product_id, item.batch);
      if (item.quantity > saldoAtual) {
        errorMessages.push(
          `Saldo insuficiente para o produto ${item.product_id} no batch ${item.batch}. \nQuantidade atual: ${saldoAtual}.`
        );
      }
    }
  }

  async checkStock(product_id: number, batch: string): Promise<number> {
    const estoque = await this.stockRepository.checkStock(product_id, batch);

    return estoque || 0;
  }

  async findAll(orderBy: string): Promise<
    (Omit<stock, 'created_at' | 'updated_at'> & {
      created_at: string;
      updated_at: string;
    })[]
  > {
    const findedStock = await this.stockRepository.findAllStockItems(orderBy);
    return findedStock.map(stock => this.formatDate(stock));
  }

  async findOne(id: number): Promise<
    Omit<stock, 'created_at' | 'updated_at'> & {
      created_at: string;
      updated_at: string;
    }
  > {
    const order = await this.stockRepository.findById(id);

    if (!order) {
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }

    return this.formatDate(order);
  }

  async getAllProductLots(orderBy, origin) {
    return this.stockRepository.getAllProductBatchs(orderBy, origin);
  }

  async update(id: number, updateStockDto: UpdateStockDto) {
    const currentUser = this.sessionService.getCurrentUser();

    await this.stockRepository.updateStock(id, {
      updated_at: new Date(),
      updated_by: currentUser
    });

    const existingItems = await this.stockRepository.getStockItems(id);

    const updatedItems = [];

    for (const item of updateStockDto.stock_items) {
      const existingItem = existingItems.find(i => i.id === item.id);

      if (existingItem) {
        const fieldsToUpdate: Partial<typeof item> = {};

        if (existingItem.unit_price !== undefined)
          fieldsToUpdate['unit_price'] = item.unit_price;
        if (existingItem.quantity === null)
          fieldsToUpdate['quantity'] = item.quantity;
        if (existingItem.supplier !== undefined)
          fieldsToUpdate['supplier'] = item.supplier;
        if (existingItem.costumer !== undefined)
          fieldsToUpdate['costumer'] = item.costumer;
        if (existingItem.stock_location_id !== undefined)
          fieldsToUpdate['stock_location_id'] = item.stock_location_id;
        if (existingItem.observation !== undefined)
          fieldsToUpdate['observation'] = item.observation;
        if (existingItem.total_price !== undefined)
          fieldsToUpdate['total_price'] =
            item.unit_price * existingItem.quantity;
        if (existingItem.updated_at !== undefined)
          fieldsToUpdate['updated_at'] = new Date();

        if (Object.keys(fieldsToUpdate).length > 0) {
          await this.stockRepository.updateStockItems(item.id, {
            ...fieldsToUpdate,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
            observation: item.observation,
            updated_at: new Date(),
            updated_by: currentUser,
            supplier: item.supplier,
            costumer: item.costumer,
            stock_location_id: item.stock_location_id
          });
          updatedItems.push({ ...existingItem, ...fieldsToUpdate });
        }
      }
    }

    return {
      success: true,
      message: 'Stock updated successfully',
      updatedItems
    };
  }

  async remove(id: number) {
    return this.stockRepository.deleteStock(id);
  }

  private formatDate(stock: stock): Omit<stock, 'created_at' | 'updated_at'> & {
    created_at: string;
    updated_at: string;
  } {
    return {
      ...stock,
      created_at: format(stock.created_at, 'dd/MM/yyyy'),
      updated_at: format(stock.updated_at, 'dd/MM/yyyy')
    };
  }
}
