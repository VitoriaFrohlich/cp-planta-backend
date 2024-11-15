import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create.products.dto';
import { UpdateProductDto } from './dto/update.products.dto';
import {
  ResponseProductsDto,
  ShortResponseProductsDto
} from './dto/response.products.dto';
import { Origin, Unit_Measure } from '../common/enums';
import { ApiQuery } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('made')
  async createMade(
    @Body() createProductDto: CreateProductDto
  ): Promise<ResponseProductsDto> {
    return this.create(createProductDto, Origin.MADE);
  }

  @Post('raw')
  async createRaw(
    @Body() createProductDto: CreateProductDto
  ): Promise<ResponseProductsDto> {
    return this.create(createProductDto, Origin.RAW_MATERIAL);
  }

  async create(
    createProductDto: CreateProductDto,
    origin: Origin
  ): Promise<ResponseProductsDto> {
    createProductDto.origin = origin;

    const matchedProducts = await this.productsService.matchProductByData(
      createProductDto.code,
      createProductDto.description
    );

    if ((await matchedProducts).length > 0) {
      const existingProduct = matchedProducts[0];

      if (!existingProduct.active) {
        throw new BadRequestException(
          `Product already exists but is not active. Activate and update it: ${JSON.stringify(
            existingProduct
          )}`
        );
      }

      throw new BadRequestException(
        'Product already exists. Try update it instead'
      );
    }

    const createdProduct = await this.productsService.create(createProductDto);
    return {
      id: createdProduct.id,
      description: createdProduct.description,
      code: createdProduct.code,
      origin: createdProduct.origin as Origin,
      unit_measure: createdProduct.unit_measure as Unit_Measure,
      category_id: createdProduct.category_id,
      group_id: createdProduct.group_id,
      supplier_id: createdProduct.supplier_id,
      nutritional_info:
        typeof createdProduct.nutritional_info === 'string'
          ? JSON.parse(createdProduct.nutritional_info)
          : createdProduct.nutritional_info,
      created_at: createdProduct.created_at,
      updated_at: createdProduct.updated_at
    };
  }

  @Get()
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description:
      'Field to order by. Valid fields: id, description, code, origin, category_id, group_id, supplier_id',
    enum: [
      'id',
      'description',
      'code',
      'origin',
      'category_id',
      'supplier_id',
      'group_id'
    ]
  })
  async findAll(
    @Query('orderBy') orderBy: string = 'id'
  ): Promise<ResponseProductsDto[]> {
    const validOrderFields = [
      'id',
      'description',
      'code',
      'origin',
      'category_id',
      'group_id',
      'supplier_id'
    ];

    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }

    const products = await this.productsService.findAll(orderBy);
    return products.map(product => ({
      id: product.id,
      description: product.description,
      code: product.code,
      origin: product.origin as Origin,
      unit_measure: product.unit_measure as Unit_Measure,
      category_id: product.category_id,
      group_id: product.group_id,
      supplier_id: product.supplier_id,
      nutritional_info:
        typeof product.nutritional_info === 'string'
          ? JSON.parse(product.nutritional_info)
          : product.nutritional_info,
      created_at: product.created_at,
      updated_at: product.updated_at
    }));
  }

  @Get('made')
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description:
      'Field to order by. Valid fields: id, description, code, category_id, group_id, supplier_id',
    enum: [
      'id',
      'description',
      'code',
      'category_id',
      'group_id',
      'supplier_id'
    ]
  })
  async findMade(
    @Query('orderBy') orderBy: string = 'id'
  ): Promise<ResponseProductsDto[]> {
    const validOrderFields = [
      'id',
      'description',
      'code',
      'category_id',
      'group_id',
      'supplier_id'
    ];

    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }
    const origin = Origin.MADE;
    const products = await this.productsService.findByOrigin(orderBy, origin);
    return products.map(product => ({
      id: product.id,
      description: product.description,
      code: product.code,
      origin: product.origin as Origin,
      unit_measure: product.unit_measure as Unit_Measure,
      category_id: product.category_id,
      group_id: product.group_id,
      supplier_id: product.supplier_id,
      nutritional_info:
        typeof product.nutritional_info === 'string'
          ? JSON.parse(product.nutritional_info)
          : product.nutritional_info,
      active: product.active,
      created_at: product.created_at,
      updated_at: product.updated_at
    }));
  }

  @Get('made-short')
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description: 'Field to order by. Valid fields: id, description',
    enum: ['id', 'description']
  })
  async findMadeShort(
    @Query('orderBy') orderBy: string = 'id'
  ): Promise<ShortResponseProductsDto[]> {
    const validOrderFields = ['id', 'description'];

    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }
    const origin = Origin.MADE;
    const products = await this.productsService.findByOrigin(orderBy, origin);
    return products.map(product => ({
      id: product.id,
      description: product.description
    }));
  }

  @Get('raw-material')
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description:
      'Field to order by. Valid fields: id, description, code, category_id, group_id, supplier_id',
    enum: [
      'id',
      'description',
      'code',
      'category_id',
      'group_id',
      'supplier_id'
    ]
  })
  async findRaw(
    @Query('orderBy') orderBy: string = 'id'
  ): Promise<ResponseProductsDto[]> {
    const validOrderFields = [
      'id',
      'description',
      'code',
      'category_id',
      'group_id',
      'supplier_id'
    ];

    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }
    const origin = Origin.RAW_MATERIAL;
    const products = await this.productsService.findByOrigin(orderBy, origin);
    return products.map(product => ({
      id: product.id,
      description: product.description,
      code: product.code,
      origin: product.origin as Origin,
      unit_measure: product.unit_measure as Unit_Measure,
      category_id: product.category_id,
      group_id: product.group_id,
      supplier_id: product.supplier_id,
      nutritional_info:
        typeof product.nutritional_info === 'string'
          ? JSON.parse(product.nutritional_info)
          : product.nutritional_info,
      created_at: product.created_at,
      updated_at: product.updated_at
    }));
  }

  @Get('raw-material-short')
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description: 'Field to order by. Valid fields: id, description',
    enum: ['id', 'description']
  })
  async findRawShort(
    @Query('orderBy') orderBy: string = 'id'
  ): Promise<ShortResponseProductsDto[]> {
    const validOrderFields = ['id', 'description'];

    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }
    const origin = Origin.RAW_MATERIAL;
    const products = await this.productsService.findByOrigin(orderBy, origin);
    return products.map(product => ({
      id: product.id,
      description: product.description
    }));
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<ResponseProductsDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const product = this.productsService.findById(idNumber);

    return product.then(product => ({
      id: product.id,
      description: product.description,
      code: product.code,
      origin: product.origin as Origin,
      unit_measure: product.unit_measure as Unit_Measure,
      category_id: product.category_id,
      group_id: product.group_id,
      supplier_id: product.supplier_id,
      nutritional_info:
        typeof product.nutritional_info === 'string'
          ? JSON.parse(product.nutritional_info)
          : product.nutritional_info,
      created_at: product.created_at,
      updated_at: product.updated_at
    }));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<ResponseProductsDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const existingProduct = await this.productsService.findById(idNumber);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${idNumber} not found`);
    }

    if (!existingProduct.active) {
      throw new BadRequestException(`Product ID ${idNumber} is not active`);
    }

    const updatedProduct = await this.productsService.update(
      idNumber,
      updateProductDto
    );

    return {
      id: updatedProduct.id,
      description: updatedProduct.description,
      code: updatedProduct.code,
      origin: updatedProduct.origin as Origin,
      unit_measure: updatedProduct.unit_measure as Unit_Measure,
      category_id: updatedProduct.category_id,
      group_id: updatedProduct.group_id,
      supplier_id: updatedProduct.supplier_id,
      nutritional_info:
        typeof updatedProduct.nutritional_info === 'string'
          ? JSON.parse(updatedProduct.nutritional_info)
          : updatedProduct.nutritional_info,
      created_at: updatedProduct.created_at,
      updated_at: updatedProduct.updated_at
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const idNumber = +id;

    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    await this.productsService.remove(idNumber);
    return { message: `Product ID ${idNumber} deleted successfully` };
  }

  @Post('activate/:id')
  async activate(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    await this.productsService.reactivateProduct(idNumber);

    return { message: `Product ID ${id} activated successfully` };
  }
}
