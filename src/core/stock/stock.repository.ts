import { Injectable } from '@nestjs/common';
import { Prisma, stock, stock_items, Stock_Moviment } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { ProductLot } from './dto/response.stock.dto';
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
        lote: data.lote,
        expiration: data.expiration,
        image_link: data.image_link,
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
        lote: data.lote,
        expiration: data.expiration,
        image_link: data.image_link,
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

  async checkStock(product_id: number, lote: string): Promise<number> {
    const inputs = await this.prisma.stock_items.aggregate({
      where: {
        product_id: product_id,
        lote: lote,
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
        lote: lote,
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
        lote: lote,
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
        lote: lote,
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
      'lote',
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
            lote: true,
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
            lote: true,
            expiration: true,
            quantity: true,
            unit_price: true,
            total_price: true,
            image_link: true,
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

  async findAllWithLots(orderBy: string): Promise<stock_items[]> {
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

  async teste(orderBy: 'asc' | 'desc'): Promise<ProductLot[]> {
    const lots = await this.prisma.stock_items.findMany({
      select: {
        product_id: true,
        lote: true,
        expiration: true,
        quantity: true
      },
      orderBy: {
        product_id: orderBy
      }
    });

    const productLotSummary: Record<number, ProductLot> = {};

    for (const lot of lots) {
      const productId = lot.product_id;
      const lote = lot.lote || 'sem lote';
      const expiration = lot.expiration || new Date('1900-01-01');

      if (!productLotSummary[productId]) {
        const description = await this.prisma.products.findUnique({
          where: { id: productId },
          select: { description: true }
        });

        productLotSummary[productId] = {
          productId,
          description: description?.description || '',
          lots: []
        };
      }

      productLotSummary[productId].lots.push({
        lote: lote,
        totalQuantity: 0,
        expiration: expiration
      });
    }

    return Object.values(productLotSummary);
  }

  async getAllProductLots(
    orderBy: 'asc' | 'desc' = 'asc',
    origin?: 'RAW_MATERIAL' | 'MADE'
  ): Promise<ProductLot[]> {
    const productFilter = origin ? { origin } : {};

    const lots = await this.prisma.stock_items.findMany({
      distinct: ['product_id', 'lote'],
      where: {
        products: productFilter
      },
      select: {
        product_id: true,
        lote: true,
        expiration: true,
        quantity: true
      },
      orderBy: { product_id: orderBy }
    });

    const productLotSummary: Record<number, ProductLot> = {};

    for (const lot of lots) {
      const productId = lot.product_id;
      const lote = lot.lote;

      if (typeof productId !== 'number') {
        console.error(`Product ID ${productId} tem um formato inválido!`);
      }
      if (!productLotSummary[productId]) {
        const description = await this.prisma.products.findUnique({
          where: { id: productId },
          select: { description: true }
        });

        productLotSummary[productId] = {
          productId,
          description: description?.description || '',
          lots: []
        };
      }
      const availableStock = await this.checkStock(productId, lote);

      productLotSummary[productId].lots.push({
        lote: lote,
        totalQuantity: availableStock,
        expiration: lot.expiration
      });
    }

    return Object.values(productLotSummary);
  }
}
