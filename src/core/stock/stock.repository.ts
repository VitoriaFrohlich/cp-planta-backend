import { Injectable } from '@nestjs/common';
import { Prisma, stock, stock_items, Stock_Moviment } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { ProductBatch } from './dto/response.stock.dto';
@Injectable()
export class StockRepository {
  constructor(private prisma: PrismaService) {}

  async createStock(data: Prisma.stockCreateInput) {
    return await this.prisma.stock.create({ data });
  }

  async createStockItems(
    data: Partial<Prisma.stock_itemsUncheckedCreateInput>
  ) {
    return await this.prisma.stock_items.create({
      data: {
        sequence: data.sequence,
        quantity: data.quantity,
        unit_price: data.unit_price,
        total_price: data.total_price,
        batch: data.batch,
        batch_expiration: data.batch_expiration,
        products: { connect: { id: data.product_id } },
        stock: { connect: { id: data.stock_id } },
        stock_location: data.stock_location_id
          ? { connect: { id: data.stock_location_id } }
          : undefined,
        ...((data.supplier && {
          suppliers: { connect: { id: data.supplier } }
        }) ||
          {}),
        ...((data.costumer && {
          costumers: { connect: { id: data.costumer } }
        }) ||
          {})
      }
    });
  }

  async updateStock(id: number, data: Prisma.stockUpdateInput): Promise<stock> {
    const stock = await this.prisma.stock.update({
      where: { id },
      data
    });

    return stock;
  }

  async updateStockItems(
    id: number,
    data: Partial<Prisma.stock_itemsUncheckedCreateInput>
  ) {
    const stock_items = await this.prisma.stock_items.update({
      where: { id },
      data: {
        sequence: data.sequence,
        quantity: data.quantity,
        unit_price: data.unit_price,
        total_price: data.total_price,
        batch: data.batch,
        batch_expiration: data.batch_expiration,
        ...(data.stock_location_id
          ? { stock_location: { connect: { id: data.stock_location_id } } }
          : {}),
        ...(data.supplier
          ? { suppliers: { connect: { id: data.supplier } } }
          : {}),
        ...(data.costumer
          ? { costumers: { connect: { id: data.costumer } } }
          : {})
      }
    });

    return stock_items;
  }

  async getLastSequence(stockId: number): Promise<number> {
    const lastItem = await this.prisma.stock_items.findFirst({
      where: { stock_id: stockId },
      orderBy: { sequence: 'desc' }
    });
    return lastItem ? lastItem.sequence : 0;
  }

  async findByDocumentNumber(document_number: string): Promise<stock | null> {
    return this.prisma.stock.findUnique({
      where: { document_number }
    });
  }

  async getStockItems(stockId: number): Promise<stock_items[]> {
    return await this.prisma.stock_items.findMany({
      where: { stock_id: stockId },
      orderBy: { sequence: 'asc' }
    });
  }

  async checkStock(product_id: number, batch: string): Promise<number> {
    const inputs = await this.prisma.stock_items.aggregate({
      where: {
        product_id: product_id,
        batch: batch,
        stock: {
          stock_moviment: Stock_Moviment.INPUT
        }
      },
      _sum: {
        quantity: true
      }
    });

    const totalInput = inputs._sum.quantity || 0;

    const outputs = await this.prisma.stock_items.aggregate({
      where: {
        product_id: product_id,
        batch: batch,
        stock: {
          stock_moviment: Stock_Moviment.OUTPUT
        }
      },
      _sum: {
        quantity: true
      }
    });

    const totalOutput = outputs._sum.quantity || 0;

    const reserved = await this.prisma.stock_items.aggregate({
      where: {
        product_id: product_id,
        batch: batch,
        stock: {
          stock_moviment: Stock_Moviment.RESERVED
        }
      },
      _sum: {
        quantity: true
      }
    });

    const totalReserved = reserved._sum.quantity || 0;

    const transit = await this.prisma.stock_items.aggregate({
      where: {
        product_id: product_id,
        batch: batch,
        stock: {
          stock_moviment: Stock_Moviment.TRANSIT
        }
      },
      _sum: {
        quantity: true
      }
    });

    const totalTransit = transit._sum.quantity || 0;
    // total
    const totalUndisponible = totalOutput + totalReserved + totalTransit;

    const totalQuantity =
      totalInput - totalUndisponible > 0 ? totalInput - totalUndisponible : 0;

    return totalQuantity;
  }

  async findAllStockItems(orderBy: string): Promise<stock[]> {
    const validOrderFields = [
      'id',
      'product_id',
      'batch',
      'quantity',
      'stock_id',
      'sequence',
      'created_at',
      'updated_at'
    ];

    if (!validOrderFields.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const result = await this.prisma.stock.findMany({
      orderBy: { [orderBy]: 'asc' },
      include: {
        stock_items: {
          select: {
            id: true,
            product_id: true,
            batch: true,
            quantity: true,
            stock_id: true,
            sequence: true,
            created_at: true,
            updated_at: true
          },
          orderBy: { sequence: 'asc' }
        }
      }
    });
    return result;
  }

  async findItemsByStockId(stock_id: number): Promise<stock_items[]> {
    return await this.prisma.stock_items.findMany({
      where: { stock_id },
      orderBy: { sequence: 'asc' }
    });
  }

  async update(data: Prisma.stockCreateInput): Promise<stock> {
    const stock = await this.prisma.stock.create({
      data
    });

    const stockResponse = {
      ...stock
    };
    return stockResponse;
  }

  async findAll(orderBy: string): Promise<stock[]> {
    const validOrderFields = [
      'id',
      'document_number',
      'document_date',
      'stock_moviment',
      'created_at',
      'updated_at'
    ];

    if (!validOrderFields.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const result = await this.prisma.stock.findMany({
      where: {},
      orderBy: { [orderBy]: 'asc' }
    });

    return result;
  }

  async findById(id: number): Promise<stock | null> {
    const stock = this.prisma.stock.findUnique({
      where: { id },
      include: {
        stock_items: {
          select: {
            id: true,
            sequence: true,
            products: {
              select: {
                id: true,
                description: true,
                code: true,
                sku: true
              }
            },
            batch: true,
            batch_expiration: true,
            quantity: true,
            unit_price: true,
            total_price: true,
            suppliers: {
              select: {
                id: true,
                name: true
              }
            },
            stock_location: {
              select: {
                id: true,
                description: true
              }
            },
            created_at: true,
            updated_at: true
          },
          orderBy: { sequence: 'asc' }
        }
      }
    });

    if (!stock) {
      throw new Error('Stock not found');
    }

    return stock;
  }

  async findManyByIds(ids: number[]): Promise<stock[]> {
    return this.prisma.stock.findMany({
      where: {
        id: { in: ids }
      }
    });
  }

  async findAllWithBatchs(orderBy: string): Promise<stock_items[]> {
    const validOrderFields = ['product_id'];

    if (!validOrderFields.includes(orderBy)) {
      throw new Error('Invalid order field');
    }

    const result = await this.prisma.stock_items.findMany({
      include: {
        stock: true
      },
      orderBy: { [orderBy]: 'asc' }
    });

    return result;
  }

  async deleteStock(id: number): Promise<void> {
    await this.prisma.stock_items.deleteMany({
      where: {
        stock_id: id
      }
    });

    await this.prisma.stock.delete({
      where: {
        id
      }
    });
  }

  async teste(orderBy: 'asc' | 'desc'): Promise<ProductBatch[]> {
    const batchs = await this.prisma.stock_items.findMany({
      select: {
        product_id: true,
        batch: true,
        batch_expiration: true,
        quantity: true
      },
      orderBy: {
        product_id: orderBy
      }
    });

    const productBatchSummary: Record<number, ProductBatch> = {};

    for (const myBatch of batchs) {
      const productId = myBatch.product_id;
      const batch = myBatch.batch || 'sem batch';
      const batch_expiration =
        myBatch.batch_expiration || new Date('1900-01-01');

      if (!productBatchSummary[productId]) {
        const description = await this.prisma.products.findUnique({
          where: { id: productId },
          select: { description: true }
        });

        productBatchSummary[productId] = {
          productId,
          description: description?.description || '',
          batchs: []
        };
      }

      productBatchSummary[productId].batchs.push({
        batch: batch,
        totalQuantity: 0,
        batch_expiration: batch_expiration
      });
    }

    return Object.values(productBatchSummary);
  }

  async getAllProductBatchs(
    orderBy: 'asc' | 'desc' = 'asc',
    origin?: 'RAW_MATERIAL' | 'MADE'
  ): Promise<ProductBatch[]> {
    const productFilter = origin ? { origin } : {};

    const batchs = await this.prisma.stock_items.findMany({
      distinct: ['product_id', 'batch'],
      where: {
        products: productFilter
      },
      select: {
        product_id: true,
        batch: true,
        batch_expiration: true,
        quantity: true
      },
      orderBy: { product_id: orderBy }
    });

    const productBatchSummary: Record<number, ProductBatch> = {};

    for (const myBatch of batchs) {
      const productId = myBatch.product_id;
      const batch = myBatch.batch;

      if (typeof productId !== 'number') {
        console.error(`Product ID ${productId} tem um formato inválido!`);
      }
      if (!productBatchSummary[productId]) {
        const description = await this.prisma.products.findUnique({
          where: { id: productId },
          select: { description: true }
        });

        productBatchSummary[productId] = {
          productId,
          description: description?.description || '',
          batchs: []
        };
      }
      const availableStock = await this.checkStock(productId, batch);

      productBatchSummary[productId].batchs.push({
        batch: batch,
        totalQuantity: availableStock,
        batch_expiration: myBatch.batch_expiration
      });
    }

    return Object.values(productBatchSummary);
  }
}
