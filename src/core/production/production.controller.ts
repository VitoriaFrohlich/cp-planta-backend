import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException
  //NotFoundException
  //  BadRequestException
} from '@nestjs/common';
import { ProductionService } from './production.service';
import { CreateProductionDto } from './dto/create-production.dto';
import { UpdateProductionDto } from './dto/update-production.dto';
//import { UpdateProductionSchema } from './dto/production.schema.dto';
//import { ResponseProductionDto } from './dto/response.production.dto';
import { ApiQuery } from '@nestjs/swagger';
//import { ResponseProductionDto } from './dto/response.production.dto';
//import { ZodError } from 'zod';

@Controller('orders')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Post()
  create(@Body() createProductionDto: CreateProductionDto) {
    return this.productionService.create(createProductionDto);
  }

  @Get()
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description:
      'Field to order by. Valid fields: id, description, production_date, Production_Status, created_by, updated_by',
    enum: [
      'id',
      'number',
      'description',
      'production_date',
      'production_line',
      'Production_Status',
      'created_by',
      'updated_by'
    ]
  })
  async findAll(@Query('orderBy') orderBy: string = 'id') {
    const validOrderFields = [
      'id',
      'number',
      'description',
      'production_date',
      'production_line',
      'Production_Status',
      'created_by',
      'updated_by'
    ];
    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }
    return this.productionService.findAll(orderBy);

    // return production.map(prod => ({
    //   id: prod.id,
    //   number: prod.number,
    //   description: prod.description,
    //   production_date: prod.production_date,
    //   Production_Status: prod.Production_Status,
    //   created_at: prod.created_at,
    //   updated_at: prod.updated_at,
    //   created_by: prod.created_by,
    //   updated_by: prod.updated_by,
    //   production_items: prod.production_item.map(item => ({
    //     id: item.id,
    //     production_order_id: item.production_order_id,
    //     sequence: item.sequence,
    //     final_product_id: item.final_product_id,
    //     production_quantity_estimated: item.production_quantity_estimated,
    //     production_quantity_real: item.production_quantity_real,
    //     production_quantity_loss: item.production_quantity_loss,
    //     lote: item.lote,
    //     lote_expiration: item.lote_expiration,
    //     created_at: item.created_at,
    //     updated_at: item.updated_at,
    //     created_by: item.created_by,
    //     updated_by: item.updated_by
    //   }))
    // }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('ID is a number');
    }
    return this.productionService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductionDto: UpdateProductionDto
    // @Query() queryParams: Record<string, string>
  ) {
    // const idNumber = +id;
    // if (isNaN(idNumber)) {
    //   throw new BadRequestException('Invalid ID format');
    // }
    // // Verificar se a ordem de produção existe
    // const existingProduction = await this.productionService.findOne(idNumber);
    // if (!existingProduction) {
    //   throw new NotFoundException(
    //     `Production order with ID ${idNumber} not found`
    //   );
    // }
    // const allowedFields = Object.keys(UpdateProductionSchema.shape);
    // const fieldsToUpdate = Object.keys(queryParams);

    // if (fieldsToUpdate.length === 0) {
    //   throw new BadRequestException('No fields provided to update');
    // }
    // const updateData: Partial<UpdateProductionDto> = {};

    // for (const field of fieldsToUpdate) {
    //   if (!allowedFields.includes(field)) {
    //     throw new BadRequestException(`Invalid field: ${field}`);
    //   }

    //   const value = queryParams[field];

    //   if (['created_by', 'updated_by', 'Production_Status'].includes(field)) {
    //     const numericValue = parseInt(value, 10);
    //     if (isNaN(numericValue)) {
    //       throw new BadRequestException(`Invalid number format for field: ${field}`);
    //     }
    //     updateData[field] = numericValue;
    //   } else {
    //     if (value !== undefined) {
    //       updateData[field] = value;
    //     }
    //   }
    // }

    // // Validar os dados utilizando o schema definido para a ordem de produção
    // const validation = UpdateProductionSchema.safeParse(updateData);

    // if (!validation.success) {
    //   const zodError = validation.error as ZodError;
    //   const firstError = zodError.errors[0];
    //   throw new BadRequestException(
    //     `${firstError.path[0]} is invalid: ${firstError.message}`
    //   );
    // }

    // // Atualizar a ordem de produção
    // const updatedProduction = await this.productionService.update(
    //   idNumber,
    //   updateData as UpdateProductionDto
    // );

    return this.productionService.update(+id, updateProductionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    await this.productionService.remove(idNumber);
    return { message: `Production order with ID ${idNumber} removed` };
  }
}
