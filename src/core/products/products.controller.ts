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

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
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
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(@Query('orderBy') orderBy: string = 'id') {
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

    return this.productsService.findAll(orderBy);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    try {
      return this.productsService.findById(+id);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Query() queryParams: Record<string, string>
  ) {
    const existingProduct = await this.productsService.findById(+id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (!existingProduct.active) {
      throw new BadRequestException(`Product ID ${id} is not active`);
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
      +id,
      updateData as UpdateProductDto
    );

    return updatedProduct;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const existingProduct = this.productsService.findById(+id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    try {
      this.productsService.remove(+id);

      return { message: `Product ID ${id} deleted successfully` };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  @Post('activate/:id')
  async activate(@Param('id') id: string) {
    await this.productsService.reactivateProduct(+id);

    return { message: `Product ID ${id} activated successfully` };
  }
}
