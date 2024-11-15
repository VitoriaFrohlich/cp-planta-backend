import { Injectable } from '@nestjs/common';
import { Prisma, stock, stock_items, Stock_Moviment } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { ProductBatch, ProductBatchByCategory } from './dto/response.stock.dto';
import { formatDate } from '../common/utils';
import { Origin } from '../common/enums';
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
        sku: data.sku,
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
      },
      include: {
        products: {
          select: {
            unit_measure: true
          }
        }
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
      },
      include: {
        products: {
          select: {
            unit_measure: true
          }
        }
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

  async getStockItems(
    stockId: number
  ): Promise<(stock_items & { products: { unit_measure: string } })[]> {
    return await this.prisma.stock_items.findMany({
      where: { stock_id: stockId },
      orderBy: { sequence: 'asc' },
      include: {
        products: {
          select: {
            unit_measure: true
          }
        }
      }
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
            sequence: true,
            product_id: true,
            products: {
              select: {
                description: true,
                unit_measure: true
              }
            },
            batch: true,
            batch_expiration: true,
            quantity: true,
            unit_price: true,
            total_price: true,
            suppliers: {
              select: {
                name: true
              }
            },
            stock_location: {
              select: {
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
    return result;
  }

  async findItemsByStockId(stock_id: number): Promise<stock_items[]> {
    return await this.prisma.stock_items.findMany({
      where: { stock_id },
      orderBy: { sequence: 'asc' }
    });
  }

  async findBySku(sku: string): Promise<stock_items[]> {
    return await this.prisma.stock_items.findMany({
      where: { sku },
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
                unit_measure: true
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
        batch_expiration: formatDate(batch_expiration)
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
        throw new Error(`Product ID ${productId} tem um formato inválido!`);
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
        batch_expiration: formatDate(myBatch.batch_expiration)
      });
    }

    return Object.values(productBatchSummary);
  }

  async getAllProductBatchsByCategory(
    orderBy: 'asc' | 'desc' = 'asc',
    origin?: 'RAW_MATERIAL' | 'MADE'
  ): Promise<ProductBatchByCategory[]> {
    const productFilter = origin ? { origin } : {};

    const batches = await this.prisma.stock_items.findMany({
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

    const productIds = [...new Set(batches.map(batch => batch.product_id))];

    const products = await this.prisma.products.findMany({
      where: {
        id: { in: productIds }
      },
      select: {
        id: true,
        description: true,
        category_id: true,
        categories: {
          select: {
            description: true
          }
        }
      }
    });

    const productBatchByCategory: Record<string, ProductBatchByCategory> = {};

    for (const batch of batches) {
      const productId = batch.product_id;
      const category =
        products.find(product => product.id === productId)?.categories
          ?.description || '';
      const description =
        products.find(product => product.id === productId)?.description || '';

      if (!productBatchByCategory[category]) {
        productBatchByCategory[category] = {
          category_name: category,
          product_id: productId,
          description,
          batchs: []
        };
      }

      const availableStock = await this.checkStock(productId, batch.batch);

      productBatchByCategory[category].batchs.push({
        batch: batch.batch,
        batch_expiration: formatDate(batch.batch_expiration),
        totalQuantity: availableStock
      });
    }

    return Object.values(productBatchByCategory);
  }

  async countDistinctBatchesWithStock(product_id: number): Promise<number> {
    const batches = await this.prisma.stock_items.findMany({
      where: {
        product_id
      },
      select: {
        batch: true
      },
      distinct: ['batch']
    });

    let count = 0;

    for (const batch of batches) {
      const stockBalance = await this.checkStock(product_id, batch.batch);

      if (stockBalance > 0) {
        count++;
      }
    }

    return count;
  }

  async getProducts(
    origin: Origin
  ): Promise<{ id: number; description: string; category: string }[]> {
    const products = await this.prisma.products.findMany({
      where: {
        origin: origin,
        active: true
      },
      select: {
        id: true,
        description: true,
        categories: {
          select: {
            description: true
          }
        }
      }
    });

    return products.map(product => ({
      id: product.id,
      description: product.description,
      category: product.categories.description
    }));
  }
  async findBatchesByProductId(productId: number) {
    return this.prisma.stock_items
      .findMany({
        where: {
          product_id: productId,
          products: {
            origin: 'RAW_MATERIAL'
          }
        },
        select: {
          id: true,
          quantity: true,
          products: {
            select: {
              description: true
            }
          }
        }
      })
      .then(items =>
        items.map(item => ({
          id: item.id,
          description:
            item.products?.description || 'Description not available',
          current_quantity: item.quantity
        }))
      );
  }
  async getRawMaterialsByOrigin(origin: Origin) {
    return this.prisma.products
      .findMany({
        where: {
          origin
        },
        select: {
          id: true, // Supondo que o campo ID é o identificador único de cada produto
          description: true, // Descrição do produto
          unit_measure: true, // Unidade de medida
          stock_items: {
            // Join with stock_items table
            select: {
              sku: true
            }
          }
        }
      })
      .then(items =>
        items.map(item => ({
          product_id: item.id, // Ajuste para retornar o campo id como product_id
          raw_material_description: item.description,
          measure_unit: item.unit_measure,
          sku: item.stock_items[0].sku
        }))
      );
  }
  async findRawBatchesByProductId(productId: number) {
    return this.prisma.stock_items
      .findMany({
        where: {
          product_id: productId,
          products: {
            origin: 'RAW_MATERIAL'
          }
        },
        select: {
          id: true,
          quantity: true,
          sku: true,
          products: {
            select: {
              unit_measure: true
            }
          }
        }
      })
      .then(items =>
        items.map(item => ({
          product_id: item.id, // Ajuste para retornar o campo id como product_id
          measure_unit: item.products.unit_measure,
          sku: item.sku,
          quantity: item.quantity
        }))
      );
  }

  async getCategoriesWithBatchCount(): Promise<
    { id: number; description: string; batch_quantity: number }[]
  > {
    const categories = await this.prisma.categories.findMany({
      select: {
        id: true,
        description: true
      }
    });

    const result = [];

    for (const category of categories) {
      const products = await this.prisma.products.findMany({
        where: {
          category_id: category.id
        },
        select: {
          id: true
        }
      });

      let batchCount = 0;

      for (const product of products) {
        const batches = await this.prisma.stock_items.findMany({
          where: {
            product_id: product.id
          },
          select: {
            batch: true
          },
          distinct: ['batch']
        });

        for (const batch of batches) {
          const stockBalance = await this.checkStock(product.id, batch.batch);
          if (stockBalance > 0) {
            batchCount++;
          }
        }
      }

      result.push({
        id: category.id,
        description: category.description,
        batch_quantity: batchCount
      });
    }

    return result;
  }

  async getStockWithLocations(): Promise<
    { id: number; stock_location_id: number; description: string }[]
  > {
    const stock = await this.prisma.stock_items.findMany({
      where: {},
      select: {
        id: true,
        stock_location_id: true,
        stock_location: {
          select: {
            description: true
          }
        }
      }
    });

    return stock.map(item => ({
      id: item.id,
      stock_location_id: item.stock_location_id,
      description: item.stock_location.description
    }));
  }
}
