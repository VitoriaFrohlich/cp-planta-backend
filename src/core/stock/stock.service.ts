import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { CreateStockDto, CreateStockItemsDto } from './dto/create.stock.dto';
import { UpdateStockDto } from './dto/update.stock.dto';
import { StockRepository } from './stock.repository';
import { SettingsService } from 'src/settings/settings.service';
import { BatchService } from '../common/batch.utils';
import { format } from 'date-fns';
import { stock } from '@prisma/client';
import { Origin, Stock_Moviment } from '../common/enums';
import { SessionService } from '../common/sessionService';
import { formatDate } from '../common/utils';
import {
  ResponseBatchsByProductDto,
  ResponseBatchsByRawDto,
  ResponseStockDto,
  ResponseRawBatchsByIdDto,
  ResponseProductsWithBatches,
  ResponseProductsWithLocationsDto
} from './dto/response.stock.dto';
import { ResponseCategoriesBatchsDto } from './dto/response.stock.dto';

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

  async create(createStockDto: CreateStockDto): Promise<ResponseStockDto> {
    const stock_items: CreateStockItemsDto[] = createStockDto.stock_items;
    const errorMessages = [];

    // TODO
    // if (createStockDto.supplierName) {
    //   let supplier = await this.personsService.matchPersonByData(
    //     createStockDto.supplierName
    //   );

    //   if (supplier.length === 0) {
    //     const createPersonsDto = {
    //       name: createStockDto.supplierName,
    //       person_type: 'SUPPLIER'
    //     };
    //     supplier = [await this.personsService.create(createPersonsDto)];
    //   }

    //   const supplierId = supplier[0].id;
    //   stock_items.forEach(item => {
    //     item.supplier = supplierId;
    //   });
    // }

    const currentUser = this.sessionService.getCurrentUser();
    let documentNumber = '';
    let isInput = false;

    const uniqueSkuMap = new Map<string, number>();

    for (const item of stock_items) {
      if (
        uniqueSkuMap.has(item.sku) &&
        uniqueSkuMap.get(item.sku) !== item.product_id
      ) {
        errorMessages.push(
          `Duplicate SKU ${item.sku} in request for product ID: ${item.product_id}`
        );
        continue;
      }

      uniqueSkuMap.set(item.sku, item.product_id);
    }

    for (const [sku, productId] of uniqueSkuMap.entries()) {
      const itemsBySku = await this.stockRepository.findBySku(sku);
      if (itemsBySku.length > 0) {
        const existingIds = itemsBySku.map(item => item.id).join(', ');
        errorMessages.push(
          `SKU ${sku} of request ID: ${productId} already exists in stock with item IDs: ${existingIds}`
        );
      }
    }

    if (errorMessages.length > 0) {
      throw new BadRequestException({
        success: false,
        errors: errorMessages,
        message: errorMessages.join(', ')
      });
    }

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
      throw new BadRequestException({
        success: false,
        errors: errorMessages,
        message:
          'Não foi possível processar todos os itens devido a saldos insuficientes.'
      });
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
          sku: item.sku,
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
          id: item.id,
          sequence: item.sequence,
          product_id: item.product_id,
          unit_measure: item.products?.unit_measure,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          batch: item.batch,
          batch_expiration: formatDate(item.batch_expiration),
          sku: item.sku,
          created_at: formatDate(item.created_at)
        }))
      );

      return {
        id: stockDocument.id,
        document_number: stockDocument.document_number,
        document_date: formatDate(stockDocument.document_date),
        stock_moviment: stockDocument.stock_moviment,
        created_at: formatDate(stockDocument.created_at),
        stock_items: createdItems
      };
    } catch (error) {
      if (stockDocument?.id) {
        try {
          await this.stockRepository.deleteStock(stockDocument.id);
        } catch (deleteError) {
          throw new InternalServerErrorException(
            `Error removing stock document: ${(deleteError as Error).message}`
          );
        }
      }
      throw new InternalServerErrorException(
        `Error during item insertion: ${(error as Error).message}`
      );
    }
  }

  async getLote(stockMoviment: Stock_Moviment): Promise<[string, string]> {
    const batchGenerated = await this.batchService.generateBatch(
      stockMoviment === Stock_Moviment.INPUT ? 'INPUT' : 'OUTPUT'
    );
    const [batch, batch_expiration] = batchGenerated.split('-');
    return [batch, formatDate(new Date(batch_expiration))];
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

  async findAll(orderBy: string): Promise<ResponseStockDto[]> {
    const stock = await this.stockRepository.findAllStockItems(orderBy);

    return stock.map(stock => ({
      id: stock.id,
      document_date: formatDate(stock.document_date),
      document_number: stock.document_number,
      stock_moviment: stock.stock_moviment as Stock_Moviment,
      created_at: formatDate(stock.created_at),
      updated_at: formatDate(stock.updated_at),
      stock_items: (stock['stock_items'] || []).map(item => ({
        id: item.id,
        sequence: item.sequence,
        product_id: item.product_id,
        description: item.products?.description,
        unit_measure: item.products?.unit_measure,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        batch: item.batch,
        batch_expiration: formatDate(item.batch_expiration),
        sku: item.sku,
        observation: item.observation,
        supplier: item.supplier,
        costumer: item.costumer,
        stock_location_id: item.stock_location_id,
        stock_location: item.stock_locations?.description,
        created_at: formatDate(item.created_at),
        updated_at: formatDate(item.updated_at)
      }))
    }));
  }

  async findOne(id: number): Promise<ResponseStockDto> {
    const stock = await this.stockRepository.findById(id);

    if (!stock) {
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }
    return {
      id: stock.id,
      document_date: formatDate(stock.document_date),
      document_number: stock.document_number,
      stock_moviment: stock.stock_moviment as Stock_Moviment,
      created_at: formatDate(stock.created_at),
      updated_at: formatDate(stock.updated_at),
      stock_items: (stock['stock_items'] || []).map(item => ({
        id: item.id,
        sequence: item.sequence,
        product_id: item.product_id,
        description: item.products?.description,
        unit_measure: item.products?.unit_measure,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        batch: item.batch,
        batch_expiration: formatDate(item.batch_expiration),
        sku: item.sku,
        observation: item.observation,
        supplier: item.supplier,
        costumer: item.costumer,
        stock_location_id: item.stock_location_id,
        stock_location: item.stock_locations?.description,
        created_at: formatDate(item.created_at),
        updated_at: formatDate(item.updated_at)
      }))
    };
  }

  async getAllProductLots(orderBy, origin) {
    return this.stockRepository.getAllProductBatchs(orderBy, origin);
  }

  async getAllProductLotsByCategory(orderBy, origin) {
    return this.stockRepository.getAllProductBatchsByCategory(orderBy, origin);
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

  async getShortList(origin: Origin): Promise<ResponseProductsWithBatches[]> {
    const products = await this.stockRepository.getProducts(origin);

    const response: ResponseProductsWithBatches[] = [];

    for (const product of products) {
      const batchQuantity =
        await this.stockRepository.countDistinctBatchesWithStock(product.id);

      response.push({
        id: product.id,
        description: product.description,
        category: product.category,
        batch_quantity: batchQuantity
      });
    }

    return response;
  }
  async getBatchesByProductId(
    productId: number
  ): Promise<ResponseBatchsByProductDto[]> {
    const batches =
      await this.stockRepository.findBatchesByProductId(productId);
    return batches.map(batch => ({
      id: batch.id.toString(),
      description: batch.description,
      current_quantity: batch.current_quantity
    }));
  }
  async getRawBatchesByProductId(
    productId: number
  ): Promise<ResponseRawBatchsByIdDto[]> {
    const batches =
      await this.stockRepository.findRawBatchesByProductId(productId);
    return batches.map(batch => ({
      id: batch.product_id.toString(),
      sku: batch.quantity,
      measure_unit: batch.measure_unit,
      quantity: batch.quantity
    }));
  }
  async getBatchesRaw(): Promise<ResponseBatchsByRawDto[]> {
    const rawMaterials = await this.stockRepository.getRawMaterialsByOrigin(
      Origin.RAW_MATERIAL
    );
    const batchResponses: ResponseBatchsByRawDto[] = [];

    for (const material of rawMaterials) {
      const batches = await this.stockRepository.findBatchesByProductId(
        material.product_id
      );
      for (const batch of batches) {
        batchResponses.push({
          raw_material_description: material.raw_material_description,
          measure_unit: material.measure_unit,
          quantity: batch.current_quantity
          //sku: material.sku
        });
      }
    }

    return batchResponses;
  }

  async getCategoriesWithBatchCount(): Promise<ResponseCategoriesBatchsDto[]> {
    const categories = await this.stockRepository.getCategoriesWithBatchCount();
    return categories.map(category => ({
      id: category.id.toString(),
      description: category.description,
      batch_quantity: category.batch_quantity
    }));
  }

  async getAllBatchsByLocations(): Promise<ResponseProductsWithLocationsDto[]> {
    const stockLocations = await this.stockRepository.getStockWithLocations();

    const locationMap = new Map<string, ResponseProductsWithLocationsDto>();

    for (const location of stockLocations) {
      const availableBatches =
        await this.stockRepository.countDistinctBatchesWithStock(location.id);

      if (locationMap.has(location.description)) {
        const existingLocation = locationMap.get(location.description);
        if (existingLocation) {
          existingLocation.batch_quantity += availableBatches;
        }
      } else {
        locationMap.set(location.description, {
          id: location.stock_location_id,
          description: location.description,
          batch_quantity: availableBatches
        });
      }
    }
    return Array.from(locationMap.values());
  }
}
