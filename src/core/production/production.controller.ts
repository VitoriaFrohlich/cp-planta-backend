import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { ProductionService } from './production.service';
import { CreateProductionDto } from './dto/create.production.dto';
import { UpdateProductionDto } from './dto/update.production.dto';
import { ApiQuery } from '@nestjs/swagger';

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
  ) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const existingProduction = await this.productionService.findOne(idNumber);
    if (!existingProduction) {
      throw new NotFoundException(
        `Production order with ID ${idNumber} not found`
      );
    }
    return this.productionService.update(+idNumber, updateProductionDto);
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
