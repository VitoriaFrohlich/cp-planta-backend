import {
  Controller,
  Get,
  Post,
  Body,
  //Patch,
  Param,
  // Delete,
  Query,
  BadRequestException
} from '@nestjs/common';
import { StepsService } from './steps.service';
import { CreateStepDto } from './dto/create-step.dto';
//import { UpdateStepDto } from './dto/update-step.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('step')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post()
  create(@Body() createStepDto: CreateStepDto) {
    return this.stepsService.create(createStepDto);
  }

  @Get()
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description:
      'Field to order by. Valid fields: id, description, production_date, Production_Status, created_by, updated_by',
    enum: ['id', 'description', 'active', 'created_by', 'updated_by']
  })
  async findAll(@Query('orderBy') orderBy: string = 'id') {
    const validOrderFields = [
      'id',
      'description',
      'active',
      'created_by',
      'updated_by'
    ];
    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }
    return this.stepsService.findAll(orderBy);

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
    //     prodution_quantity_estimated: item.prodution_quantity_estimated,
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
    return this.stepsService.findOne(+id);
  }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateStepDto: UpdateStepDto
  //   // @Query() queryParams: Record<string, string>
  // ) {
  //   // const idNumber = +id;
  //   // if (isNaN(idNumber)) {
  //   //   throw new BadRequestException('Invalid ID format');
  //   // }
  //   // // Verificar se a ordem de produção existe
  //   // const existingProduction = await this.productionService.findOne(idNumber);
  //   // if (!existingProduction) {
  //   //   throw new NotFoundException(
  //   //     `Production order with ID ${idNumber} not found`
  //   //   );
  //   // }
  //   // const allowedFields = Object.keys(UpdateProductionSchema.shape);
  //   // const fieldsToUpdate = Object.keys(queryParams);

  //   // if (fieldsToUpdate.length === 0) {
  //   //   throw new BadRequestException('No fields provided to update');
  //   // }
  //   // const updateData: Partial<UpdateProductionDto> = {};

  //   // for (const field of fieldsToUpdate) {
  //   //   if (!allowedFields.includes(field)) {
  //   //     throw new BadRequestException(`Invalid field: ${field}`);
  //   //   }

  //   //   const value = queryParams[field];

  //   //   if (['created_by', 'updated_by', 'Production_Status'].includes(field)) {
  //   //     const numericValue = parseInt(value, 10);
  //   //     if (isNaN(numericValue)) {
  //   //       throw new BadRequestException(`Invalid number format for field: ${field}`);
  //   //     }
  //   //     updateData[field] = numericValue;
  //   //   } else {
  //   //     if (value !== undefined) {
  //   //       updateData[field] = value;
  //   //     }
  //   //   }
  //   // }

  //   // // Validar os dados utilizando o schema definido para a ordem de produção
  //   // const validation = UpdateProductionSchema.safeParse(updateData);

  //   // if (!validation.success) {
  //   //   const zodError = validation.error as ZodError;
  //   //   const firstError = zodError.errors[0];
  //   //   throw new BadRequestException(
  //   //     `${firstError.path[0]} is invalid: ${firstError.message}`
  //   //   );
  //   // }

  //   // // Atualizar a ordem de produção
  //   // const updatedProduction = await this.productionService.update(
  //   //   idNumber,
  //   //   updateData as UpdateProductionDto
  //   // );

  //   return this.stepsService.update(+id, updateStepDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   const idNumber = +id;
  //   if (isNaN(idNumber)) {
  //     throw new BadRequestException('Invalid ID format');
  //   }
  //   await this.stepsService.remove(idNumber);
  //   return { message: `Production order with ID ${idNumber} removed` };
  // }
}
