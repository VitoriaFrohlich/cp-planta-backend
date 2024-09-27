import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { products } from '@prisma/client';
import { format } from 'date-fns';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.matchProductByData(
      createProductDto.code,
      createProductDto.description,
      createProductDto.sku
    );

    if (existingProduct.length > 0) {
      throw new Error(
        `Product already exists: ${JSON.stringify(existingProduct[0])}`
      );
    }

    const createdProduct =
      await this.productsRepository.create(createProductDto);

    return this.formatProductDate(createdProduct);
  }

  async findAll(orderBy: string): Promise<
    (Omit<products, 'created_at' | 'updated_at'> & {
      created_at: string;
      updated_at: string;
    })[]
  > {
    const findedProducts = await this.productsRepository.findAll(orderBy);
    return findedProducts.map(product => this.formatProductDate(product));
  }

  async findById(id: number) {
    const product = await this.isValid(id);
    return this.formatProductDate(product);
  }

  private formatProductDate(product: products): Omit<
    products,
    'created_at' | 'updated_at'
  > & {
    created_at: string;
    updated_at: string;
  } {
    return {
      ...product,
      created_at: format(new Date(product.created_at), 'dd/MM/yyyy HH:mm:ss'),
      updated_at: format(new Date(product.updated_at), 'dd/MM/yyyy HH:mm:ss')
    };
  }

  async isValid(id: number) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    } else if (!product.active) {
      throw new BadRequestException(`Product with ID ${id} is not active`);
    }
    return product;
  }

  async reactivateProduct(id: number) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.active) {
      throw new BadRequestException(`Product with ID ${id} is already active`);
    }

    const reactivatedProduct = await this.productsRepository.update(id, {
      active: true,
      updated_at: new Date()
    });

    return this.formatProductDate(reactivatedProduct);
  }

  async matchProductByData(code: string, description: string, sku: string) {
    const matchedProduct = await this.productsRepository.matchProductByData(
      code,
      description,
      sku
    );

    return matchedProduct.map(product => this.formatProductDate(product));
  }
  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.isValid(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    const updatedProductDto = {
      ...updateProductDto,
      updated_at: new Date(),
      active: product.active
    };

    const updatedPorduct = await this.productsRepository.update(
      id,
      updatedProductDto
    );

    return this.formatProductDate(updatedPorduct);
  }

  remove(id: number) {
    return this.productsRepository.delete(id);
  }

  async bulkRemove(ids: number[]) {
    const existingProducts = await this.productsRepository.findManyByIds(ids);

    const errors = [];
    const validIds = [];

    for (const id of ids) {
      const product = existingProducts.find(p => p.id === id);

      if (!product) {
        errors.push(`Product with ID ${id} not found`);
        continue;
      }

      if (!product.active) {
        errors.push(`Product with ID ${id} is not active`);
        continue;
      }

      validIds.push(id);
    }

    if (validIds.length > 0) {
      await this.productsRepository.bulkUpdateStatus(validIds, {
        active: false
      });
    }

    return { removedIds: validIds, errors };
  }
}
