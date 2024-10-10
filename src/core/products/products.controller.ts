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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductSchema, UpdateProductSchema } from './dto/product.schema';
import { ZodError } from 'zod';
import { ResponseProductsDto } from './dto/product-response.dto';
import { Origin, Unit_Measure } from '../common/enums';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto
  ): Promise<ResponseProductsDto> {
    const errors = [];

    const descriptionValidation =
      CreateProductSchema.shape.description.safeParse(
        createProductDto.description
      );
    if (!descriptionValidation.success) {
      errors.push({
        field: 'description',
        message: descriptionValidation.error.errors[0].message
      });
    }

    const codeValidation = CreateProductSchema.shape.code.safeParse(
      createProductDto.code
    );
    if (!codeValidation.success) {
      errors.push({
        field: 'code',
        message: codeValidation.error.errors[0].message
      });
    }

    const skuValidation = CreateProductSchema.shape.sku.safeParse(
      createProductDto.sku
    );
    if (!skuValidation.success) {
      errors.push({
        field: 'sku',
        message: skuValidation.error.errors[0].message
      });
    }

    const originValidation = CreateProductSchema.shape.origin.safeParse(
      createProductDto.origin
    );
    if (!originValidation.success) {
      errors.push({
        field: 'origin',
        message: originValidation.error.errors[0].message
      });
    }

    const unitMeasureValidation =
      CreateProductSchema.shape.unit_measure.safeParse(
        createProductDto.unit_measure
      );
    if (!unitMeasureValidation.success) {
      errors.push({
        field: 'unit_measure',
        message: unitMeasureValidation.error.errors[0].message
      });
    }

    const categoryIdValidation =
      CreateProductSchema.shape.category_id.safeParse(
        createProductDto.category_id
      );
    if (!categoryIdValidation.success) {
      errors.push({
        field: 'category_id',
        message: categoryIdValidation.error.errors[0].message
      });
    }

    const groupIdValidation = CreateProductSchema.shape.group_id.safeParse(
      createProductDto.group_id
    );
    if (!groupIdValidation.success) {
      errors.push({
        field: 'group_id',
        message: groupIdValidation.error.errors[0].message
      });
    }

    const supplierIdValidation =
      CreateProductSchema.shape.supplier_id.safeParse(
        createProductDto.supplier_id
      );
    if (!supplierIdValidation.success) {
      errors.push({
        field: 'supplier_id',
        message: supplierIdValidation.error.errors[0].message
      });
    }

    const nutritionalInfoValidation =
      CreateProductSchema.shape.nutritional_info.safeParse(
        createProductDto.nutritional_info
      );
    if (!nutritionalInfoValidation.success) {
      errors.push({
        field: 'nutritional_info',
        message: nutritionalInfoValidation.error.errors[0].message
      });
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const matchedProducts = await this.productsService.matchProductByData(
      createProductDto.code,
      createProductDto.description,
      createProductDto.sku
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
      sku: createdProduct.sku,
      origin: createdProduct.origin as Origin,
      unit_measure: createdProduct.unit_measure as Unit_Measure,
      category_id: createdProduct.category_id,
      group_id: createdProduct.group_id,
      supplier_id: createdProduct.supplier_id,
      nutritional_info:
        typeof createdProduct.nutritional_info === 'string'
          ? JSON.parse(createdProduct.nutritional_info)
          : createdProduct.nutritional_info,
      active: createdProduct.active,
      created_at: createdProduct.created_at,
      updated_at: createdProduct.updated_at
    };
  }

  @Get()
  async findAll(
    @Query('orderBy') orderBy: string = 'id'
  ): Promise<ResponseProductsDto[]> {
    const validOrderFields = [
      'id',
      'description',
      'code',
      'sku',
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
      sku: product.sku,
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
      sku: product.sku,
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Query() queryParams: Record<string, string>
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

    const allowedFields = Object.keys(UpdateProductSchema.shape);
    const fieldsToUpdate = Object.keys(queryParams);

    if (fieldsToUpdate.length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const updateData: Partial<UpdateProductDto> = {};

    for (const field of fieldsToUpdate) {
      if (!allowedFields.includes(field)) {
        throw new BadRequestException(`Invalid field: ${field}`);
      }

      const value = queryParams[field];

      if (['category_id', 'group_id', 'supplier_id'].includes(field)) {
        const numericValue = parseInt(value, 10);
        if (isNaN(numericValue)) {
          throw new BadRequestException(
            `Invalid number format for field: ${field}`
          );
        }
        updateData[field] = numericValue;
      } else {
        if (value !== undefined) {
          updateData[field] = value;
        }
      }
    }

    const validation = UpdateProductSchema.safeParse(updateData);

    if (!validation.success) {
      const zodError = validation.error as ZodError;
      const firstError = zodError.errors[0];
      throw new BadRequestException(
        `${firstError.path[0]} is invalid: ${firstError.message}`
      );
    }

    const updatedProduct = await this.productsService.update(
      idNumber,
      updateData as UpdateProductDto
    );

    return {
      id: updatedProduct.id,
      description: updatedProduct.description,
      code: updatedProduct.code,
      sku: updatedProduct.sku,
      origin: updatedProduct.origin as Origin,
      unit_measure: updatedProduct.unit_measure as Unit_Measure,
      category_id: updatedProduct.category_id,
      group_id: updatedProduct.group_id,
      supplier_id: updatedProduct.supplier_id,
      nutritional_info:
        typeof updatedProduct.nutritional_info === 'string'
          ? JSON.parse(updatedProduct.nutritional_info)
          : updatedProduct.nutritional_info,
      active: updatedProduct.active,
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
