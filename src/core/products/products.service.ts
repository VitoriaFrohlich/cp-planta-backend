import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateProductDto } from './dto/create.products.dto';
import { UpdateProductDto } from './dto/update.products.dto';
import { ProductsRepository } from './products.repository';
import { products } from '@prisma/client';
import { format } from 'date-fns';
import { SessionService } from '../common/sessionService';

@Injectable()
export class ProductsService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly productsRepository: ProductsRepository
  ) {}

  async create(createProductDto: CreateProductDto) {
    const currentUser = this.sessionService.getCurrentUser();

    const existingProduct = await this.matchProductByData(
      createProductDto.code,
      createProductDto.description
    );

    if (existingProduct.length > 0) {
      throw new Error(
        `Product already exists: ${JSON.stringify(existingProduct[0])}`
      );
    }

    const createProduct = {
      ...createProductDto,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: currentUser,
      updated_by: currentUser
    };

    const createdProduct = await this.productsRepository.create(createProduct);

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

  async findByOrigin(
    orderBy: string,
    origin: string
  ): Promise<
    (Omit<products, 'created_at' | 'updated_at'> & {
      created_at: string;
      updated_at: string;
    })[]
  > {
    const findedProducts = await this.productsRepository.findByOrigin(
      orderBy,
      origin
    );
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
    const currentUser = this.sessionService.getCurrentUser();
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.active) {
      throw new BadRequestException(`Product with ID ${id} is already active`);
    }

    const reactivatedProduct = await this.productsRepository.update(id, {
      active: true,
      updated_at: new Date(),
      updated_by: currentUser
    });

    return this.formatProductDate(reactivatedProduct);
  }

  async matchProductByData(code: string, description: string) {
    const matchedProduct = await this.productsRepository.matchProductByData(
      code,
      description
    );

    return matchedProduct.map(product => this.formatProductDate(product));
  }
  async update(id: number, updateProductDto: UpdateProductDto) {
    const currentUser = this.sessionService.getCurrentUser();
    const product = await this.isValid(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    const updatedProductDto = {
      ...updateProductDto,
      updated_at: new Date(),
      active: product.active,
      updated_by: currentUser
    };

    const updatedPorduct = await this.productsRepository.update(
      id,
      updatedProductDto
    );

    return this.formatProductDate(updatedPorduct);
  }

  async remove(id: number) {
    const currentUser = this.sessionService.getCurrentUser();
    await this.isValid(id);
    await this.productsRepository.delete(id, currentUser);
  }
}
